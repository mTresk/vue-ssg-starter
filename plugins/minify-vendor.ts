import { minify } from 'terser'

export default function minifyVendor() {
  return {
    name: 'minify-vendor',
    async generateBundle(_options: any, bundle: any) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if ((chunk as any).type === 'chunk' && fileName.includes('vendor')) {
          const result = await minify((chunk as any).code, {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            mangle: true,
            format: {
              comments: false,
            },
          })

          if (result.code) {
            (chunk as any).code = result.code
          }
        }
      }
    },
  }
}
