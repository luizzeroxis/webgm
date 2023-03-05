/* eslint-env node, commonjs */

const path = require("path");

const {mergeWithRules} = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = mergeWithRules({
	module: {
		rules: {
			test: "match",
			use: "prepend",
		},
	},

})(common, {
	mode: "development",
	output: {
		path: path.resolve(__dirname, "dist-dev"),
	},
	module: {
		rules: [
			{
				test: /\.[s]css$/,
				use: [
					"style-loader",
				],
			},
		],
	},
	optimization: {
		minimize: false,
	},
	devServer: {
		static: false,
		hot: false,
		liveReload: false,
		client: {
			overlay: false,
		},
		devMiddleware: {
			writeToDisk: true,
		},
	},
	devtool: "inline-source-map",
});