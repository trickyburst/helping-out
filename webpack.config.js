const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //extracts the CSS code from the generated JS bundle into a separate file
const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals'); //avoid bundling express

module.exports = {
	entry: './public/javascripts/userprofile-app.js', // is it correct to use this as my entrypoint?
	target: 'node',
	externals: [nodeExternals()], //avoid bundling express
	output: {
		path: path.resolve(__dirname, 'public', 'dist'),
		filename: 'bundle.js',
		publicPath: 'dist/'
	},
	devtool: 'source-map', // specify which kind of sourcemap to use
	module: {
		rules: [
			{
				use: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/ // don't apply babel to the files in node modules diectory
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [
						'css-loader?sourceMap',
						'postcss-loader?sourceMap',
						'sass-loader?sourceMap'
					]
				})
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader', 'postcss-loader']
				})
			}
		]
	},
	plugins: [
		// extract inline css into separate 'styles.css'
		new ExtractTextPlugin('styles.css'),
		new webpack.LoaderOptionsPlugin({
			minimize: false,
			debug: true,
			options: {
				postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		})
	]
};
