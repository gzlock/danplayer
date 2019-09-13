module.exports = {
  root: true,
  env: {
    browser: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-constructor': 'error'
  },
  overrides: [
    {
      'files': '**/*.d.ts',
      'rules': {
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error'
      }
    }
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  globals: {
    Hls: false,
    dashjs: false
  }
}
