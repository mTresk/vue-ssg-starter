import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import beautify from 'js-beautify'

function beautifyDistFiles() {
  const distPath = join(process.cwd(), 'dist')

  if (!existsSync(distPath)) {
    console.error('Folder dist not found')

    return
  }

  try {
    const beautifyHtml = beautify.html
    const beautifyCss = beautify.css

    function processDirectory(dir: string) {
      const items = readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = join(dir, item.name)

        if (item.isDirectory()) {
          processDirectory(fullPath)
        }
        else if (item.name.endsWith('.html')) {
          const content = readFileSync(fullPath, 'utf8')
          const beautified = beautifyHtml(content, {
            indent_size: 4,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            wrap_line_length: 160,
            end_with_newline: true,
            indent_inner_html: true,
            wrap_attributes: 'auto',
            wrap_attributes_indent_size: 4,
            unformatted: [],
            content_unformatted: ['pre', 'textarea'],
            inline: ['span', 'strong', 'em', 'b', 'i', 'code', 'small'],
          })

          writeFileSync(fullPath, beautified, 'utf8')

          console.warn(`Beautified HTML: ${item.name}`)
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

          console.warn(`Beautified CSS: ${item.name}`)
        }
      }
    }

    processDirectory(distPath)
  }
  catch (error) {
    console.error('Error beautifying:', error)
  }
}

beautifyDistFiles()
