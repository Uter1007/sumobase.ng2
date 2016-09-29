const webpack = require('webpack');
const helpers = require('./helpers');


// Webpack Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

// Webpack Constants
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    title: 'SumoBase.Ng2',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer()
};

module.exports = function(options) {
    isProd = options.env === 'production';
    return {
        metadata: METADATA,
        entry: {

            'polyfills': './src/polyfills.ts',
            'vendor': './src/vendor.ts',
            'main': './src/main.ts'

        },
        resolve: {
            extensions: ['', '.ts', '.js', '.json'],
            root: helpers.root('src'),
            modulesDirectories: ['node_modules'],
        },
        module: {
            preLoaders: [
                {
                    test: /\.ts$/,
                    loader: 'string-replace-loader',
                    query: {
                        search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
                        replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
                        flags: 'g'
                    },
                    include: [helpers.root('src')]
                },
            ],
            loaders: [
                {
                    // Typescript loader support for .ts
                    test: /\.ts$/,
                    loaders: [
                        '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd,
                        'awesome-typescript-loader',
                        'angular2-template-loader',
                        'angular2-router-loader?loader=system'
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    // Json loader support for *.json files.
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    // to string and css loader support for *.css files
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    loader: ['to-string-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                },
                {
                    // Raw loader support for *.html
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [helpers.root('src/public')]
                },
                {
                    // File loader for supporting images, for example, in CSS files
                    test: /\.(jpg|png|gif)$/,
                    loader: 'file'
                }
            ],
            postLoaders: [
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    query: {
                        search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
                        replace: 'var sourceMappingUrl = "";',
                        flags: 'g'
                    }
                },
            ]
        },
        // Add additional plugins to the compiler.
        plugins: [
            new AssetsPlugin({
                path: helpers.root('dist'),
                filename: 'webpack-assets.json',
                prettyPrint: true
            }),
            // Do type checking in a separate process, so webpack don't need to wait.
            new ForkCheckerPlugin(),
            //  Shares common code between the pages.
            new webpack.optimize.CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            // Provides context to Angular's use of System.import
            new ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                helpers.root('src') // location of your src
            ),
            // Copy files and directories in webpack.
            new CopyWebpackPlugin([{
                from: 'src/public',
                to: 'public'
            }]),
            // Simplifies creation of HTML files to serve your webpack bundles.
            new HtmlWebpackPlugin({
                template: 'src/public/index.html',
                chunksSortMode: 'dependency'
            }),
        ],
        // Include polyfills or mocks for various node stuff
        node: {
            global: 'window',
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}