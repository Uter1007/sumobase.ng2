// heavily inpsired by https://github.com/preboot/angular2-webpack/blob/master/webpack.config.js
var path = require('path');
var webpack = require('webpack');

//******** Webpack Plugins************

// The CommonsChunkPlugin can move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
// The runtime is moved to the commons chunk too. This means the old entry chunks are initial chunks now.
// See all options in the list of plugins.
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

// PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use
var autoprefixer = require('autoprefixer');

// This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles.
// This is especially useful for webpack bundles that include a hash in the filename which changes every compilation.
var HtmlWebpackPlugin = require('html-webpack-plugin');

//Extract text from bundle into a file
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// Copy files and directories in webpack
var CopyWebpackPlugin = require('copy-webpack-plugin');

// A CLI dashboard for webpack dev server
var DashboardPlugin = require('webpack-dashboard/plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    var config = {}; // This is the object where all configuration gets set

    if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    config.debug = !isProd || !isTest;

    // http://webpack.github.io/docs/configuration.html#entry
    config.entry = isTest ? {} : {
        'polyfills': './src/polyfills.ts', // Polyfills for older browsers
        'vendor': './src/vendor.ts', // 3rd Party files
        'app': './src/main.ts' // our angular app
    };

    // http://webpack.github.io/docs/configuration.html#output
    // path: The output directory as absolute path (required).
    // publicPath: specifies the public URL address of the output files when referenced in a browser.
    // For loaders that embed <script> or <link> tags or reference assets like images,
    // publicPath is used as the href or url() to the file when it’s different then their location on disk
    // filename: Specifies the name of each output file on disk.
    // chunkFilename: The filename of non-entry chunks as relative path inside the output.path directory.
    config.output = isTest ? {} : {
        path: root('dist'), //using Helper Root
        publicPath: isProd ? '/' : 'http://localhost:8080/',
        filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
        chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
    };

    //http://webpack.github.io/docs/configuration.html#resolve
    config.resolve = {
        cache: !isTest,
        root: root(),
        // only discover files that have those extensions
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'src/app',
            'common': 'src/common'
        }
    };

    // Module-Loaders  http://webpack.github.io/docs/configuration.html#module-loaders
    // List: http://webpack.github.io/docs/list-of-loaders.html
    config.module = {
        preLoaders: isTest ? [] : [{test: /\.ts$/, loader: 'tslint'}],
        loaders: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loaders: ['ts', 'angular2-template-loader', '@angularclass/hmr-loader'],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
            },

            // copy those assets to output
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file?name=fonts/[name].[hash].[ext]?'
            },

            // Support for *.json files.
            {test: /\.json$/, loader: 'json'},

            // Support for CSS as raw text
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
            },
            // all css required in src/app files will be merged in js files
            {test: /\.css$/, include: root('src', 'app'), loader: 'raw!postcss'},

            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.scss$/,
                exclude: root('src', 'app'),
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
            },
            // all css required in src/app files will be merged in js files
            {test: /\.scss$/, exclude: root('src', 'style'), loader: 'raw!postcss!sass'},

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {test: /\.html$/, loader: 'raw',  exclude: root('src', 'public')}
        ],
        postLoaders: []
    };

    if (isTest) {
        // instrument only testing sources with Istanbul, covers ts files
        config.module.postLoaders.push({
            test: /\.ts$/,
            include: path.resolve('src'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
        });

        // needed for remap-instanbul
        config.ts = {
            compilerOptions: {
                sourceMap: false,
                sourceRoot: './src',
                inlineSourceMap: true
            }
        };
    }

    // http://webpack.github.io/docs/configuration.html#plugins
    config.plugins = [
        // Define env variables to help with builds
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        })
    ];

    if (!isTest && !isProd) {
        config.plugins.push(new DashboardPlugin());
    }

    if (!isTest) {
        config.plugins.push(
            // Generate common chunks if necessary
            // Reference: https://webpack.github.io/docs/code-splitting.html
            // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
            new CommonsChunkPlugin({
                name: ['vendor', 'polyfills']
            }),

            // Inject script and link tags into html files
            // Reference: https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                template: './src/public/index.html',
                chunksSortMode: 'dependency'
            }),

            // Extract css files
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin('css/[name].[hash].css', {disable: !isProd})
        );
    }

    // Add build specific plugins
    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({mangle: { keep_fnames: true }}),

            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
                from: root('src/public')
            }])
        );
    }

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Sass
     * Reference: https://github.com/jtangelder/sass-loader
     * Transforms .scss files to .css
     */
    config.sassLoader = {
        //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
    };

    /**
     * Apply the tslint loader as pre/postLoader
     * Reference: https://github.com/wbuchwalter/tslint-loader
     */
    config.tslint = {
        emitErrors: false,
        failOnHint: false
    };

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
    };

    return config;

}();

// Helper functions - if we have more helpers we can extract it to it's own file like in AngularClass BoilerPlate
// https://github.com/AngularClass/angular2-webpack-starter/blob/master/config/helpers.js
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}