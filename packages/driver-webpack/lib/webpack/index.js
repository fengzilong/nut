const abilities = [
  require( './public-path' ),
  require( './filename' ),
  require( './entry' ),
  // error-overlay should be after entry
  require( './error-overlay' ),
  require( './babel' ),
  require( './css' ),
  require( './html' ),
  require( './media' ),
  require( './font' ),
  require( './copy' ),
  require( './clean' ),
  require( './analyze' ),
  require( './mode' ),
  require( './minimizer' ),
  require( './minimize' ),
  require( './progress' ),
  require( './vue' ),
  require( './define' ),
  require( './resolve' ),
  require( './friendly-error' ),
  require( './performance' ),
  require( './dev-server' ),
  require( './missing-node-modules' ),
  require( './hot' ),
  require( './outdir' ),

  // produce very little effect
  // require( './dll' ),
]

exports.extendWebpack = function ( config, context = {} ) {
  abilities.forEach( ability => {
    if ( ability.extend ) {
      ability.extend( config, context )
    }
  } )
}

exports.exposeWebpack = function ( driver, context = {} ) {
  abilities.forEach( ability => {
    if ( ability.expose ) {
      ability.expose( driver, context )
    }
  } )
}

exports.extendDevServer = function ( serverOptions, context = {} ) {
  abilities.forEach( ability => {
    if ( ability.extendDevServer ) {
      ability.extendDevServer( serverOptions, context )
    }
  } )
}
