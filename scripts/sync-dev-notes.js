const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const projectRoot = path.resolve(__dirname, '..')
const repoDir = path.join(projectRoot, '.external', 'LearnByCompany')
const postsDir = path.join(projectRoot, 'source', '_posts', 'dev-notes')
const assetsDir = path.join(projectRoot, 'source', 'dev-notes-assets')
const hubDir = path.join(projectRoot, 'source', 'dev-notes')
const repoUrl = 'https://github.com/Sarfffff/LearnByCompany.git'

function runGit (args, cwd = projectRoot, capture = false) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    const detail = capture ? result.stderr.trim() : `exit code ${result.status}`
    throw new Error(`git ${args.join(' ')} failed: ${detail}`)
  }
  return capture ? result.stdout.trim() : ''
}

function ensureRepository () {
  if (fs.existsSync(path.join(repoDir, '.git'))) {
    runGit(['pull', '--ff-only'], repoDir)
    return
  }
  fs.mkdirSync(path.dirname(repoDir), { recursive: true })
  runGit(['clone', repoUrl, repoDir])
}

function walkFiles (dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath]
  })
}

function toPosix (value) {
  return value.split(path.sep).join('/')
}

function yamlString (value) {
  return JSON.stringify(value)
}

function slugifyPath (relativePath) {
  return relativePath
    .replace(/\.md$/i, '')
    .split('/')
    .map(part => part.trim().replace(/[\\/:*?"<>|#%]/g, '-').replace(/\s+/g, '-'))
    .filter(Boolean)
    .join('-')
}

function stripFrontMatter (content) {
  return content.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n/, '')
}

function encodeAssetUrl (name) {
  return `/dev-notes-assets/${encodeURIComponent(name).replace(/%2F/gi, '/')}`
}

function rewriteObsidianImages (content) {
  return content.replace(/!\[\[([^\]|]+?)(?:\\?\|([^\]]+))?\]\]/g, (_, rawName, rawWidth) => {
    const name = path.basename(rawName.trim())
    const width = rawWidth && /^\d+$/.test(rawWidth.trim()) ? ` style="max-width:${rawWidth.trim()}px"` : ''
    return `<img src="${encodeAssetUrl(name)}" alt="${name}"${width}>`
  })
}

function rewriteMarkdownImages (content) {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, rawTarget) => {
    const target = rawTarget.trim().replace(/^<|>$/g, '')
    const imageMarker = target.toLowerCase().lastIndexOf('image/')
    if (imageMarker === -1) return match
    const name = path.basename(target.slice(imageMarker + 6))
    return `![${alt}](${encodeAssetUrl(name)})`
  })
}

function resolveInternalLinks (content, sourceRelativePath, permalinkByFile) {
  return content.replace(/\[([^\]]+)\]\(([^)]+\.md(?:#[^)]*)?)\)/g, (match, label, rawTarget) => {
    const [targetPath, hash = ''] = rawTarget.replace(/\\/g, '/').split('#', 2)
    const sourceDir = path.posix.dirname(sourceRelativePath)
    const resolved = path.posix.normalize(path.posix.join(sourceDir, decodeURIComponent(targetPath)))
    const permalink = permalinkByFile.get(resolved)
    return permalink ? `[${label}](${permalink}${hash ? `#${hash}` : ''})` : match
  })
}

function fileDate (relativePath) {
  const value = runGit(['log', '-1', '--format=%aI', '--', relativePath], repoDir, true)
  return value || new Date().toISOString()
}

function copyAssets () {
  const sourceAssets = path.join(repoDir, 'image')
  fs.rmSync(assetsDir, { recursive: true, force: true })
  if (!fs.existsSync(sourceAssets)) return

  for (const file of walkFiles(sourceAssets)) {
    if (file.toLowerCase().endsWith('.md')) continue

    const relativePath = path.relative(sourceAssets, file)
    const destination = path.join(assetsDir, relativePath)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(file, destination)
  }
}

