import type { CSSBeautifyOptions, HTMLBeautifyOptions } from 'js-beautify'

export interface PostProcessConfig {
  beautifyHtml: boolean
  beautifyCss: boolean
  htmlOptions: HTMLBeautifyOptions
  cssOptions: CSSBeautifyOptions
}

export const postProcessConfig: PostProcessConfig = {
  beautifyHtml: true,
  beautifyCss: false,

  htmlOptions: {
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
  },

  cssOptions: {
    indent_size: 2,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    wrap_line_length: 160,
    end_with_newline: true,
    newline_between_rules: false,
    selector_separator_newline: true,
    space_around_combinator: true,
  },
}
