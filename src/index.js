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
    // Show the installed version
    console.log("");
    console.log("Installed fontc version:");
    await exec.exec("fontc --version");
  } catch (error) {
    core.setFailed(
      `fontc-action failed during installation attempt with the error: ${error.message}`
    );
  }

  // Input tests
  console.log(`Received input fontc args: ${fontcArgs}`);
  console.log(`Received input file path: ${sourcePath}`);
}

run();
