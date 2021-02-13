import chalk from 'chalk'
import execa from 'execa'
import { existsSync } from 'fs'
import { join, parse } from 'path'
import { packagesPath } from '../../utils/packages-path'

const { log } = console
const dryRun = process.argv.includes('--dry-run')

const createPackage = packagePath => {
  execa('git', ['init', packagePath])
}

try {
  const [, , packageName] = process.argv
  const packagePath = join(packagesPath, packageName)

  dryRun && log(chalk`{magenta DRY RUN:} No files will be modified`)

  log(chalk`{cyan Generating \`${packageName}\`} on {grey packages/${packageName}}`)

  if (existsSync(packagePath))
    throw chalk`{red Package already exists!} did you mean to generate ${packageName}?`

  createPackage(packagePath)
} catch (e) {
  log(e)
}
