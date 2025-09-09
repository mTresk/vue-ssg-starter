import type { OptimizedImagePaths } from '@/types'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import * as cheerio from 'cheerio'
import beautify from 'js-beautify'
import sharp from 'sharp'

function generateFileHash(filePath: string, width?: number, quality?: number, formats?: string[]): string {
  const fileBuffer = readFileSync(filePath)
  const hash = createHash('sha256')
    .update(fileBuffer)
    .update(`w:${width || 0}`)
    .update(`q:${quality || 0}`)
    .update(`f:${formats?.join(',') || ''}`)
    .digest('base64url')

  return hash.substring(0, 8)
}

function findImageFile(fileName: string, searchDir: string): { path: string, relativePath: string } | null {
  const files = readdirSync(searchDir)

  for (const file of files) {
    const fullPath = join(searchDir, file)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const found = findImageFile(fileName, fullPath)

      if (found) {
        return found
      }
    }
    else if (file === fileName) {
      const assetsImagesRoot = join(process.cwd(), 'src', 'assets', 'images')
      const relativePath = relative(assetsImagesRoot, fullPath)
      return { path: fullPath, relativePath }
    }
  }

  return null
}

async function optimizeImageFromDataAttrs(
  imagePath: string,
  width: number,
  quality: number,
  outputDir: string,
  existingFileName: string,
  formats: string[],
  relativeImagePath: string,
  viteFileName?: string,
): Promise<OptimizedImagePaths> {
  const { width: originalWidth, height: originalHeight } = await sharp(imagePath).metadata()

  const existingBaseName = basename(existingFileName, extname(existingFileName))
  const originalExt = extname(imagePath)
  const aspectRatio = originalHeight! / originalWidth!
  const height = Math.round(width * aspectRatio)
  const imageDir = relativeImagePath.includes('/') ? relativeImagePath.substring(0, relativeImagePath.lastIndexOf('/')) : ''
  const finalOutputDir = imageDir ? join(outputDir, imageDir) : outputDir

  if (!existsSync(finalOutputDir)) {
    mkdirSync(finalOutputDir, { recursive: true })
  }

  const results: { webp?: string, webp2x?: string, avif?: string, avif2x?: string, fallback: string } = {
    fallback: imageDir ? `/assets/images/${imageDir}/${existingFileName}` : `/assets/images/${existingFileName}`,
  }

  const existingFilePath = join(finalOutputDir, existingFileName)

  // Удаляем оригинальный файл Vite если он есть (чтобы избежать дубликатов)
  if (viteFileName) {
    const viteOriginalPath = join(outputDir, viteFileName)
    if (existsSync(viteOriginalPath)) {
      unlinkSync(viteOriginalPath)
    }
  }

  // Всегда создаем оптимизированную версию
  if (originalExt === '.jpg' || originalExt === '.jpeg') {
    await sharp(imagePath)
      .resize(width, height)
      .jpeg({ quality })
      .toFile(existingFilePath)
  }
  else {
    const compressionLevel = Math.round((100 - quality) / 100 * 9)

    await sharp(imagePath)
      .resize(width, height)
      .png({ compressionLevel, effort: 7 })
      .toFile(existingFilePath)
  }

  if (formats.includes('webp')) {
    const webpPath = join(finalOutputDir, `${existingBaseName}.webp`)

    await sharp(imagePath)
      .resize(width, height)
      .webp({ quality: Math.round(quality * 0.95) })
      .toFile(webpPath)

    results.webp = imageDir ? `/assets/images/${imageDir}/${existingBaseName}.webp` : `/assets/images/${existingBaseName}.webp`

    const webp2xPath = join(finalOutputDir, `${existingBaseName}@2x.webp`)

    await sharp(imagePath)
      .resize(width * 2, height * 2)
      .webp({ quality: Math.round(quality * 0.95) })
      .toFile(webp2xPath)

    results.webp2x = imageDir ? `/assets/images/${imageDir}/${existingBaseName}@2x.webp` : `/assets/images/${existingBaseName}@2x.webp`
  }

  if (formats.includes('avif')) {
    const avifPath = join(finalOutputDir, `${existingBaseName}.avif`)

    await sharp(imagePath)
      .resize(width, height)
      .avif({ quality: Math.round(quality * 0.85), effort: 9 })
      .toFile(avifPath)

    results.avif = imageDir ? `/assets/images/${imageDir}/${existingBaseName}.avif` : `/assets/images/${existingBaseName}.avif`

    const avif2xPath = join(finalOutputDir, `${existingBaseName}@2x.avif`)

    await sharp(imagePath)
      .resize(width * 2, height * 2)
      .avif({ quality: Math.round(quality * 0.85), effort: 9 })
      .toFile(avif2xPath)

    results.avif2x = imageDir ? `/assets/images/${imageDir}/${existingBaseName}@2x.avif` : `/assets/images/${existingBaseName}@2x.avif`
  }

  return results
}

