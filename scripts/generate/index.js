import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { packagesPath } from '../../utils/packages-path'

import chalk from 'chalk'
import execa from 'execa'
import writePackage from 'write-pkg'

const { log } = console
const dryRun = process.argv.includes('--dry-run')

const createDirectory = cwd => {
  if (dryRun) {
    log(chalk`{yellow Skipping directory creation}`)
    return
  }

  log(chalk`{blue Creating directory}`)
  mkdirSync(cwd)
}

const createPackageJson = (cwd, packageName) => {
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

const initialCommit = async (cwd, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping initial commit}`)
    return
  }

  let params = ['add', cwd]
  await execa('git', params)

  log(chalk`{blue Committing package.json}`)

  params = [
    'commit',
    '-m',
    `chore(release): area51-semver-changelog-monorepo-${packageName} v0.0.0`
  ]
  await execa('git', params)
}

const tag = async (cwd, packageName) => {
  if (dryRun) {
    log(chalk`{yellow Skipping Git tag}`)
    return
  }

  const tagName = `area51-semver-changelog-monorepo/${packageName}-v0.0.0`
  log(chalk`\n{blue Tagging} {grey ${tagName}}`)
  await execa('git', ['tag', tagName], { cwd, stdio: 'inherit' })
}

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
} catch (e) {
  log(e)
}
