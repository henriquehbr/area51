import { publish } from 'libnpmpublish'
import pacote from 'pacote'

import packageJson from './package.json'

const { name, version } = packageJson

const manifest = await pacote.manifest(process.cwd())
const tarData = await pacote.tarball(process.cwd())

await publish(manifest, tarData, {
  npmVersion: `${name}@${version}`
})
