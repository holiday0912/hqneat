const path = require('path')
const Timestamp = new Date().getTime()

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',
        /*sass-loader 9.0写法*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss'
          ) {
            return '@import "~@/styles/variables.scss";' + content
          }
          return content
        },
      },
    },
  },
  transpileDependencies: [
    'sm-crypto'
  ],
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://120.79.19.225:8991',
        ws: true,//是否代理websockets
        changeOrigin: true,   // 设置同源  默认false，是否需要改变原始主机头为目标URL
        '^/admin': '/admin'  //通过pathRewrite重写地址，将前缀/api转为/
      },
      '/api': {
        target: 'http://106.52.97.210:9007',
        ws: true,//是否代理websockets
        changeOrigin: true,   // 设置同源  默认false，是否需要改变原始主机头为目标URL
        '^/api': '/api'  //通过pathRewrite重写地址，将前缀/api转为/
      }
    }
  },
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
    },
  },
};