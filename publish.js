import { publish } from 'libnpmpublish'
import { manifest, tarball } from 'pacote'

import { name, version } from './package.json'

const manifest = await manifest(process.cwd())
const tarData = await tarball(process.cwd())

await publish(manifest, tarData, {
  npmVersion: `${name}@${version}`
})
