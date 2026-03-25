import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const LOADING_DIR = resolve(root, 'loading')
const SRC_DIR = resolve(root, 'src/loading')
const IIFE_JS = resolve(root, 'dist/index.global.js')

const pages = process.argv.slice(2)
if (!pages.length) {
  console.error('用法: node scripts/build-loading.mjs <page> [page2 ...]')
  console.error('示例: node scripts/build-loading.mjs u')
  console.error('示例: node scripts/build-loading.mjs callback')
  console.error('示例: node scripts/build-loading.mjs u callback')
  process.exit(1)
}

rmSync(LOADING_DIR, { recursive: true, force: true })
mkdirSync(LOADING_DIR, { recursive: true })

let iifeJs = null

for (const name of pages) {
  const srcFile = resolve(SRC_DIR, name + '.html')
  if (!existsSync(srcFile)) {
    console.error(`❌ 模板不存在: src/loading/${name}.html`)
    process.exit(1)
  }

  let html = readFileSync(srcFile, 'utf-8')

  if (html.includes('<!-- __KT_SECRET_INLINE__ -->')) {
    if (!iifeJs) iifeJs = readFileSync(IIFE_JS, 'utf-8')
    html = html.replace('<!-- __KT_SECRET_INLINE__ -->', '<script>' + iifeJs + '</' + 'script>')
  }

  const outFile = resolve(LOADING_DIR, name + '.html')
  writeFileSync(outFile, html, 'utf-8')

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)
  console.log(`✅ loading/${name}.html (${sizeKB} KB)`)
}
