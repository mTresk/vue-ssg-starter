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

function removeComments(content: string): string {
  let result = content.replace(/\/\/.*$/gm, '')

  result = result.replace(/\/\*[\s\S]*?\*\//g, '')

  return result
}

function normalizeImportPath(importPath: string, currentFilePath: string): string {
  if (importPath.startsWith('@/')) {
    return importPath
  }

  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const currentDir = currentFilePath.replace('@', '').replace(/\/[^/]*$/, '')
    const resolvedPath = join(currentDir, importPath).replace(/\\/g, '/')

    return `@/${resolvedPath.replace(/^\/+/, '')}`
  }

  return importPath
}

async function findDirectlyUsedComponents(srcDir: string): Promise<Set<string>> {
  const directlyUsedComponents = new Set<string>()
  const allCodeFiles = await findFiles(srcDir, ['.vue', '.ts', '.js'])
  const fileMap = new Map<string, string>()

  for (const filePath of allCodeFiles) {
    const cleanPath = filePath.replace('@', '')

    fileMap.set(cleanPath, filePath)
  }

  const entryPoints = ['App.vue', 'main.ts', 'app.ts', 'prod.ts']
  const filesToCheck = new Set<string>()

  for (const entryPoint of entryPoints) {
    const entryPath = `/${entryPoint}`

    if (fileMap.has(entryPath)) {
      filesToCheck.add(fileMap.get(entryPath)!)
    }
  }

  const pagesFiles = allCodeFiles.filter(file => file.includes('/pages/'))

  for (const pageFile of pagesFiles) {
    filesToCheck.add(pageFile)
  }

  const visited = new Set<string>()

  async function findImportsInFile(filePath: string) {
    if (visited.has(filePath)) {
      return
    }

    visited.add(filePath)

    try {
      const fullPath = join(srcDir, filePath.replace('@', ''))
      const content = await readFile(fullPath, 'utf-8')
      const contentWithoutComments = removeComments(content)
      const importMatches = contentWithoutComments.matchAll(/import\s+\w+\s+from\s+['"]([^'"]*\.vue)['"]/g)

      for (const match of importMatches) {
        const importPath = match[1]

        if (importPath) {
          const normalizedPath = normalizeImportPath(importPath, filePath)

          if (normalizedPath.startsWith('@/')) {
            directlyUsedComponents.add(normalizedPath)

            const cleanImportPath = normalizedPath.replace('@', '')

            if (fileMap.has(cleanImportPath)) {
              await findImportsInFile(fileMap.get(cleanImportPath)!)
            }
          }
        }
      }

      const dynamicImportMatches = contentWithoutComments.matchAll(/import\s*\(\s*['"]([^'"]*\.vue)['"]\s*\)/g)

      for (const match of dynamicImportMatches) {
        const importPath = match[1]

        if (importPath) {
          const normalizedPath = normalizeImportPath(importPath, filePath)

          if (normalizedPath.startsWith('@/')) {
            directlyUsedComponents.add(normalizedPath)

            const cleanImportPath = normalizedPath.replace('@', '')

            if (fileMap.has(cleanImportPath)) {
              await findImportsInFile(fileMap.get(cleanImportPath)!)
            }
          }
        }
      }
    }
    catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }

  for (const filePath of filesToCheck) {
    await findImportsInFile(filePath)
  }

  return directlyUsedComponents
}

async function findComponentDependencies(srcDir: string, componentPath: string): Promise<Set<string>> {
  const dependencies = new Set<string>()
  const visited = new Set<string>()

  async function findDeps(compPath: string) {
    if (visited.has(compPath)) {
      return
    }

    visited.add(compPath)

    try {
      const fullPath = join(srcDir, compPath.replace('@/', ''))
      const content = await readFile(fullPath, 'utf-8')
      const contentWithoutComments = removeComments(content)
      const importMatches = contentWithoutComments.matchAll(/import\s+\w+\s+from\s+['"]([^'"]*\.vue)['"]/g)

      for (const match of importMatches) {
        const importPath = match[1]

        if (importPath) {
          const normalizedPath = normalizeImportPath(importPath, compPath)

          if (normalizedPath.startsWith('@/')) {
            dependencies.add(normalizedPath)

            await findDeps(normalizedPath)
          }
        }
      }

      const dynamicImportMatches = contentWithoutComments.matchAll(/import\s*\(\s*['"]([^'"]*\.vue)['"]\s*\)/g)

      for (const match of dynamicImportMatches) {
        const importPath = match[1]

        if (importPath) {
          const normalizedPath = normalizeImportPath(importPath, compPath)

          if (normalizedPath.startsWith('@/')) {
            dependencies.add(normalizedPath)

            await findDeps(normalizedPath)
          }
        }
      }
    }
    catch (error) {
      console.error(`Error reading component ${compPath}:`, error)
    }
  }

  await findDeps(componentPath)
  return dependencies
}

async function analyzeComponentUsage(srcDir: string): Promise<Set<string>> {
  const usedComponents = await findDirectlyUsedComponents(srcDir)

  usedComponents.add('@/App.vue')

  const allCodeFiles = await findFiles(srcDir, ['.vue', '.ts', '.js'])
  const pagesFiles = allCodeFiles.filter(file => file.includes('/pages/'))

  for (const pageFile of pagesFiles) {
    usedComponents.add(pageFile)
  }

  const allUsedComponents = new Set<string>()

  for (const component of usedComponents) {
    allUsedComponents.add(component)

    const dependencies = await findComponentDependencies(srcDir, component)

    for (const dep of dependencies) {
      allUsedComponents.add(dep)
    }
  }

  return allUsedComponents
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
    const vueFilesToInclude = Array.from(usedComponentPaths).sort()
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
