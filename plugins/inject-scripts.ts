import type { Plugin } from 'vite'

interface InjectScriptsOptions {
  enabled?: boolean
  fileName?: string
  content?: string
  position?: 'start' | 'end'
}

export default function injectScripts(options: InjectScriptsOptions = {}): Plugin {
  const { enabled = false, fileName = 'custom-scripts.js', content = '', position = 'start' } = options

  if (!enabled) {
    return {} as Plugin
  }

  return {
    name: 'inject-scripts',
    generateBundle(_options, bundle) {
      const appJsFile = Object.keys(bundle).find(fileName =>
        fileName.startsWith('assets/app-') && fileName.endsWith('.js'),
      )

      if (!appJsFile) {
        console.warn('App JS file not found in bundle')

        return
      }

      const appJsChunk = bundle[appJsFile]

      if (!appJsChunk || appJsChunk.type !== 'chunk') {
        return
      }

      this.emitFile({
        type: 'asset',
        fileName: `assets/${fileName}`,
        source: content,
      })

      const originalCode = appJsChunk.code

      if (position === 'end') {
        appJsChunk.code = `${originalCode}\nimport './${fileName}';`
      }
      else {
        appJsChunk.code = `import './${fileName}';\n${originalCode}`
      }
    },
  }
}
