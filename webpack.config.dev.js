var path = require('path');
var webpack = require('webpack');

var node_modules    = path.resolve(__dirname, 'node_modules');
var src             = path.resolve(__dirname, 'src');

var BUILD_NUMBER = 0

module.exports = {
    devtool: 'eval-source-map',  //not trust worthy for debugging
    entry: [
    	'babel-polyfill',
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
                loaders: ['babel-loader'],
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'local'),
            'process.env.BLAH': JSON.stringify(BUILD_NUMBER)
        }),
    ]
}