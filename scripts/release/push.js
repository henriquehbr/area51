import execa from 'execa'
import chalk from 'chalk'

const { log } = console
const dryRun = process.argv.includes('--dry-run')
const noPush = process.argv.includes('--no-push')

export const push = async () => {
  if (dryRun || noPush) {
    log(chalk`{yellow Skipping Git push}`)
    return
  }

  log(chalk`{blue Pushing release and tags}`)
  await execa('git', ['push'])
  await execa('git', ['push', '--tags'])
}
