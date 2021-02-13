import { mkdirSync } from 'fs'

import chalk from 'chalk'

const { log } = console

const dryRun = process.argv.includes('--dry-run')

export const createDirectory = cwd => {
  if (dryRun) {
    log(chalk`{yellow Skipping directory creation}`)
    return
  }

  log(chalk`{blue Creating directory}`)
  mkdirSync(cwd)
}
