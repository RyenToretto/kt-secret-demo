import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const name = process.argv[2] || 'u'
const LOADING_DIR = resolve(root, 'loading')
const TEMPLATE = resolve(root, 'src/loading/u.html')
const IIFE_JS = resolve(root, 'dist/index.global.js')

rmSync(LOADING_DIR, { recursive: true, force: true })
mkdirSync(LOADING_DIR, { recursive: true })

const template = readFileSync(TEMPLATE, 'utf-8')
const iifeJs = readFileSync(IIFE_JS, 'utf-8')

const output = template.replace(
  '<!-- __KT_SECRET_INLINE__ -->',
  '<script>' + iifeJs + '</' + 'script>'
)

const outFile = resolve(LOADING_DIR, name + '.html')
writeFileSync(outFile, output, 'utf-8')

const sizeKB = (Buffer.byteLength(output, 'utf-8') / 1024).toFixed(1)
console.log(`✅ loading/${name}.html (${sizeKB} KB)`)
