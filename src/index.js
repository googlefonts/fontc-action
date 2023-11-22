const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
  const fontcVersionTag = core.getInput("version-tag");
  const fontcBranch = core.getInput("branch");
  const fontcGitSha = core.getInput("commit-sha");
  const fontcArgs = core.getInput("args");
  const sourcePath = core.getInput("source-path");
  const useDebugBuild = core.getInput("debug");

  // ==================
  // Install fontc
  // ==================
  try {
    let buildCommand = "";
    if (useDebugBuild === "false") {
      buildCommand = "cargo install";
    } else if (useDebugBuild === "true") {
      buildCommand = "cargo install --debug";
    } else {
      core.setFailed(
        "fontc-action failed during the attempt to compile fontc. " +
          "Please define either 'true' or 'false' in the Action workflow debug configuration."
      );
    }

    if (fontcGitSha !== "none") {
      await exec.exec(
        `${buildCommand} --rev ${fontcGitSha} --git https://github.com/googlefonts/fontc.git fontc`
      );
    } else if (fontcBranch !== "main") {
      await exec.exec(
        `${buildCommand} --branch ${fontcBranch} --git https://github.com/googlefonts/fontc.git fontc`
      );
    } else if (fontcVersionTag !== "none") {
      await exec.exec(
        `${buildCommand} --tag ${fontcVersionTag} --git https://github.com/googlefonts/fontc.git fontc`
      );
    } else {
      await exec.exec(
        `${buildCommand} --branch main --git https://github.com/googlefonts/fontc.git fontc`
      );
    }
  } catch (error) {
    core.setFailed(
      `fontc-action failed during installation attempt with the error: ${error.message}`
    );
  }

  // =====================================
  // Report installed fontc build version
  // =====================================
  try {
    await exec.exec(`fontc --vv`);
  } catch (error) {
    core.setFailed(
      `fontc-action failed during attempt to report fontc version: ${error.message}`
    );
  }

  // ==================
  // Build font(s)
  // ==================
  try {
    if (fontcArgs !== "none") {
      await exec.exec(`fontc ${fontcArgs} --source ${sourcePath}`);
    } else {
      await exec.exec(`fontc --source ${sourcePath}`);
    }
  } catch (error) {
    core.setFailed(
      `fontc-action failed during font compile attempt with the error: ${error.message}`
    );
  }

  // Exit status message
  console.log("Build complete.");
} // end run

run();
