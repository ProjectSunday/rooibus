const { resolve } = require('path');
const webpack = require('webpack');

var config = {
    context: resolve(__dirname, 'src'),

    entry: [
        './index'
    ],

    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'public'),
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: [
                    resolve(__dirname, 'src/pwa/'),
                ],
                use: [ 'file-loader?name=[name].[ext]' ]                
            },
            {
                test: /\.js$/,
                use: [ 'babel-loader' ],
                exclude: [
                    resolve(__dirname, 'node_modules/'),
                    resolve(__dirname, 'src/pwa/')
                ]
            },
            {
            	test: /\.html$/,
                use: [ 'file-loader?name=[name].[ext]' ],
            	include: /src/,
            },
            {
                test: /\.(png|ico|svg|gif)$/,
                use: [ 'url-loader?limit=10000' ],
                include: [
                    resolve(__dirname, 'src/images/')
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
                exclude: /node_modules/,
                include: /src/
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
        
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'local')
        })
    ]
}


/**********************************************
 * Local
 **********************************************/
if (process.env.NODE_ENV !== 'production') {

    // needed or else the page refreshes on hmr updates
    config.entry.unshift('webpack/hot/only-dev-server')

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    config.entry.unshift('webpack-dev-server/client?http://localhost:3000')

    // activate HMR for React
    config.entry.unshift('react-hot-loader/patch')

    //not trust worthy for debugging, why????
    config.devtool = 'source-map'      

    config.devServer = {
        // compress: true,
        historyApiFallback: true,
        // respond to 404s with index.html
        
        hot: true,
        // enable HMR on the server
        
        contentBase: resolve(__dirname, 'public'),

        publicPath: '/',

        host: 'localhost',
        port: 3000
    }
}

module.exports = config