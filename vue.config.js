module.exports = {
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
