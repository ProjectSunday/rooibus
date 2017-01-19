import express         		from 'express'
import path 				from 'path'
import webpack 				from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

var server = function (config) {

	var app = express()
	var compiler = webpack(config)

	var devMiddleware = webpackDevMiddleware(compiler, {
		hot: true,
		publicPath: config.output.publicPath,
		stats: { chunks: false, colors: true }
	})

	app.use(devMiddleware)

	app.use(webpackHotMiddleware(compiler))

	// app.get('/authentication', function (req, res) {
	// 	res.send('Authenticated')
	// })


	//because html5 history is hard
	app.use((req, res, next) => {
		var paths = req.url.split('/')
		var file = paths[paths.length - 1]
		if (['bundle.js', 'index.html'].indexOf(file) !== -1) {
			res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, file)))
		} else if (file.indexOf('.') === -1) {
			res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, 'index.html')))
		} else {
			next()
		}
	})


	var port = process.env.PORT || 3000
	var env = process.env.NODE_ENV || 'LOCAL'

	app.listen(port, () => {
		console.log('===================================================================================')
		console.log(`Rooibus Server Online. Port: ${port}. Environment: ${env}`)
		console.log('===================================================================================')
	    console.log('webpack building...')
	})

}

module.exports = server


