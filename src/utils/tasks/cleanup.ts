import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function cleanup() {
  const distPath = join(process.cwd(), 'dist')
  const vitePath = join(distPath, '.vite')

  if (!existsSync(distPath)) {
    console.error('Folder dist not found')
    return
  }

  try {
    if (existsSync(vitePath)) {
      rmSync(vitePath, { recursive: true, force: true })
    }

    removeAppWrapper(distPath)
  }
  catch (error) {
    console.error('Error during removing .vite folder:', error)
  }
}

function removeAppWrapper(dir: string) {
  try {
    const items = readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = join(dir, item.name)

      if (item.isDirectory()) {
        removeAppWrapper(fullPath)
      }
      else if (item.name.endsWith('.html')) {
        const content = readFileSync(fullPath, 'utf8')

        const updatedContent = content
          .replace(/<div id="app"[^>]*>\s*/, '')
          .replace(/\s*<\/div>\s*<\/body>/, '</body>')

        writeFileSync(fullPath, updatedContent, 'utf8')
      }
    }
  }
  catch (error) {
    console.error('Error removing app wrapper:', error)
  }
}

cleanup()
