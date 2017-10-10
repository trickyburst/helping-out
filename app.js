const express = require('express');
const path = require('path');
const favicon = require('serve-favicon'); // do I need this?
//const logger = require('morgan'); // do I need logger?
const bodyParser = require('body-parser'); // do I need bodyParser?
const promise = require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const index = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev')); // do I need this?
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // do I need this?
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

//when not in production, load up dev-t resources and use webpack
if (process.env.NODE_ENV !== 'production') {
	const webpackMiddleware = require('webpack-dev-middleware'); //middleware
	const webpack = require('webpack'); //actual webpack library
	const webpackConfig = require('./webpack.config.js'); //my config file I put together
	app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
	app.use(express.static('dist')); // make everything inside dist directory freely available
	app.get('*', (req, res) => {
		//In the tutotrial, it was written this is specific for react router. But if I delete these lines, my app crashes???=)
		res.sendFile(path.join(__dirname, 'dist/index.html'));
	});
}

module.exports = app;

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
