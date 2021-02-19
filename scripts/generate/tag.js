import chalk from 'chalk'
import execa from 'execa'

import { dryRun, noTag } from './cli'

const { log } = console

export const tag = async (cwd, packageName) => {
  if (dryRun || noTag) {
    log(chalk`{yellow Skipping Git tag}`)
    return
  }

  const tagName = `area51-semver-changelog-monorepo/${packageName}-v0.0.0`
  log(chalk`\n{blue Tagging} {grey ${tagName}}`)
  await execa('git', ['tag', tagName], { cwd, stdio: 'inherit' })
}
