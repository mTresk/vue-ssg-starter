import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

async function findFiles(dir: string, extensions: string[], baseDir: string = dir): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const subFiles = await findFiles(fullPath, extensions, baseDir)
        files.push(...subFiles)
      }
      else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        const relativePath = fullPath.replace(baseDir, '').replace(/\\/g, '/')
        files.push(`@${relativePath}`)
      }
    }
  }
  catch (error) {
    console.error(`Error scanning directory ${dir}:`, error)
  }

  return files
}

async function analyzeComponentUsage(srcDir: string): Promise<Set<string>> {
  const usedComponents = new Set<string>()

  const codeFiles = await findFiles(srcDir, ['.vue', '.ts', '.js'])

  for (const filePath of codeFiles) {
    try {
      const fullPath = join(srcDir, filePath.replace('@', ''))
      const content = await readFile(fullPath, 'utf-8')
      const importMatches = content.matchAll(/import\s+\w+\s+from\s+['"]([^'"]*\.vue)['"]/g)

      for (const match of importMatches) {
        const importPath = match[1]

        if (importPath && importPath.startsWith('@/')) {
          usedComponents.add(importPath)
        }
      }

      const dynamicImportMatches = content.matchAll(/import\s*\(\s*['"]([^'"]*\.vue)['"]\s*\)/g)

      for (const match of dynamicImportMatches) {
        const importPath = match[1]

        if (importPath && importPath.startsWith('@/')) {
          usedComponents.add(importPath)
        }
      }
    }
    catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }

  return usedComponents
}

function generateStylesEntryContent(vueFiles: string[]): string {
  return vueFiles
    .sort()
    .map(file => `import '${file}'`)
    .join('\n')
}

async function generateStylesEntry() {
  try {
    const srcDir = join(process.cwd(), 'src')
    const usedComponentPaths = await analyzeComponentUsage(srcDir)
    const vueFilesToInclude = ['@/App.vue', ...usedComponentPaths]
      .filter((path, index, array) => array.indexOf(path) === index)

    const content = generateStylesEntryContent(vueFilesToInclude)
    const tempDir = join(process.cwd(), '.temp')

    await mkdir(tempDir, { recursive: true })

    const outputPath = join(tempDir, 'styles-entry.ts')

    await writeFile(outputPath, content, 'utf-8')
  }
  catch (error) {
    console.error('Error generating styles-entry.ts:', error)
    process.exit(1)
  }
}

generateStylesEntry()
