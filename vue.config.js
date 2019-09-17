module.exports = {
  publicPath: './',
  outputDir: process.env.TARGET === 'lib' ? './dist' : './docs',
  devServer: {
    disableHostCheck: true
  },
  css: {
    extract: false
  }
}
