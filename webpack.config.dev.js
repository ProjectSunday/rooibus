var path = require('path');
var webpack = require('webpack');
// var HtmlWebpackPlugin = require('html-webpack-plugin');

var node_modules    = path.resolve(__dirname, 'node_modules');
var src             = path.resolve(__dirname, 'src');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
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
            	loader: 'file-loader',
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
        // new HtmlWebpackPlugin({
        //     template: './src/index.html',
        //     inject: 'body'
        // })
    ]
};
