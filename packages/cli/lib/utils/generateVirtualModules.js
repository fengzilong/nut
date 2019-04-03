const path = require( 'path' )
const fse = require( 'fs-extra' )
const tildify = require( 'tildify' )
const {
  NodeJsInputFileSystem,
  CachedInputFileSystem,
  ResolverFactory
} = require( 'enhanced-resolve' )
const fm = require( 'front-matter' )
const slugify = require( '@sindresorhus/slugify' )

const dirs = {
  cli: path.join( __dirname, '../../' ),
  project: process.cwd(),
}

async function generateVirtualModules( config, { env = 'development' } = {} ) {
  const normalized = await normalizeConfig( config )
  const routes = await generateRoutes( normalized )
  const plugins = await generatePlugins( normalized, { env } )
  const markdownThemeCSS =  await generateMarkdownThemeCSS( config )

  return {
    'node_modules/nut-auto-generated-routes.js': routes,
    'node_modules/nut-auto-generated-plugins.js': plugins,
    'node_modules/nut-auto-generated-nut-config.js': `export default ${ JSON.stringify( normalized ) }`,
    'node_modules/nut-auto-generated-markdown-theme.css': markdownThemeCSS,
  }
}

async function generatePlugins( config, { env = 'development' } = {} ) {
  const pluginsObj = config.plugins || {}

  let plugins = Object.keys( pluginsObj )
    .map( localName => ( {
      localName,
      ...pluginsObj[ localName ],
    } ) )
    .map( normalizePlugin )

  // filter truthy
  plugins = plugins.filter( Boolean )
  // filter enable
  plugins = plugins.filter( plugin => plugin.enable )
  // filter env
  plugins = plugins.filter( plugin => ~plugin.env.indexOf( env ) )

  const _imports = plugins.map( ( plugin, index ) => {
    return `import plugin_${ index } from '${ plugin.path || plugin.package }';`
  } ).join( '\n' )

  const _localnames = plugins.map( ( plugin, index ) => {
    return `plugin_${ index }.localName = ${ JSON.stringify( plugin.localName ) }`
  } ).join( '\n' )

  const _exports = `export default [
    ${
      plugins
        .map( ( plugin, index ) => `[ plugin_${ index }, ${ JSON.stringify( plugin.options ) } ]` )
        .join( ',' )
    }
  ]`

  return `
    ${ _imports }
    ${ _localnames }
    ${ _exports }
  `
}

function normalizePlugin( plugin ) {
  plugin.env = plugin.env || [ 'development', 'production' ]
  plugin.enable = typeof plugin.enable !== 'undefined' ?
    !!plugin.enable :
    true

  return plugin
}

const resolver = ResolverFactory.createResolver( {
  extensions: [ '.js', '.md' ],
  fileSystem: new CachedInputFileSystem( new NodeJsInputFileSystem(), 4000 )
} )

async function generateMarkdownThemeCSS( config ) {
  const lookupStartPath = path.join( dirs.cli, 'node_modules' )
  const request = 'prismjs/themes/' + config.markdown.theme + '.css'

  return await new Promise( ( resolve, reject ) => {
    resolver.resolve( {}, lookupStartPath, './' + request, {}, async ( err, filepath ) => {
      if ( err ) {
        return reject( err )
      }

      const buffer = await fse.readFile( filepath )
      resolve( buffer.toString() )
    } )
  } )
}

function resolve( request ) {
  const lookupStartPath = path.join( dirs.project, 'src' )
  return new Promise( ( resolve, reject ) => {
    resolver.resolve( {}, lookupStartPath, './' + request, {}, ( err, filepath ) => {
      if ( err ) {
        return reject( err )
      }
      resolve( filepath )
    } )
  } )
}

async function normalizeConfig( config ) {
  const texts = new Set()
  let index = 0

  function ensureUnique( text ) {
    if ( !texts.has( text ) ) {
      texts.add( text )
      return text
    }

    index++
    return text + index
  }

  const promises = config.sidebar.map( async s => {
    const promises = s.pages.map( async page => {
      let hidden = false
      if ( page.startsWith( '!' ) ) {
        hidden = true
      }

      const trimed = page.replace( /^(!|\/|^)/g, '' )

      const filepath = await resolve( trimed )
      const buffer = await fse.readFile( filepath )
      const content = buffer.toString()
      const result = fm( content )
      const attributes = result.attributes || {}

      const route = '/' + trimed.replace( /(\/_)(.+)/g, '/:$2' )
      const extname = path.extname( filepath )
      const types = {
        '.js': 'js',
        '.md': 'markdown',
      }
      const type = types[ extname ]

      return {
        name: ensureUnique(
          slugify( trimed, { separator: '$' } )
        ),
        filepath,
        path: trimed,
        route,
        hidden,
        attributes,
        type,
      }
    } )


    return Object.assign( {}, s, {
      pages: await Promise.all( promises ),
    } )
  } )

  return Object.assign( {}, config, {
    sidebar: await Promise.all( promises )
  } )
}

async function generateRoutes( config = {} ) {
  const sidebar = config.sidebar || []

  const imports = []

  sidebar.map( s => {
    s.pages.map( ( { name, path, filepath, route, hidden, attributes = {} } = {} ) => {
      imports.push( { name, path, filepath, route, hidden, layout: attributes.layout } )
    } )
  } )

  let output = ''

  output = output + imports
    .map( imp => `import ${ imp.name } from '@/${ imp.path }';` )
    .join( '\n' )

  output = output + 'const routes = [\n' + imports
    .map( imp => `{
      name: '${ imp.name }',
      layout: '${ imp.layout }',
      path: '${ imp.route }',
      filepath: '${ tildify( imp.filepath ) }',
      component: ${ imp.name },
    }` ).join( ',\n' ) + '\n];' +
    `export default routes;`

  return output
}

module.exports = generateVirtualModules