import { join } from 'path'

import chalk from 'chalk'
import writePackage from 'write-pkg'

import { dryRun } from './cli'

const { log } = console

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
