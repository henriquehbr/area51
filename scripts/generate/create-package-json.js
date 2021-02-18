import { join } from 'path'

import chalk from 'chalk'
import writePackage from 'write-pkg'

const { log } = console

const dryRun = process.argv.includes('--dry-run')

export const createPackageJson = (cwd, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping package.json creation}`)
    return
  }

  const packageJsonPath = join(cwd, 'package.json')
  const packageJsonContent = {
    name: `area51-semver-changelog-monorepo-${packageName}`,
    version: '0.0.0'
  }
  writePackage(packageJsonPath, packageJsonContent)
}
