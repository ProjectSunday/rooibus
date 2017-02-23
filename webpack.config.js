var path = require('path');
var webpack = require('webpack');

var node_modules    = path.resolve(__dirname, 'node_modules');
var src             = path.resolve(__dirname, 'src');

module.exports = {
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // compress: true,
        historyApiFallback: true,
        // respond to 404s with index.html
        
        hot: true,
        // enable HMR on the server
        
        host: 'localhost',
        port: 3000
    },
    //devtool: 'source-map',                  //not trust worthy for debugging, why????
    devtool: 'inline-source-map',           //i dont know
    entry: [
        'react-hot-loader/patch',
        // activate HMR for React
        
        'webpack-dev-server/client?http://localhost:3000',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // needed or else the page refreshes on hmr updates

        './src/index'
    ],
    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: '/'
    },
    // module: {
    //     loaders: [
    //         {
    //             test: /\.js$/,
    //             loaders: ['babel-loader'],
    //             include: src,
    //             exclude: node_modules,
    //         },
    //         {
    //         	test: /\.html$/,
    //             loader: 'file-loader?name=[name].[ext]',
    //         	include: src,
    //         },
    //         {
    //             test: /manifest.json$/,
    //             loader: 'file-loader',
    //             include: src
    //         }
    //     ]
    // },


    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/,
            },
            {
            	test: /\.html$/,
                use: [ 'file-loader?name=[name].[ext]' ],
            	include: /src/,
            },
            {
                test: /manifest.json$/,
                use: [ 'file-loader' ],
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
            // 'process.env.BLAH': JSON.stringify(BUILD_NUMBER)
        }),
    ]
}