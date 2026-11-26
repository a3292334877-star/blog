import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const realRoot = realpathSync(process.cwd())
if (realRoot !== process.cwd()) {
  process.chdir(realRoot)
}

await import(pathToFileURL(resolve(realRoot, 'node_modules/vitepress/bin/vitepress.js')).href)
