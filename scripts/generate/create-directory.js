import { mkdirSync } from 'fs'

import chalk from 'chalk'

import { dryRun } from './cli'

const { log } = console

export const createDirectory = cwd => {
  if (dryRun) {
    log(chalk`{yellow Skipping directory creation}`)
    return
  }

  log(chalk`{blue Creating directory}`)
  mkdirSync(cwd)
}
