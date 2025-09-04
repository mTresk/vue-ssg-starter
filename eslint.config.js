import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  formatters: {
    css: true,
  },
  rules: {
    'node/prefer-global/process': 0,
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'curly': 1,
    'no-new': 0,
  },
  ignores: [
    'docker-compose.yml',
    '.github/workflows/deploy.yml',
    './src/app.ts',
  ],
})
