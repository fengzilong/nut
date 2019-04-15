const path = require( 'path' )
const webpack = require( 'webpack' )
const chokidar = require( 'chokidar' )
const WebpackDevServer = require( 'webpack-dev-server' )
const VirtualModulesPlugin = require( 'webpack-virtual-modules' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const baseWebpackConfig = require( '../webpack/base.config' )
const loadConfig = require( '../utils/loadConfig' )
const ensureConfigDefaults = require( '../utils/ensureConfigDefaults' )
const generateVirtualModules = require( '../utils/generateVirtualModules' )

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })

const dirs = {
  cli: path.join( __dirname, '../../' ),
  project: process.cwd(),
}

async function prod(){
  let result = await loadConfig()
  let config = result.config || {}

  ensureConfigDefaults( config )

  const webpackConfig = Object.assign( {}, baseWebpackConfig, {
    mode: 'production',
    devtool: false,
    output: {
      path: path.join( dirs.project, 'dist' ),
      filename: '[name].[hash].js',
      publicPath: './'
    },
  } )

  const modules = await generateVirtualModules( config, {
    env: 'production'
  } )
  const virtualModules = new VirtualModulesPlugin( modules )

  webpackConfig.plugins.push( virtualModules )
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, '../webpack/template.html' ),
      title: ( config.html && config.html.title ) || config.zh || config.en,
      favicon: ( config.html && config.html.favicon ) || path.join( __dirname, '../runtime/favicon.png' ),
    } ),
  )

  const compiler = webpack( webpackConfig )

  compiler.run( ( err, stats ) => {
    if ( err ) {
      console.error(err)
      return
    }

    console.log(
      stats.toString( {
        chunks: false,
        colors: true,
        warnings: false,
      } )
    )
  } )
}

module.exports = prod