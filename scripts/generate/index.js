import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import chalk from 'chalk'

import { createDirectory } from './create-directory'
import { createPackageJson } from './create-package-json'
import { initialCommit } from './initial-commit'
import { tag } from './tag'
import { push } from './push'
import { packagesPath } from '../../utils/packages-path'

const { log } = console
const dryRun = process.argv.includes('--dry-run')

try {
  const [, , packageName] = process.argv
  const cwd = join(packagesPath, packageName)

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
