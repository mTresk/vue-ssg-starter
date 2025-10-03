/* eslint-env node */
module.exports = {
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.log',
    '**/npm-debug.log*',
    '**/.git/**',
    '**/.idea/**',
    '**/.vscode/**',
    '**/.DS_Store',
  ],
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'at-rule-no-unknown': null,
    'media-query-no-invalid': null,
    'selector-class-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-mixin-pattern': null,
    'no-invalid-position-at-import-rule': null,
    'no-descending-specificity': null,
    'declaration-property-value-no-unknown': null,
    'unit-disallowed-list': ['px'],
    'no-invalid-position-declaration': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['fluid', 'rem', 'em'],
      },
    ],
  },
}
