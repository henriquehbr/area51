import { __dirname } from './dirname'
import { join } from 'path'

const dirname = __dirname(import.meta.url)

export const packagesPath = join(dirname, '..', 'packages')
