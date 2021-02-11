# `semver-changelog-monorepo`

> Monorepo with built-in changelog generation and semantic versioning capabilities

## Concept

This subject aims to provide support for releasing individual packages in a monorepo (without bumping unneeded/unchanges packages on each release), while also keeping the good sides of Lerna, like, verifying if a package has changes before releasing, automatic version bumping based on [conventional commits](https://www.conventionalcommits.org/), heavily insipred by [`@rollup/plugins`](https://github.com/rollup/plugins/) [release script](https://github.com/rollup/plugins/blob/master/scripts/publish.js)

The following steps are performed in a specific package:

- Gathers commits from the last release tag
- Determines the next appropriate version bump (major, minor, or patch)
- Updates `package.json`
- Generates a new changelog entry
- Updates `CHANGELOG.md` for the target package
- Commits package.json and `CHANGELOG.md`, with a commit message is in the form `chore(release): <name>-v<version>`
- Tags the release in the form `<name>-v<version>` (e.g. `beep-v0.1.0`)
