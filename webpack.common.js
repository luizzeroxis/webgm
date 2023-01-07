/* eslint-env node, commonjs */

const path = require("path");

const webpack = require('webpack');
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {GitRevisionPlugin} = require("git-revision-webpack-plugin");

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					// 'style-loader',
					// MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},
			{
				test: /\.png$/,
				use: [
					{
						loader: "url-loader",
						options: {
							mimetype: "image/png",
						},
					},
				],
			},
		],
	},
	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
				image: {
					test(module) {
						const path = require('path');
						return (
							module.resource &&
							module.resource.endsWith('.png')
						);
					},
					name: "images",
					chunks: "all",
				}
			},
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			"CONSTANTS": {
				"COMMITHASH": JSON.stringify(gitRevisionPlugin.commithash()),
				"LASTCOMMITDATETIME": JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
			}
		}),
		new HtmlWebpackPlugin({
			title: "webgm",
		}),
		new MiniCssExtractPlugin(),
		new ESLintPlugin({
			files: path.resolve(__dirname, "."),
		}),
	],
};