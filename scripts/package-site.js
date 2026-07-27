const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

function packageSite () {
  const projectRoot = path.resolve(__dirname, '..')
  const publicDir = path.join(projectRoot, 'public')
  const deployDir = path.join(projectRoot, 'deploy')
  const archivePath = path.join(deployDir, 'lifeatlas-site.tar.gz')

  if (!fs.existsSync(publicDir)) {
    throw new Error("public directory does not exist. Run 'pnpm run build' first.")
  }

  fs.mkdirSync(deployDir, { recursive: true })

  const result = spawnSync('tar', ['-czf', archivePath, '-C', publicDir, '.'], {
    stdio: 'inherit'
  })

  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`tar failed with exit code ${result.status}`)

  const archive = fs.readFileSync(archivePath)
  const hash = crypto.createHash('sha256').update(archive).digest('hex').toUpperCase()

  console.log(`Package: ${archivePath}`)
  console.log(`Size: ${archive.length} bytes`)
  console.log(`SHA256: ${hash}`)
}

if (require.main === module) packageSite()

module.exports = packageSite

