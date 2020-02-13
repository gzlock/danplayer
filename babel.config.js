const plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins.push(['transform-remove-console', { exclude: ['info'] }])
}
module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],
  plugins,
}
