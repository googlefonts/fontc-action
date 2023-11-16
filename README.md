# fontc-action GitHub Action

**!! NOTE !! The fontc compiler is not production ready yet and this Action is intended for compiler testing purposes only at the moment.**

fontc-action supports font compilation with the Rust [fontc compiler](https://github.com/googlefonts/fontc) in GitHub Actions Workflows.  This Action is intended to be a configurable and reproducible approach to compile font files in a remote CI/CD Workflow.  The goal is to allow font developers to configure the fontc compiler installation down to the git tagged release version or development branch commit level, and build your fonts with the addition of a few lines to a font project GitHub Action  configuration file.

## Quick Start

Create a yaml formatted GitHub Actions configuration file on your source repository directory path `.github/workflows`. Please review the GitHub Actions documentation for detailed instructions on the configuation file syntax.

### Example Workflow

The GitHub Action Workflow steps for the use of this Action include:

1. Check out your font project source repository (actions/checkout)
2. Install a Rust toolchain (actions-rs/toolchain)
3. Install `fontc` and compile fonts with this fontc-action

Assuming a font project with a repository source path of `src/TestFont.glyphs`, you might configure a build on every commit pushed to your repository with the following Workflow configuration:

```yaml
name: Install fontc and Compile Fonts

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    name: Build fonts
    steps:
      - name: Check out font project source repository
        uses: actions/checkout@v4
      - name: Install the latest stable Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Install fontc and compile fonts
        uses: googlefonts/fontc-action@main
        with:
          source-path: src/TestFont.glyphs
```

Please see the Inputs documentation below for additional compiler installation and execution configuration options.

## Inputs

### Source Path Input (Mandatory)

Include the following input under the `with:` line of the fontc-action configuration:

#### `source-path`

**Mandatory** The relative path to the font project source file from the root of the font project source repository.

```yaml
  source-path: src/CoolFont.designspace
```

### Installation Configuration Inputs (Optional)

The following inputs are optional and exclusive.  Please include up to one of these inputs under the `with:` line of the fontc-action configuration.  If you do not specify an installation configuration input, `fontc` will be installed from the compiler source as defined by the HEAD commit of the git repository main branch.

#### `version-tag`

**Optional** Install `fontc` as defined by a git version tag commit. Default: `none`

```yaml
  version-tag: "v1.0.0"
```

#### `branch`

**Optional** Install `fontc` as defined by the HEAD commit of a named git branch. Default: `none`

```yaml
  branch: special-branch
```

#### `commit-sha`

**Optional** Install `fontc` as defined by a git commit SHA hash value.  Default: `none`

```yaml
  commit-sha: a60f59e84f88f5b7f0e3e846a9d566870c7391ef
```

### Execution Configuration Inputs (Optional)

fontc-action uses the default `fontc` compiler option definitions to build fonts.  Define optional compiler arguments with the following input.

#### `args`

**Optional** A space-separated list of `fontc` command line options to be used in the font compile.  Define these options with the same syntax that you would use on the command line.  Please refer to the `fontc` documentation for available options. Default: `none`

```yaml
  args: --flatten-components
```

#### `debug`

**Optional** Use a fontc compiler debug build for font compilation.  Set the value to `true` to use a debug build. Do not define the field in your workflow or set to `false` to use a release build.

```yaml
  debug: true
```

## Outputs

None

## License

Apache License Version 2.0.  Please see [LICENSE](LICENSE) for the full text of the license.