async function processDataOptimization(content: string): Promise<string> {
  const $ = cheerio.load(content)
  const picturesWithOptimization = $('picture[data-optimize-width]')

  if (picturesWithOptimization.length === 0) {
    return content
  }

  const distDir = join(process.cwd(), 'dist')
  const assetsImagesDir = join(distDir, 'assets', 'images')

  if (!existsSync(assetsImagesDir)) {
    mkdirSync(assetsImagesDir, { recursive: true })
  }

  for (let i = 0; i < picturesWithOptimization.length; i++) {
    const picture = $(picturesWithOptimization[i])
    const img = picture.find('img')
    const src = img.attr('src')

    if (!src) {
      continue
    }

    const optimizeWidth = Number.parseInt(picture.attr('data-optimize-width')!)
    const quality = Number.parseInt(picture.attr('data-optimize-quality')!)
    const formatsStr = picture.attr('data-optimize-formats')!
    const formats = formatsStr.split(',').map(f => f.trim())
    let imageFileResult: { path: string, relativePath: string } | null = null
    let fileName: string | undefined

    if (src.startsWith('@/assets/images/') || src.startsWith('/src/assets/images/')) {
      let relativePath: string

      if (src.startsWith('@/assets/images/')) {
        relativePath = src.replace('@/assets/images/', '')
      }
      else {
        relativePath = src.replace('/src/assets/images/', '')
      }

      const fullPath = join(process.cwd(), 'src', 'assets', 'images', relativePath)

      if (existsSync(fullPath)) {
        imageFileResult = { path: fullPath, relativePath }
        const baseName = basename(relativePath, extname(relativePath))
        const ext = extname(relativePath)
        const fileHash = generateFileHash(fullPath, optimizeWidth, quality, formats)
        fileName = `${baseName}-${fileHash}${ext}`
      }
    }
    else {
      const viteFileName = basename(src)
      const originalFileName = viteFileName.replace(/-[\w-]+\.([^.]+)$/, '.$1')
      const assetsImagesRoot = join(process.cwd(), 'src', 'assets', 'images')

      imageFileResult = findImageFile(originalFileName, assetsImagesRoot)

      if (imageFileResult) {
        const baseName = basename(imageFileResult.relativePath, extname(imageFileResult.relativePath))
        const ext = extname(imageFileResult.relativePath)
        const fileHash = generateFileHash(imageFileResult.path, optimizeWidth, quality, formats)

        fileName = `${baseName}-${fileHash}${ext}`
      }
    }

    if (!imageFileResult || !fileName) {
      console.warn(`Image not found for src: ${src}`)

      continue
    }

    const viteFileName = src.startsWith('/assets/images/') ? basename(src) : undefined

    const optimizedPaths = await optimizeImageFromDataAttrs(
      imageFileResult.path,
      optimizeWidth,
      quality,
      assetsImagesDir,
      fileName,
      formats,
      imageFileResult.relativePath,
      viteFileName,
    )

    if (optimizedPaths.webp && optimizedPaths.webp2x) {
      picture.prepend(`
        <source srcset="${optimizedPaths.webp} 1x, ${optimizedPaths.webp2x} 2x" type="image/webp" />
      `)
    }

    if (optimizedPaths.avif && optimizedPaths.avif2x) {
      picture.prepend(`
        <source srcset="${optimizedPaths.avif} 1x, ${optimizedPaths.avif2x} 2x" type="image/avif" />
      `)
    }

    img.attr('src', optimizedPaths.fallback)

    picture.removeAttr('data-optimize-width')
    picture.removeAttr('data-optimize-quality')
    picture.removeAttr('data-optimize-formats')
  }

  return $.html()
}

async function postProcessDistFiles() {
  const distPath = join(process.cwd(), 'dist')

  if (!existsSync(distPath)) {
    console.error('Folder dist not found')

    return
  }

  try {
    const beautifyHtml = beautify.html
    const beautifyCss = beautify.css

    async function processDirectory(dir: string) {
      const items = readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = join(dir, item.name)

        if (item.isDirectory()) {
          await processDirectory(fullPath)
        }
        else if (item.name.endsWith('.html')) {
          const content = readFileSync(fullPath, 'utf8')

          const contentWithOptimizedImages = await processDataOptimization(content)

          const beautified = beautifyHtml(contentWithOptimizedImages, {
            indent_size: 4,
            preserve_newlines: false,
            max_preserve_newlines: 1,
            wrap_line_length: 0,
            end_with_newline: true,
            indent_inner_html: true,
            wrap_attributes: 'auto',
            wrap_attributes_indent_size: 4,
            content_unformatted: ['pre', 'textarea'],
            inline: ['span', 'strong', 'em', 'b', 'i', 'code', 'small'],
          })

          writeFileSync(fullPath, beautified, 'utf8')

          console.warn(`Post-processed HTML: ${item.name}`)
        }
        else if (item.name.endsWith('.css')) {
          const content = readFileSync(fullPath, 'utf8')

          const beautified = beautifyCss(content, {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            wrap_line_length: 160,
            end_with_newline: true,
            newline_between_rules: false,
            selector_separator_newline: true,
            space_around_combinator: true,
          })

          writeFileSync(fullPath, beautified, 'utf8')

          console.warn(`Post-processed CSS: ${item.name}`)
        }
      }
    }

    await processDirectory(distPath)
  }
  catch (error) {
    console.error('Error post-processing:', error)
  }
}

(async () => {
  await postProcessDistFiles()
})()
