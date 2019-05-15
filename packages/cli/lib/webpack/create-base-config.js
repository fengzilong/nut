const path = require( 'path' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const CopyPlugin = require( 'copy-webpack-plugin' )
const FriendlyErrorsWebpackPlugin = require( 'friendly-errors-webpack-plugin' )
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )
const WebpackBar = require( 'webpackbar' )

const dirs = {
  cli: path.join( __dirname, '../../' ),
  project: process.cwd(),
}

module.exports = function createBaseConfig( config ) {
  const webpackConfig = {
    entry: path.join( dirs.cli, 'lib/runtime/entry.js' ),
    optimization: {
      splitChunks: {
        chunks: 'all',
        minChunks: 2,
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    performance: {
      hints: false,
    },
    resolve: {
      alias: {
        '@': path.join( dirs.project, 'src' )
      },
      modules: [
        path.join( dirs.project, 'node_modules' ),
        path.join( dirs.cli, '../../' ),
        path.join( dirs.cli, 'node_modules' ),
        'node_modules',
      ],
      extensions: [
        '.js', '.json',
        '.md',
        '.scss', '.sass', '.less', '.styl', '.stylus', '.css',
      ]
    },
    resolveLoader: {
      modules: [
        path.join( dirs.project, 'node_modules' ),
        path.join( dirs.cli, '../../' ),
        path.join( dirs.cli, 'node_modules' ),
        'node_modules',
      ],
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: require.resolve( '../loader/mount-markdown' ),
            },
            {
              loader: require.resolve( '../loader/markdown' ),
              options: {
                gfm: true,
              },
            },
          ]
        },

        {
          test: /\.js$/,
          exclude: [ /node_modules/ ],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    require.resolve( '@babel/preset-env' ),
                    {
                      targets: {
                        browsers: [ 'last 2 versions', 'safari >= 7' ]
                      }
                    }
                  ]
                ],
                plugins: [
                  [ require.resolve( '@babel/plugin-transform-runtime' ) ]
                ]
              }
            },
          ]
        },

        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },

        {
          test: /\.(ttf|eot|woff|woff2|svg)(\?t=\d+)?$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },

        {
          test: /\.vue$/,
          use: [
            {
              loader: require.resolve( '../loader/mount-vue' ),
              options: {
                routes: [],
              },
            },
            {
              loader: 'vue-loader',
              options: {},
            },
          ]
        },
      ]
    },
    plugins: [
      new CopyPlugin( [
        {
          from: {
            glob: '**/*',
            dot: true
          },
          context: path.join( dirs.project, 'src/public' ),
          to: '.',
          ignore: [ '.DS_Store' ]
        }
      ] ),
      new HtmlWebpackPlugin( {
        template: path.join( __dirname, './template.html' ),
        title: ( config.html && config.html.title ) || config.zh || config.en,
        favicon: ( config.html && config.html.favicon ) || path.join( __dirname, '../runtime/favicon.png' ),
      } ),
      new VueLoaderPlugin(),
      new WebpackBar(),
      new FriendlyErrorsWebpackPlugin( {
        clearConsole: false,
      } ),
    ],
  }

  return webpackConfig
}