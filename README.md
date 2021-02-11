# `semver-changelog-monorepo`

> Monorepo with built-in changelog generation and semantic versioning capabilities

## Concept

This subject aims to provide support for releasing individual packages in a monorepo (without bumping unneeded/unchanges packages on each release), while also keeping the good sides of Lerna, like, verifying if a package has changes before releasing, automatic version bumping based on [conventional commits](https://www.conventionalcommits.org/), heavily insipred by [`@rollup/plugins`](https://github.com/rollup/plugins/) [release script](https://github.com/rollup/plugins/blob/master/scripts/publish.js)
