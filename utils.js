import { createRequire } from 'node:module'

export const readJson = createRequire(import.meta.url)
