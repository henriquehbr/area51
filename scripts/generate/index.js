import { existsSync } from 'fs'
import { parse } from 'path'

import minimist from 'minimist'
import chalk from 'chalk'

import { createDirectory } from './create-directory'
import { createPackageJson } from './create-package-json'
import { initialCommit } from './initial-commit'
import { tag } from './tag'
import { push } from './push'
import { _, dryRun } from './cli'

const { log } = console

try {
  const cwd = _[0] || process.cwd()
  const { name: packageName } = parse(cwd)

  dryRun && log(chalk`{magenta DRY RUN:} No files will be modified`)

  log(chalk`{cyan Generating \`${packageName}\`} on {grey packages/${packageName}}`)

  if (existsSync(cwd))
    throw chalk`{red Package already exists!} did you mean to generate ${packageName}?`

  createDirectory(cwd)
  createPackageJson(cwd, packageName)
  await initialCommit(cwd, packageName)
  await tag(cwd, packageName)
  await push()
} catch (e) {
  log(e)
}
