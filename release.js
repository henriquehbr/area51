// Updated with 521d776
// https://github.com/rollup/plugins/commit/521d7767c9ded5c054d72c174a2c65ebc816ccc6

import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'

import parser from 'conventional-commits-parser'
import chalk from 'chalk'
import execa from 'execa'
import semver from 'semver'
import writePackage from 'write-pkg'

import { __dirname } from './dirname'

const debug = true

const dirname = __dirname(import.meta.url)

const packagesPath = join(dirname, 'packages')
const { log } = console
const parserOptions = {
  noteKeywords: ['BREAKING CHANGE', 'Breaking change']
}
const reBreaking = new RegExp(`(${parserOptions.noteKeywords.join(')|(')})`)

const commitChanges = async (cwd, packageName, version) => {
  log(chalk`{blue Committing} CHANGELOG.md, package.json`)
  let params = ['add', cwd]
  await execa('git', params)

  params = ['commit', '-m', `chore(release): ${packageName} v${version}`]
  await execa('git', params)
}

const getCommits = async packageName => {
  log(chalk`{blue Gathering commits}`)

  let params = ['tag', '--list', `${packageName}-v*`, '--sort', '-v:refname']
  const { stdout: tags } = await execa('git', params)
  const [latestTag] = tags.split('\n')

  log(chalk`{blue Last release tag:}`, latestTag)

  params = ['--no-pager', 'log', `${latestTag}..HEAD`, '--format=%B%n-hash-%n%H']
  // TODO: Review
  const rePackage = new RegExp(`^[\\w\\!]+\\(${packageName}\\)`, 'i')
  const { stdout } = await execa('git', params)
  debug && log(chalk`{red [DEBUG] getCommits stdout (without monkey emoji):}`, stdout)
  const commits = stdout
    .filter(commit => {
      debug && log(chalk`{red [DEBUG] commit:}`, commit)
      const chunk = commit.trim()
      debug && log(chalk`{red [DEBUG] getCommits chunk:}`, chunk)
      return chunk && rePackage.test(chunk)
    })
    .map(commit => {
      const node = parser.sync(commit)
      debug && log(chalk`{red [DEBUG] getCommits node:}`, node)

      // TODO: Review
      node.breaking = reBreaking.test(node.body || node.footer) || /!:/.test(node.header)

      debug && log(chalk`{red [DEBUG] getCommits node.body:}`, node.body)

      return node
    })

  return commits
}

const getNewVersion = (version, commits) => {
  log(chalk`{blue Determining new version}`)
  // TODO: Review
  const intersection = process.argv.filter(arg => ['--major', '--minor', '--patch'].includes(arg))
  debug && log(chalk`{red [DEBUG] getNewVersion intersection:}`, intersection)
  if (intersection.length) return semver.inc(version, intersection[0].substring(2))

  debug && log(chalk`{red [DEBUG] getNewVersion commits:}`, commits)
  const types = new Set(commits.map(({ type }) => type))
  debug && log(chalk`{red [DEBUG] getNewVersion types:}`, types)
  const breaking = commits.some(commit => !!commits.breaking)
  const level = breaking ? 'major' : types.has('feat') ? 'minor' : 'patch'

  return semver.inc(version, level)
}

const push = async () => {
  log(chalk`{blue Pushing release and tags}`)
  await execa('git', ['push'])
  await execa('git', ['push', '--tags'])
}

const tag = async (cwd, packageName, version) => {
  const tagName = `area51-semver-changelog-monorepo/${packageName}-v${version}`
  log(chalk`\n{blue Tagging} {grey ${tagName}}`)
  await execa('git', ['tag', tagName], { cwd, stdio: 'inherit' })
}

const updateChangelog = (commits, cwd, packageName, version) => {
  log(chalk`{blue Gathering changes}`)

  const title = `# ${packageName} changelog`
  const [date] = new Date().toISOString().split('T')
  const logPath = join(cwd, 'CHANGELOG.md')
  const logFile = readFileSync(logPath, 'utf-8')
  const oldNotes = logFile.startsWith(title) ? logFile.slice(title.length).trim() : logFile
  const notes = { breaking: [], fixes: [], features: [], updates: [] }

  for (const { breaking, hash, header, type } of commits) {
    // Issues in commit message, like: (#1)
    // Maybe transform these in links leading to actual issues/commits
    const ref = /\(#\d+\)/.test(header) ? '' : ` (${hash.substring(0, 7)})`
    // Remove package name as it's redundant inside the package changelog
    const message = header.trim().replace(`(${packageName})`, '') + ref
    if (breaking) notes.breaking.push(message)
    else if (type === 'fix') notes.fixes.push(message)
    else if (type === 'feat') notes.features.push(message)
    else notes.updates.push(message)
  }

  const parts = [
    `## v${version}`,
    `_${date}_`,
    notes.breaking.length ? `### Breaking changes\n\n- ${notes.breaking.join('\n- ')}`.trim() : '',
    notes.fixes.length ? `### Bugfixes\n\n- ${notes.fixes.join('\n- ')}`.trim() : '',
    notes.features.length ? `### Features\n\n- ${notes.features.join('\n- ')}`.trim() : '',
    notes.updates.length ? `### Updates\n\n- ${notes.updates.join('\n- ')}`.trim() : ''
  ].filter(Boolean) // remove those who are falsy (empty)

  // Divide sections with a line break
  const newLog = parts.join('\n\n')

  log(chalk`{blue Updating} CHANGELOG.md`)
  const content = [title, newLog, oldNotes].filter(Boolean).join('\n\n')
  writeFileSync(logPath, content, 'utf-8')
}

const updatePackage = async (cwd, pkg, version) => {
  log(chalk`{blue Updating} package.json`)
  // FIXME: Bad practice (param-reassign)
  pkg.version = version
  await writePackage(cwd, pkg)
}

;(async () => {
  try {
    const [, , packageName] = process.argv
    const cwd = join(packagesPath, packageName)
    const pkg = require(join(cwd, 'package.json'))

    // FIXME: Nested template strings
    log(chalk`{cyan Publishing \`${packageName}\`} from {grey packages/${packageName}}`)

    const commits = await getCommits(packageName)

    if (!commits.length) {
      log(chalk`\n{red No commits found!} did you mean to publish ${packageName}`)
      return
    }

    log(chalk`{blue Found} {bold ${commits.length}} commits`)

    const newVersion = getNewVersion(pkg.version, commits)

    log(chalk`{blue New version}: ${newVersion}\n`)
    await updatePackage(cwd, pkg, newVersion)
    // FIXME: probably `await` is not needed here
    await updateChangelog(commits, cwd, packageName, newVersion)
    await commitChanges(cwd, packageName, newVersion)
    await tag(cwd, pluginName, newVersion)
    await push()
  } catch (e) {
    log(e)
  }
})()
