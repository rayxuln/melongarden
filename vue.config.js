module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/melongarden/'
    : '/',
  productionSourceMap: false
}
