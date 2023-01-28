const path = require("path");
const Timestamp = new Date().getTime();
// webpack启用Gzip压缩
// const CompressionPlugin = require("compression-webpack-plugin");
// const productionGzipExtensions = ["js", "css"];
// const isPRD = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: "./",
  assetsDir: "static",
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    requireModuleExtension: true,
    sourceMap: false,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',
        /*sass-loader 9.0写法*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext, resourcePath);
          if (
            relativePath.replace(/\\/g, "/") !== "src/styles/variables.scss"
          ) {
            return '@import "~@/assets/css/variables.scss";' + content;
          }
          return content;
        }
      }
    }
  },
  transpileDependencies: ["sm-crypto"],
  devServer: {
    proxy: {
      "^/app-platform-backend": {
        target: "http://192.168.10.240:9009",
        ws: true, //是否代理websockets
        changeOrigin: true // 设置同源  默认false，是否需要改变原始主机头为目标URL
        // "^/admin": "/admin"
      }
    }
  },
  configureWebpack: {
    // webpack 配置
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
    }
    // 开启分离 js
    // optimization: {
    //   runtimeChunk: "single",
    //   splitChunks: {
    //     chunks: "all",
    //     maxInitialRequests: Infinity,
    //     minSize: 20000,
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name(module) {
    //           const packageName = module.context.match(
    //             /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //           )[1];
    //           return `npm.${packageName.replace("@", "")}`;
    //         }
    //       }
    //     }
    //   }
    // }
    // plugins: isPRD
    //   ? [
    //       // 使用Gzip压缩文件 - https://segmentfault.com/a/1190000012571492
    //       // 报错："TypeError: Cannot read property 'tapPromise' of undefined"是compression-webpack-plugin版本问题5.0.1
    //       new CompressionPlugin({
    //         filename: "[path].gz[query]",
    //         algorithm: "gzip",
    //         test: new RegExp(
    //           "\\.(" + productionGzipExtensions.join("|") + ")$"
    //         ),
    //         threshold: 10240,
    //         minRatio: 0.8,
    //         deleteOriginalAssets: true
    //       })
    //     ]
    //   : []
  }
};
