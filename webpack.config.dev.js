var path = require('path');
var webpack = require('webpack');

var node_modules    = path.resolve(__dirname, 'node_modules');
var src             = path.resolve(__dirname, 'src');


module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: src,
                exclude: node_modules,
            },
            {
            	test: /\.html$/,
                loader: 'file-loader?name=[name].[ext]',
            	include: src,
            },
            {
                test: /manifest.json$/,
                loader: 'file-loader',
                include: src
            }
        ]
    },


    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}