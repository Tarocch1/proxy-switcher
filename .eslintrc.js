module.exports = {
  env: {
    webextensions: true,
  },
  extends: ['@tarocch1/eslint-config/vue3-typescript'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
        extensions: ['.ts', 'tsx', '.js', '.jsx', '.json', 'vue'],
      },
    },
  },
}
