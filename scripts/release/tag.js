import chalk from 'chalk'
import execa from 'execa'

const { log } = console
const dryRun = process.argv.includes('--dry-run')
const noTag = process.argv.includes('--no-tag')

export const tag = async (cwd, packageName, version) => {
  if (dryRun || noTag) {
    log(chalk`{yellow Skipping Git tag}`)
    return
  }

  const tagName = `area51-semver-changelog-monorepo/${packageName}-v${version}`
  log(chalk`\n{blue Tagging} {grey ${tagName}}`)
  await execa('git', ['tag', tagName], { cwd, stdio: 'inherit' })
}
