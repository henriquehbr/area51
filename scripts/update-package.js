import chalk from 'chalk'
import writePackage from 'write-pkg'

const { log } = console
const dryRun = process.argv.includes('--dry-run')

export const updatePackage = async (cwd, pkg, version) => {
  if (dryRun) {
    log(chalk`{yellow Skipping package.json update}`)
    return
  }

  log(chalk`{blue Updating} package.json`)
  const pkgJson = Object.assign({}, pkg)
  pkgJson.version = version
  await writePackage(cwd, pkgJson)
}
