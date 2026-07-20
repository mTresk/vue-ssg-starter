import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

const BUILTIN_COMPONENTS = new Set([
  'RouterLink',
  'RouterView',
  'Transition',
  'TransitionGroup',
  'KeepAlive',
  'Teleport',
  'Suspense',
  'Component',
  'Slot',
])

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

function kebabToPascal(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function extractTemplate(content: string): string {
  const match = content.match(/<template\b[^>]*>([\s\S]*?)<\/template>/i)

  return match?.[1] ?? ''
}

function extractComponentTags(content: string): Set<string> {
  const names = new Set<string>()
  const template = removeComments(extractTemplate(content))
  const tagMatches = template.matchAll(/<\/?([A-Z]\w*|[a-z]\w*-[-\w]*)\b/g)

  for (const match of tagMatches) {
    const rawName = match[1]

    if (!rawName) {
      continue
    }

    const componentName = rawName.includes('-')
      ? kebabToPascal(rawName)
      : rawName

    if (BUILTIN_COMPONENTS.has(componentName)) {
      continue
    }

    names.add(componentName)
  }

  return names
}

function extractVueImports(content: string, currentFilePath: string): Set<string> {
  const imports = new Set<string>()
  const contentWithoutComments = removeComments(content)
  const patterns = [
    /import\s+\w+\s+from\s+['"]([^'"]*\.vue)['"]/g,
    /import\s*\(\s*['"]([^'"]*\.vue)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of contentWithoutComments.matchAll(pattern)) {
      const importPath = match[1]

      if (!importPath) {
        continue
      }

      const normalizedPath = normalizeImportPath(importPath, currentFilePath)

      if (normalizedPath.startsWith('@/')) {
        imports.add(normalizedPath)
      }
    }
  }

  return imports
}

function buildComponentNameMap(vueFiles: string[]): Map<string, string> {
  const nameMap = new Map<string, string>()

  for (const filePath of vueFiles) {
    const componentName = basename(filePath, '.vue')

    if (!nameMap.has(componentName)) {
      nameMap.set(componentName, filePath)
    }
  }

  return nameMap
}

async function findDirectlyUsedComponents(
  srcDir: string,
  componentNameMap: Map<string, string>,
): Promise<Set<string>> {
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

  async function findDependenciesInFile(filePath: string) {
    if (visited.has(filePath)) {
      return
    }

    visited.add(filePath)

    try {
      const fullPath = join(srcDir, filePath.replace('@', ''))
      const content = await readFile(fullPath, 'utf-8')
      const relatedPaths = new Set<string>(extractVueImports(content, filePath))

      if (filePath.endsWith('.vue')) {
        for (const componentName of extractComponentTags(content)) {
          const resolvedPath = componentNameMap.get(componentName)

          if (resolvedPath) {
            relatedPaths.add(resolvedPath)
          }
        }
      }

      for (const relatedPath of relatedPaths) {
        directlyUsedComponents.add(relatedPath)

        const cleanImportPath = relatedPath.replace('@', '')

        if (fileMap.has(cleanImportPath)) {
          await findDependenciesInFile(fileMap.get(cleanImportPath)!)
        }
      }
    }
    catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }

  for (const filePath of filesToCheck) {
    await findDependenciesInFile(filePath)
  }

  return directlyUsedComponents
}

async function findComponentDependencies(
  srcDir: string,
  componentPath: string,
  componentNameMap: Map<string, string>,
): Promise<Set<string>> {
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
      const relatedPaths = new Set<string>(extractVueImports(content, compPath))

      for (const componentName of extractComponentTags(content)) {
        const resolvedPath = componentNameMap.get(componentName)

        if (resolvedPath) {
          relatedPaths.add(resolvedPath)
        }
      }

      for (const relatedPath of relatedPaths) {
        dependencies.add(relatedPath)
        await findDeps(relatedPath)
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
  const allVueFiles = await findFiles(srcDir, ['.vue'])
  const componentNameMap = buildComponentNameMap(allVueFiles)
  const usedComponents = await findDirectlyUsedComponents(srcDir, componentNameMap)

  usedComponents.add('@/App.vue')

  const allCodeFiles = await findFiles(srcDir, ['.vue', '.ts', '.js'])
  const pagesFiles = allCodeFiles.filter(file => file.includes('/pages/'))

  for (const pageFile of pagesFiles) {
    usedComponents.add(pageFile)
  }

  const allUsedComponents = new Set<string>()

  for (const component of usedComponents) {
    allUsedComponents.add(component)

    const dependencies = await findComponentDependencies(srcDir, component, componentNameMap)

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
