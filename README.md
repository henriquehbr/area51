# `area51-standard-version`

> Changelog generation and git-based automated semantic versioning

This subject is a PoC of a cleaner and more organized changelog generation system (in constrast to [auto-changelog](https://github.com/cookpete/auto-changelog)), which makes use of conventional commit messages to determine the next version number

## Usage

In order to release a new version, just run:

```
$ yarn|npm release
```

And a new commit (tagged with the new version) containing the generated changelog will be created

For pre-releases, run:

```
$ yarn|npm pre-release alpha|beta
```
