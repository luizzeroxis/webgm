/* eslint-env node, commonjs */

const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");
const {GitRevisionPlugin} = require("git-revision-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
	entry: {
		"main": "./src/index.js",
		"main-game": "./src/index-game.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.[s]css$/,
				use: [
					// 'style-loader',
					// MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
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
			chunks: "all", // insurance
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
				},
				images: {
					test(module) {
						return (
							module.resource
							&& module.resource.endsWith(".png")
						);
					},
					name: "images",
				},
				game: {
					test: /[\\/]src[\\/]game[\\/]/,
					name: "game",
				},
				common: { // technically, this could be in 'game', but it's probably good to be separate
					test: /[\\/]src[\\/]common[\\/]/,
					name: "common",
				},
			},
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			"CONSTANTS": {
				"COMMITHASH": JSON.stringify(gitRevisionPlugin.commithash()),
				"LASTCOMMITDATETIME": JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
			},
		}),
		new ESLintPlugin({
			files: path.resolve(__dirname, "."),
		}),
		new HtmlWebpackPlugin({
			title: "webgm",
			excludeChunks: ["main-game"],
		}),
		new HtmlWebpackPlugin({
			filename: "game.html",
			title: "webgm game",
			chunks: ["main-game"],
		}),
		new MiniCssExtractPlugin(),
	],
};