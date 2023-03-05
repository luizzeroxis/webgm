/* eslint-env node, commonjs */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {mergeWithRules} = require("webpack-merge");
const WorkboxPlugin = require("workbox-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = mergeWithRules({
	module: {
		rules: {
			test: "match",
			use: "prepend",
		},
	},

})(common, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.[s]css$/,
				use: [
					// MiniCssExtractPlugin.loader,
					"style-loader", // temporarily using this for standalone reasons
				],
			},
		],
	},
	plugins: [
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
		}),
	],
});