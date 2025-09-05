import fs from 'node:fs'
import { glob } from 'glob'

function convertPxToRem(content: string, filePath: string): string {
  if (filePath.endsWith('.vue')) {
    return content.replace(/<template[^>]*>([\s\S]*?)<\/template>|(-?\d+(?:\.\d+)?)px/g, (match, templateContent, pxValue) => {
      if (templateContent !== undefined) {
        return match
      }

      return `rem(${pxValue})`
    })
  }

  return content.replace(/(-?\d+(?:\.\d+)?)px/g, 'rem($1)')
}

function fixNegativeRem(content: string): string {
  return content.replace(/-rem\((\d+(?:\.\d+)?)\)/g, 'rem(-$1)')
}

async function processFiles(): Promise<void> {
  try {
    const files = await glob('src/**/*.{css,scss,vue}')

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      let newContent = convertPxToRem(content, file)

      newContent = fixNegativeRem(newContent)

      if (content !== newContent) {
        fs.writeFileSync(file, newContent)
      }
    }
  }
  catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

processFiles()
