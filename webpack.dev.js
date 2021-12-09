const { merge, mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = mergeWithRules({
	module: {
		rules: {
			test: "match",
			use: "prepend",
		},
	},
	
})(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
				]
			},
		]
	},
});