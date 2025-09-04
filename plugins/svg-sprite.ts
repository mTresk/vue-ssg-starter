import type { Plugin } from 'vite'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

interface SvgSpriteOptions {
  iconsDir?: string
  spriteName?: string
  outputDir?: string
}

export default function svgSprite(options: SvgSpriteOptions = {}): Plugin {
  const {
    iconsDir = 'src/assets/icons',
    spriteName = 'icons.svg',
    outputDir = 'public/images',
  } = options

  let config: any

  const createSprite = (svgFiles: Array<{ name: string, content: string }>) => {
    const symbols = svgFiles.map(({ name, content }) => {
      const svgContent = content
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '')
        .trim()

      const viewBoxMatch = content.match(/viewBox="([^"]*)"/)
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

      return `<symbol id="${name}" viewBox="${viewBox}">${svgContent}</symbol>`
    }).join('\n\t')

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
\t${symbols}
</svg>`
  }

  const generateSpriteForServer = async () => {
    try {
      const iconsPath = join(config.root, iconsDir)

      if (!statSync(iconsPath, { throwIfNoEntry: false })?.isDirectory()) {
        return null
      }

      const svgFiles = readdirSync(iconsPath)
        .filter(file => extname(file) === '.svg')
        .map(file => ({
          name: basename(file, '.svg'),
          content: readFileSync(join(iconsPath, file), 'utf-8'),
        }))

      if (svgFiles.length === 0) {
        return null
      }

      return createSprite(svgFiles)
    }
    catch (error) {
      console.warn('SVG Sprite server generation failed:', error)

      return null
    }
  }

  const generateSprite = async () => {
    try {
      const iconsPath = join(config.root, iconsDir)
      const outputPath = join(config.root, outputDir, spriteName)

      if (!statSync(iconsPath, { throwIfNoEntry: false })?.isDirectory()) {
        return
      }

      const svgFiles = readdirSync(iconsPath)
        .filter(file => extname(file) === '.svg')
        .map(file => ({
          name: basename(file, '.svg'),
          content: readFileSync(join(iconsPath, file), 'utf-8'),
        }))

      if (svgFiles.length === 0) {
        return
      }

      const sprite = createSprite(svgFiles)

      if (config.command === 'build') {
        const { existsSync, mkdirSync, writeFileSync } = await import('node:fs')
        const { dirname } = await import('node:path')
        const outputDirPath = dirname(outputPath)

        if (!existsSync(outputDirPath)) {
          mkdirSync(outputDirPath, { recursive: true })
        }

        writeFileSync(outputPath, sprite)
        console.warn(`SVG Sprite generated: ${outputPath}`)
      }
    }
    catch (error) {
      console.warn('SVG Sprite generation failed:', error)
    }
  }

  return {
    name: 'svg-sprite',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(server) {
      server.middlewares.use('/images/icons.svg', async (_, res, next) => {
        try {
          const sprite = await generateSpriteForServer()
          if (sprite) {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(sprite)
          }
          else {
            next()
          }
        }
        catch (error) {
          console.warn('SVG Sprite server generation failed:', error)
          next()
        }
      })
    },
    buildStart() {
      generateSprite()
    },
    handleHotUpdate({ file }) {
      if (file.includes(iconsDir) && extname(file) === '.svg') {
        generateSprite()
      }
    },
    generateBundle() {
      generateSprite()
    },
  }
}