function buildHub (groups, commit) {
  const sections = [...groups.entries()].map(([group, entries]) => {
    const cards = entries
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      .map(entry => `<a class="dev-note-card" href="${entry.permalink}"><strong>${entry.title}</strong><span>${entry.relativePath}</span></a>`)
      .join('\n')
    return `<section class="dev-note-group"><h3>${group}<small>${entries.length} 篇</small></h3><div class="dev-note-grid">${cards}</div></section>`
  }).join('\n')

  const content = `---
title: 研发手记
date: ${new Date().toISOString()}
type: dev-notes
comments: false
aside: true
---

<style>
.dev-notes-page{display:grid;gap:22px}.dev-notes-hero{padding:36px;border-radius:8px;color:#fff;background:linear-gradient(110deg,rgba(15,25,43,.98),rgba(22,83,80,.9));box-shadow:0 18px 48px rgba(20,32,50,.12)}.dev-notes-hero h2{margin:0 0 10px;color:#fff;font-size:34px}.dev-notes-hero p{max-width:760px;margin:0;color:rgba(255,255,255,.75);line-height:1.8}.dev-notes-meta{display:flex;gap:24px;margin-top:20px;color:rgba(255,255,255,.62);font-size:13px}.dev-note-group{padding:28px;border:1px solid rgba(125,143,165,.2);border-radius:8px;background:rgba(255,255,255,.92)}.dev-note-group h3{display:flex;align-items:center;justify-content:space-between;margin:0 0 18px;color:#172235}.dev-note-group h3 small{color:#738096;font-size:12px}.dev-note-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.dev-note-card{display:grid;gap:5px;padding:16px;border:1px solid rgba(125,143,165,.18);border-radius:6px;color:#172235;background:#f7f9fb;transition:.2s}.dev-note-card:hover{transform:translateY(-2px);border-color:#39c5bb}.dev-note-card span{overflow:hidden;color:#738096;font-size:12px;text-overflow:ellipsis;white-space:nowrap}[data-theme=dark] .dev-note-group{border-color:rgba(255,255,255,.1);background:rgba(20,27,40,.94)}[data-theme=dark] .dev-note-group h3,[data-theme=dark] .dev-note-card{color:#edf4ff}[data-theme=dark] .dev-note-card{border-color:rgba(255,255,255,.1);background:#192233}@media(max-width:720px){.dev-notes-hero{padding:26px}.dev-note-group{padding:20px}.dev-note-grid{grid-template-columns:1fr}}
</style>

<div class="dev-notes-page">
  <section class="dev-notes-hero"><h2>研发手记</h2><p>来自 LearnByCompany 仓库的客户端开发、工程协作、系统拆解与技术学习记录。内容按原始目录同步，保留代码、截图和文档结构。</p><div class="dev-notes-meta"><span>${[...groups.values()].reduce((sum, items) => sum + items.length, 0)} 篇文档</span><span>同步提交 ${commit.slice(0, 7)}</span><a href="${repoUrl.replace('.git', '')}" target="_blank" rel="noopener">查看 GitHub</a></div></section>
  ${sections}
</div>
`
  fs.mkdirSync(hubDir, { recursive: true })
  fs.writeFileSync(path.join(hubDir, 'index.md'), content, 'utf8')
}

function sync () {
  ensureRepository()
  fs.rmSync(postsDir, { recursive: true, force: true })
  fs.mkdirSync(postsDir, { recursive: true })
  copyAssets()

  const markdownFiles = walkFiles(repoDir)
    .filter(file => file.toLowerCase().endsWith('.md'))
    .filter(file => !toPosix(path.relative(repoDir, file)).startsWith('.git/'))

  const records = markdownFiles.map(file => {
    const relativePath = toPosix(path.relative(repoDir, file))
    const title = path.basename(file, '.md')
    const slug = slugifyPath(relativePath)
    return { file, relativePath, title, slug, permalink: `/dev-notes/${encodeURI(slug)}/` }
  })
  const permalinkByFile = new Map(records.map(record => [record.relativePath, record.permalink]))
  const groups = new Map()

  for (const record of records) {
    const segments = record.relativePath.split('/')
    const group = segments.length > 1 ? segments[0] : '综合记录'
    const date = fileDate(record.relativePath)
    let body = fs.readFileSync(record.file, 'utf8')
    body = stripFrontMatter(body)
    body = rewriteObsidianImages(body)
    body = rewriteMarkdownImages(body)
    body = resolveInternalLinks(body, record.relativePath, permalinkByFile)

    const sourceUrl = `${repoUrl.replace('.git', '')}/blob/main/${record.relativePath.split('/').map(encodeURIComponent).join('/')}`
    const frontMatter = `---\ntitle: ${yamlString(record.title)}\ndate: ${date}\nupdated: ${date}\npermalink: ${record.permalink}\ncategories:\n  - 研发手记\n  - ${yamlString(group)}\ntags:\n  - 研发手记\n  - ${yamlString(group)}\nsource_repo: ${repoUrl.replace('.git', '')}\n---\n\n`
    const footer = `\n\n---\n\n> 本文从 [LearnByCompany 原始文档](${sourceUrl}) 自动同步。\n`
    fs.writeFileSync(path.join(postsDir, `${record.slug}.md`), frontMatter + body.trim() + footer, 'utf8')

    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(record)
  }

  const commit = runGit(['rev-parse', 'HEAD'], repoDir, true)
  buildHub(groups, commit)
  console.log(`Synced ${records.length} documents from LearnByCompany at ${commit.slice(0, 7)}.`)
}

if (require.main === module) sync()

module.exports = sync
