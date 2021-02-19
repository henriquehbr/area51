import chalk from 'chalk'
import execa from 'execa'

import { dryRun } from './cli'

const { log } = console

export const initialCommit = async (cwd, packageName) => {
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
