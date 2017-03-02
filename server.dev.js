// var express = require('express')
// var path = require('path')
// var webpack = require('webpack')
// var webpackDevMiddleware = require('webpack-dev-middleware')
// var webpackHotMiddleware = require('webpack-hot-middleware')

// var config = require('./webpack.config.dev.js')

// var app = express()
// var compiler = webpack(config)

// var devMiddleware = webpackDevMiddleware(compiler, {
// 	hot: true,												//for HMR
// 	publicPath: config.output.publicPath,					//no idea
// 	stats: { chunks: false, colors: true }					//disable verbose and turn on colors
// })

// app.use(devMiddleware)
// app.use(webpackHotMiddleware(compiler))

// // app.get('/authentication', function (req, res) {
// // 	res.send('Authenticated')
// // })


// //for html5 history, because html5 history is hard
// app.use((req, res, next) => {
// 	var paths = req.url.split('/')
// 	var file = paths[paths.length - 1]
// 	if (['bundle.js', 'index.html'].indexOf(file) !== -1) {
// 		res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, file)))
// 	} else if (file.indexOf('.') === -1) {
// 		res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, 'index.html')))
// 	} else {
// 		next()
// 	}
// })

// var port = process.env.PORT || 3000
// var env = process.env.NODE_ENV || 'LOCAL'

// app.listen(port, () => {
// 	console.log('===================================================================================')
// 	console.log(`Rooibus Server Online. Port: ${port}. Environment: ${env}`)
// 	console.log('===================================================================================')
// 	console.log('webpack building...')
// })

