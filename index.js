var server
var config

if (process.env.NODE_ENV === 'production') {
	server = require('./server.prod.js')
	config = require('webpack.config.prod.js')
} else {
	server = ('./server.dev.js')
	config = require('webpack.config.dev.js')
}

server(config)