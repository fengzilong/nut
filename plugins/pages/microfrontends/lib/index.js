/* eslint-disable indent */

const path = require( 'path' )
const boxen = require( 'boxen' )
const address = require( 'address' )
const table = require( 'text-table' )
const stringWidth = require( 'string-width' )
const prettyBytes = require( 'pretty-bytes' )
const slugify = require( '@sindresorhus/slugify' )
const StatsWriterPlugin = require( 'webpack-stats-plugin' ).StatsWriterPlugin
const generateModules = require( './generate-modules' )
const { getUniqueApplicationId } = require( './utils' )
const extend = require( './webpack' )
const APIServer = require( './server' )

const dirs = {
  runtime: path.join( __dirname, '../files' ),
  project: process.cwd(),
}

function getFilesFromChunk( chunk ) {
  const files = []

  if ( Array.isArray( chunk ) ) {
    const jsfiles = chunk.filter( file => file.endsWith( '.js' ) )
    files.push( ...jsfiles )
  } else if ( typeof chunk === 'string' ) {
    if ( chunk.endsWith( '.js' ) ) {
      files.push( chunk )
    }
  }

  return files
}

const ID = 'microfrontends'

module.exports = {
  name: ID,

  core: true,

  async apply( api ) {
    this.api = api

    const runtimeModules = this.runtimeModules = []
    this.coreRuntimeModules = []

    api.expose( 'addRuntimeModule', function ( { file, options } ) {
      const { name } = this.caller || {}

      const included = runtimeModules.some( v => {
        return v.name === name && v.file === file
      } )

      if ( !included ) {
        runtimeModules.push( { name, file, options } )
      }
    } )

    api.hooks.beforeUserPlugins.tap( ID, async () => {
      const port = await api.detectPort()

      if ( api.env === 'development' ) {
        const server = new APIServer()
        try {
          await server.start( { port } )
        } catch ( e ) {
          console.log( e )
          api.exit()
        }

        api.hooks.restart.tapPromise( ID, async () => {
          await server.stop()
        } )

        api.expose( 'service', server )

        await this.addBuiltinDevModules( { port } )
      }
    } )

    // other plugins will use chainWebpack hook to add runtime modules
    // core plugins is ahead of all user plugins
    // so we should use beforeRun hook to get all runtime modules
    api.hooks.beforeRun.tapPromise( ID, async () => {
      await this.base()

      if ( api.env === 'production' ) {
        await this.build()
      } else {
        await this.dev()
      }
    } )
  },

  async addBuiltinDevModules( { port } ) {
    this.coreRuntimeModules.push( {
      name: ID,
      file: path.join( __dirname, 'modules/command-palette/index.js' ),
      options: { port }
    } )
  },

  async base() {
    const { webpack: config, config: nutConfig } = this.api

    extend( config, nutConfig )

    config
      .resolve
      .alias
      .set( '#runtime', path.join( dirs.runtime, 'entries/default-runtime.js' ) )

    config
      .plugin( 'copy-public' )
        .use( config.plugin( 'copy' ).get( 'plugin' ), [
          [
            {
              from: {
                glob: '**/*',
                dot: true
              },
              to: '.',
              ignore: [ '.DS_Store' ]
            }
          ],
          {
            context: path.join( dirs.project, 'src/public' )
          }
        ] )
        .end()
      .plugin( 'html' ) // TODO: need rebuild after change html
        .tap( ( [ options ] ) => [
          {
            ...options,
            template: ( nutConfig.html && nutConfig.html.template ) ||
              path.join( __dirname, './webpack/template.ejs' ),
            excludeChunks: [ ...( options.excludeChunks || [] ), 'child' ],
            title: options.title || nutConfig.zh || nutConfig.en,
            favicon: options.favicon || path.join( __dirname, './webpack/favicon.png' )
          }
        ] )
        .end()

    // setup child entry
    const appId = await getUniqueApplicationId( nutConfig )

    if ( appId ) {
      config.output.jsonpFunction( 'webpackJsonp_' + appId )
    }

    config
      .entry( 'child' )
        .add( path.join( dirs.runtime, 'entries/child.js' ) )
        .end()

    config.plugin( 'stats-write' )
      .use( StatsWriterPlugin, [
        {
          filename: 'manifest.json',
          transform( data, opts ) {
            const files = [
              ...getFilesFromChunk( data.assetsByChunkName.vendors ),
              ...getFilesFromChunk( data.assetsByChunkName.child ),
            ]

            let publicPath = '/'

            try {
              publicPath = opts.compiler.options.output.publicPath
            } catch ( e ) {}

            return JSON.stringify( {
              files,
              id: appId,
              publicPath,
            }, 0, 2 )
          }
        }
      ] )

    // use jsonp to fix cors issue
    config.plugin( 'stats-write-js' )
      .use( StatsWriterPlugin, [
        {
          filename: 'manifest.js',
          transform( data, opts ) {
            const compiler = opts.compiler

            const childFiles = getFilesFromChunk( data.assetsByChunkName.child )
            const source = childFiles
              .map( file => compiler.assets[ file ].source() )
              .join( '\n' )

            let publicPath = '/'

            try {
              publicPath = opts.compiler.options.output.publicPath
            } catch ( e ) {}

            const json = JSON.stringify( {
              files: [],
              id: appId,
              publicPath,
            } )

            // TODO: 把 child.js 写入 manifest，从 files 中移除 child.js
            return `
  ( function () {
  if ( window.nutManifestJSONP ) {
    var currentScript = document.currentScript
    var dataset = currentScript ? currentScript.dataset : {}
    window.nutManifestJSONP( ${ json }, dataset )
  }
  } )();
  ${ source }
  `.trim()
          },
          fields: null
        }
      ] )
  },

  async dev() {
    const { webpack: config, config: nutConfig, cliOptions } = this.api

    config.plugin( 'define' )
      .tap( args => {
        if ( !args[ 0 ] ) {
          args.push( {} )
        }
        const definitions = args[ 0 ]
        definitions.NUT_CLI_DYNAMIC = JSON.stringify( Boolean( cliOptions.dynamic ) )
        return [
          definitions
        ]
      } )

    if ( cliOptions.dynamic ) {
      config.optimization
        .splitChunks( {
          chunks: 'initial'
        } )
    }

    // setup virtual modules
    const modules = await this.getModules( {
      dynamicPages: [],
      lockedDynamicPages: [],
      // skipDiff to make sure modules is available on restart
      skipDiff: true
    } )

    Object.keys( modules )
      .forEach( filename => {
        const source = modules[ filename ]
        this.api.provideModule( filename, source )
      } )

    if ( typeof nutConfig.chainWebpack === 'function' ) {
      nutConfig.chainWebpack( config )
    }

    this.setupDevServer( nutConfig )
  },

  async getAllPages() {
    const config = this.api.config || {}
    const plugins = config.userPlugins || []
    const normalizePage = this.normalizePage.bind( this )

    const rootPages = path.join( process.cwd(), 'src' )
    let pages = await this.api.getPages( rootPages )
    pages = pages.map( normalizePage )

    for ( const plugin of plugins ) {
      let pluginPages = await this.api.getPages( plugin.context )
      if ( this.api.verbose ) {
        this.api.logger.info( `found ${ pluginPages.length } pages from plugin: ${ this.api.colors.green( plugin.name ) }\n` )
      }
      pluginPages = pluginPages.map( page => normalizePage( page, {
        plugin: plugin.name,
      } ) )
      pages.push( ...pluginPages )
    }

    return pages
  },

  normalizePage( pageMeta = {}, options = {} ) {
    const { plugin } = options

    const { context, location } = pageMeta

    const relative = path.relative( context, location )
    const page = relative.split( '.' )[ 0 ]
    let extension = relative.split( '.' ).slice( 1 ).join( '.' )
    extension = extension ? `.${ extension }` : null

    const result = {
      name: slugify( page, { separator: '$$' } ),
      location,
      page,
      extension,
      provider: null,
      plugin: null,
    }

    if ( plugin ) {
      result.name = result.name + '_' + slugify( plugin, { separator: '$' } )
      result.page = page.page + '@' + plugin
      result.provider = 'plugin'
      result.plugin = plugin
    }

    return result
  },

  async getModules( options = {} ) {
    const { env, cliOptions } = this.api

    await this.api.getConfig()

    return await generateModules( {
      config: this.api.config,
      pages: await this.getAllPages(),
    }, {
      env,
      cliOptions,
      runtimeModules: [ ...this.coreRuntimeModules, ...this.runtimeModules ],
      ...options,
    } )
  },

  async setupDevServer( nutConfig ) {
    const api = this.api
    const { cliOptions } = api
    const dynamicPages = []
    let lockedDynamicPages = []

    const waitCallbacks = []

    api.hooks.compiler.tap( ID, compiler => {
      compiler.hooks.done.tap( 'wait-until-valid', () => {
        let callback = waitCallbacks.shift()
        while ( callback ) {
          callback()
          callback = waitCallbacks.shift()
        }
      } )
    } )

    function waitUntilValid() {
      const deferred = {}

      deferred.promise = new Promise( ( resolve, reject ) => {
        deferred.resolve = resolve
        deferred.reject = reject
      } )

      waitCallbacks.push( deferred.resolve )

      return deferred.promise
    }

    api.hooks.serverOptions.tap( ID, ( options = {} ) => {
      const { host, port } = options
      api.hooks.afterServe.tap( ID, ( compiler, server ) => { // eslint-disable-line no-unused-vars
        const routerMode = ( nutConfig.router && nutConfig.router.mode ) || 'hash'

        if ( cliOptions.singlePage ) {
          console.log(
            boxen(
              `Your sinlg page is available at${
                getTips( {
                  colors: api.colors,
                  host,
                  port,
                  routerMode,
                  page: cliOptions.singlePage
                } )
              }`,
              {
                padding: 1,
                borderColor: 'gray'
              }
            )
          )
        } else {
          console.log(
            boxen(
              `Your application is running at${ getTips( { colors: api.colors, host, port } ) }`,
              {
                padding: 1,
                borderColor: 'gray'
              }
            )
          )
        }

        console.log()
        console.log( api.colors.gray( 'Tips: ' ) )
        console.log( api.colors.gray( 'Press "Enter" to open in browser' ) )
        console.log( api.colors.gray( 'Press "r" to restart dev server' ) )
        console.log( api.colors.gray( 'Press "q" to quit' ) )
        console.log()

        const stdin = process.stdin
        const ENTER = '\r'

        this.api.hooks.stdin.tapPromise( ID, async key => {
          switch ( key ) {
          case ENTER:
            this.api.openBrowser( getOpenUrl( {
              host,
              port,
              routerMode,
              page: cliOptions.singlePage
            } ) )
            break
          case 'r':
            this.api.restart()
            break
          case 'q':
            if ( typeof stdin.setRawMode === 'function' ) {
              stdin.setRawMode( false )
            }
            this.api.exit()
            break
          default:
            break
          }
        } )
      } )

      return Object.assign( {}, options, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: true,
        before( app ) {
          app.get( `/_nut_dynamic_build_page`, async ( req, res ) => {
            const page = req.query.page

            if ( !cliOptions.dynamic ) {
              return res.json( {
                success: true,
                waitHotApply: false,
              } )
            }

            // prevent waiting for valid
            if ( dynamicPages.includes( page ) ) {
              return res.json( {
                success: true,
                waitHotApply: false,
              } )
            }

            dynamicPages.push( page )

            const modules = await this.getModules( {
              dynamicPages,
              lockedDynamicPages,
            } )

            if ( Object.keys( modules ).length > 0 ) {
              for ( const [ filename, source ] of Object.entries( modules ) ) {
                this.api.provideModule( filename, source )
              }

              await waitUntilValid()
            }

            res.json( {
              success: true,
              waitHotApply: true,
            } )
          } )
        },
        after( app ) {
          // rebuild slim routes(without unused HMR code) before following requests
          app.use( async ( req, res, next ) => {
            if ( !cliOptions.dynamic ) {
              return next()
            }

            if ( req.path === '/index.html' ) {
              lockedDynamicPages = dynamicPages.slice()

              const modules = await this.getModules( {
                dynamicPages,
                // used for generate `module.hot.accept`s, ensure no page refresh
                lockedDynamicPages,
              } )

              if ( Object.keys( modules ).length > 0 ) {
                for ( const [ filename, source ] of Object.entries( modules ) ) {
                  api.provideModule( filename, source )
                }

                await waitUntilValid()
              }
            }

            next()
          } )
        },
      } )
    } )

    function getOpenUrl( { host, port, routerMode = 'hash', page } ) {
      const url = 'http://' + host + ':' + port

      let suffix = ''
      if ( page ) {
        suffix = ( routerMode === 'hash' ? '/#/' : '/' ) + page
      }

      return url + suffix
    }

    function getTips( { colors, host, port, routerMode, page } ) {
      const url = 'http://' + host + ':' + port
      const lanIP = address.ip()
      const lanUrl = lanIP ? `http://${ lanIP }:${ port }` : ''

      let suffix = ''
      if ( page ) {
        suffix = ( routerMode === 'hash' ? '/#/' : '/' ) + page
      }

      const localTips = `\n\nLocal:     ${ colors.cyan( url + suffix ) }`
      const lanTips = lanUrl ? `\n\nNetwork:   ${ colors.cyan( lanUrl + suffix ) }` : ''

      return localTips + lanTips
    }

    const rebuildModules = async () => {
      try {
        const modules = await this.getModules( {
          dynamicPages,
          lockedDynamicPages,
        } )

        for ( const [ filename, source ] of Object.entries( modules ) ) {
          api.provideModule( filename, source )
        }
      } catch ( e ) {
        console.log( e )
      }
    }

    const cwd = process.cwd()

    api.watch( [
      await api.getConfigFile(),
      path.join( cwd, 'src/app.js' ),
      path.join( cwd, 'src/app.ts' ),
      path.join( cwd, 'config' ),
    ], [ 'add', 'unlink', 'change' ], rebuildModules )

    api.watch( [
      path.join( cwd, 'src/pages' ),
    ], [ 'add', 'unlink' ], rebuildModules )
  },

  async build() {
    const api = this.api
    const { webpack: config, config: nutConfig } = api

    config.plugin( 'define' )
      .tap( args => {
        if ( !args[ 0 ] ) {
          args.push( {} )
        }
        const definitions = args[ 0 ]
        definitions.NUT_CLI_DYNAMIC = JSON.stringify( false )
        return [
          definitions
        ]
      } )

    const appId = await getUniqueApplicationId( nutConfig )

    config.plugin( 'mini-css-extract' )
      .tap( args => {
        if ( args[ 0 ] ) {
          args[ 0 ].attrs = {
            'data-appid': appId
          }
        }

        return args
      } )

    const modules = await this.getModules()

    Object.keys( modules )
      .forEach( filename => {
        const source = modules[ filename ]
        api.provideModule( filename, source )
      } )

    if ( typeof nutConfig.chainWebpack === 'function' ) {
      nutConfig.chainWebpack( config )
    }

    api.hooks.afterBuild.tapPromise( ID, async ( err, stats ) => {
      if ( err ) {
        console.error( err )
        return
      }

      const result = stats.toJson( {
        assets: true,
        // remove extra fields
        chunks: false,
        children: false,
        chunkGroups: false,
        chunkModules: false,
        warnings: false,
        modules: false,
        source: false,
        entrypoints: false,
        performance: false,
      } )

      let output = [
        [ ' File', 'Size' ].map( s => api.colors.bold( s ) ),
        [ ' ----', '----' ].map( s => api.colors.dim( s ) )
      ]

      result.assets.sort( ( a, b ) => {
        return b.size - a.size
      } )

      output = output.concat( result.assets.map( asset => [ api.colors.green( ' ' + asset.name ), prettyBytes( asset.size ) ] ) )

      output = table( output, {
        stringLength: stringWidth,
      } )

      console.log( `\n${ output }\n` )

      console.log(
        stats.toString( {
          assets: false,
          children: false,
          chunks: false,
          colors: true,
          warnings: false,
          errors: true,
          errorDetails: true,
          modules: false,
          entrypoints: false,
          performance: false,
        } )
      )

      console.log( '\n' )
    } )
  },
}
