const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const join = path.join.bind(path)
const UglifyJsPluginIns = new UglifyJsPlugin({
  uglifyOptions: {
    sourceMap: false,
    compress: {
      warnings: false,
      drop_debugger: !isDev,
      drop_console: !isDev
    },
    mangle: true,
    output: {
      comments: false
    }
  }
})

function resolve(dir) {
  return path.join(__dirname, dir)
}

function getEntries(path) {
  const files = fs.readdirSync(resolve(path))
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'))
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(`${itemPath}`)
    }
    return ret
  }, {})
  return entries
}

const baseConfig = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    config.module.rule('js').include
      .add('/packages').add('/locales').add('/api')
      .end().use('babel').loader('babel-loader').tap(options => options)

    config.optimization.minimizer = [UglifyJsPluginIns]
  }
}
// 开发环境配置
const devConfig = {
  ...baseConfig,
  devServer: {
    port: 8080, // 固定端口
    hot: true, // 开启热更新
    open: 'Google Chrome'// 固定打开浏览器
  },
  pages: {
    index: {
      entry: resolve('./src/examples/main.js'),
      template: 'public/index.html',
      filename: 'index.html'
    }
  }
}
const buildConfig = {
  ...baseConfig,
  productionSourceMap: false,
  outputDir: 'lib',
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5
      })
    ],
    entry: { ...getEntries('./src/packages') },
    output: {
      library: 'pv-ui',
      filename: '[name]/index.js',
      libraryTarget: 'commonjs2'
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')
    config.module
      .rule('fonts')
      .use('url-loader')
      .tap(option => {
        option.fallback.options.name = 'static/fonts/[name].[hash:8].[ext]'
        return option
      })
  }
}

module.exports = isDev ? devConfig : buildConfig
