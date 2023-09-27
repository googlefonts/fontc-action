const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
  const fontcVersionTag = core.getInput("version-tag");
  const fontcBranch = core.getInput("branch");
  const fontcGitSha = core.getInput("commit-sha");
  const fontcArgs = core.getInput("args");
  const sourcePath = core.getInput("source-path");

  // ==================
  // Install fontc
  // ==================
  try {
    if (fontcGitSha !== "none") {
      await exec.exec(
        `cargo install --rev ${fontcGitSha} --git https://github.com/googlefonts/fontc.git`
      );
    } else if (fontcBranch !== "main") {
      await exec.exec(
        `cargo install --branch ${fontcBranch} --git https://github.com/googlefonts/fontc.git`
      );
    } else if (fontcVersionTag !== "none") {
      await exec.exec(
        `cargo install --tag ${fontcVersionTag} --git https://github.com/googlefonts/fontc.git main`
      );
    } else {
      await exec.exec(
        "cargo install --branch main --git https://github.com/googlefonts/fontc.git"
      );
    }
  } catch (error) {
    core.setFailed(
      `fontc-action failed during installation attempt with the error: ${error.message}`
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
