import { existsSync, mkdirSync } from 'fs'
import { join, parse } from 'path'
import { packagesPath } from '../../utils/packages-path'

import chalk from 'chalk'
import execa from 'execa'
import writePackage from 'write-pkg'

const { log } = console
const dryRun = process.argv.includes('--dry-run')

const createDirectory = packagePath => {
  if (dryRun) {
    log(chalk`{yellow Skipping directory creation}`)
    return
  }

  log(chalk`{blue Creating directory}`)
  mkdirSync(packagePath)
}

const createPackageJson = (packagePath, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping package.json creation}`)
    return
  }

  const packageJsonPath = join(packagePath, 'package.json')
  const packageJsonContent = {
    name: `area51-semver-changelog-monorepo-${packageName}`,
    version: '0.0.0'
  }
  writePackage(packageJsonPath, packageJsonContent)
}

const initialCommit = async (packagePath, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping initial commit}`)
    return
  }

  let params = ['add', '.']
  await execa('git', params, { cwd: packagePath })

  log(chalk`{blue Committing package.json}`)

  params = [
    'commit',
    '-m',
    `chore(release): area51-semver-changelog-monorepo-${packageName} v0.0.0`
  ]
  await execa('git', params)
}

const tag = async (packagePath, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping Git tag}`)
    return
  }

  const tagName = `area51-semver-changelog-monorepo/${packageName}`
  log(chalk`\n{blue Tagging} {grey ${tagName}}`)
  await execa('git', ['tag', tagName], { cwd: packagePath, stdio: 'inherit' })
}

// TODO: replace `packagePath` with `cwd`
try {
  const [, , packageName] = process.argv
  const packagePath = join(packagesPath, packageName)

  dryRun && log(chalk`{magenta DRY RUN:} No files will be modified`)

  log(chalk`{cyan Generating \`${packageName}\`} on {grey packages/${packageName}}`)

  if (existsSync(packagePath))
    throw chalk`{red Package already exists!} did you mean to generate ${packageName}?`

  createDirectory(packagePath)
  createPackageJson(packagePath, packageName)
  initialCommit(packagePath, packageName)
  tag(packagePath, packageName)
} catch (e) {
  log(e)
}
