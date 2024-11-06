const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const safePostCssParser = require("postcss-safe-parser");
// const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const { merge } = require("webpack-merge");

const path = require("path");
const DEV_PORT = 5678;

// const mode = process.env.NODE_ENV || "development";
// const prod = mode === "production";

console.log("!!!!!!!!!!!!!!!");

const publicPath = "/";

const isProduction = process.env.NODE_ENV === 'production';
// const shouldUseSourceMap = !isProduction;

// const postCssLoaderConfig = {
// 	loader: "postcss-loader",
// 	options: {
// 		ident: "postcss",
// 		plugins: () => [
// 			require("postcss-flexbugs-fixes"),
// 			require("postcss-preset-env")({ browsers: "last 6 versions" }),
// 			require("cssnano")()
// 		],
// 		sourceMap: !isProduction
// 	}
// };

module.exports = {
	mode: isProduction ? 'production' : 'development',
	bail: isProduction,
	context: path.resolve(__dirname, "./src"),
	devtool: isProduction ? false : "inline-source-map",
	entry: {
		main: {
			import: './index.ts',
		}
	},
	resolve: {
		// alias: {
		// 	svelte: path.resolve('node_modules', 'svelte/src/runtime')
		// },
		extensions: [".ts", ".mjs", ".js"],
		mainFields: ["svelte", "browser", "module", "main"],
		conditionNames: ['svelte', 'import', 'browser'],
		fallback: {
			assert: require.resolve('assert'),
			buffer: require.resolve('buffer'),
			fs: require.resolve('browserify-fs'),
			path: require.resolve('path-browserify'),
			stream: require.resolve('stream-browserify'),
			util: require.resolve('util'),
			process: require.resolve('process/browser'),
			zlib: require.resolve('browserify-zlib')
		}
	},
	experiments: {
		outputModule: true,
	},
	output: {
		path: __dirname + "/dist",
		library: {
			type: 'module',
		},
		filename: "[name].[contenthash].js",
		// chunkFilename: "[name].[contenthash].js",
		publicPath
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				use: "json-loader",
				type: 'javascript/auto'
			},
			{
				test: /\.(gif|png|jpe?g|bmp|eot|woff|woff2|ttf|svg)/i, // load file into src url
				loader: require.resolve("file-loader"),
				// Exclude `js` files to keep "css" loader working as it injects
				// its runtime that would otherwise be processed through "file" loader.
				// Also exclude `html` and `json` extensions so they get processed
				// by webpacks internal loaders.
				exclude: [
					/\.(js|mjs|jsx|ts|tsx|svelte)$/,
					/\.html$/,
					/\.json$/,
					/\.(scss|css)$/
				],
				options: {
					name: "[name].[contenthash].[ext]"
				}
			}
		]
	},
	plugins: [
		isProduction &&
		new CleanWebpackPlugin({
			verbose: true
		}),
		new HtmlWebPackPlugin(
			// merge(
			// 	{
			// 		template: "./index.html"
			// 	},
			// 	isProduction
			// 		? {
			// 			minify: {
			// 				removeComments: true,
			// 				collapseWhitespace: true,
			// 				removeRedundantAttributes: true,
			// 				useShortDoctype: true,
			// 				removeEmptyAttributes: true,
			// 				removeStyleLinkTypeAttributes: true,
			// 				keepClosingSlash: true,
			// 				minifyJS: true,
			// 				minifyCSS: true,
			// 				minifyURLs: true
			// 			}
			// 		}
			// 		: {}
			// )
		),
		new webpack.SourceMapDevToolPlugin({}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			// PUBLIC_URL: JSON.stringify(publicPath)
		}),
		new webpack.ProvidePlugin({
			// Work around for Buffer is undefined:
        	// https://github.com/webpack/changelog-v5/issues/10
			Buffer: ['buffer', 'Buffer'],
			process: 'process/browser',
	 	}),
		!isProduction && new CaseSensitivePathsPlugin(),
		// prod &&
		// new MiniCssExtractPlugin({
		// 	// Options similar to the same options in webpackOptions.output
		// 	// both options are optional
		// 	// filename: "[name].[contenthash:5].css",
		// 	// chunkFilename: "[name].[contenthash:5].chunk.css"
		// 	filename: "[name].css",
		// 	chunkFilename: "[id].css",
		// }),
		// new WebpackManifestPlugin({
		// 	fileName: "asset-manifest.json",
		// 	publicPath
		// // }),
		// new CopyPlugin({
		// 	patterns: [
		// 	{
		// 		from: path.resolve(__dirname, "public"),
		// 		to: path.resolve(__dirname, "dist")
		// 	}
		// ]})
		// new DashboardPlugin({port: DEV_PORT})
	].filter(Boolean),
	optimization: {
		minimize: true,
		minimizer: [
			// // This is only used in production mode
			// new TerserPlugin({
			// 	terserOptions: {
			// 		parse: {
			// 			// we want terser to parse ecma 8 code. However, we don't want it
			// 			// to apply any minfication steps that turns valid ecma 5 code
			// 			// into invalid ecma 5 code. This is why the 'compress' and 'output'
			// 			// sections only apply transformations that are ecma 5 safe
			// 			// https://github.com/facebook/create-react-app/pull/4234
			// 			ecma: 8
			// 		},
			// 		compress: {
			// 			ecma: 5,
			// 			warnings: false,
			// 			// Disabled because of an issue with Uglify breaking seemingly valid code:
			// 			// https://github.com/facebook/create-react-app/issues/2376
			// 			// Pending further investigation:
			// 			// https://github.com/mishoo/UglifyJS2/issues/2011
			// 			comparisons: false,
			// 			// Disabled because of an issue with Terser breaking valid code:
			// 			// https://github.com/facebook/create-react-app/issues/5250
			// 			// Pending futher investigation:
			// 			// https://github.com/terser-js/terser/issues/120
			// 			inline: 2
			// 		},
			// 		mangle: {
			// 			safari10: true
			// 		},
			// 		output: {
			// 			ecma: 5,
			// 			comments: false,
			// 			// Turned on because emoji and regex is not minified properly using default
			// 			// https://github.com/facebook/create-react-app/issues/2488
			// 			ascii_only: true
			// 		}
			// 	},
			// 	// Use multi-process parallel running to improve the build speed
			// 	// Default number of concurrent runs: os.cpus().length - 1
			// 	parallel: true,
			// 	// Enable file caching
			// 	cache: true,
			// 	sourceMap: shouldUseSourceMap
			// }),
			// This is only used in production mode
			// new OptimizeCSSAssetsPlugin({
			// 	cssProcessorOptions: {
			// 		parser: safePostCssParser,
			// 		map: shouldUseSourceMap
			// 			? {
			// 				// `inline: false` forces the sourcemap to be output into a
			// 				// separate file
			// 				inline: false,
			// 				// `annotation: true` appends the sourceMappingURL to the end of
			// 				// the css file, helping the browser find the sourcemap
			// 				annotation: true
			// 			}
			// 			: false
			// 	}
			// })
		]
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		// splitChunks: {
		// 	minSize: 30000,
		// 	chunks: "all",
		// 	name: false,
		// 	cacheGroups: {
		// 		vendors: {
		// 			test: /[\\/]node_modules[\\/]/,
		// 			priority: -10
		// 		},
		// 		default: {
		// 			minChunks: 2,
		// 			priority: -20,
		// 			reuseExistingChunk: true
		// 		}
		// 	}
		// },
		// // Keep the runtime chunk separated to enable long term caching
		// // https://twitter.com/wSokra/status/969679223278505985
		// runtimeChunk: true
	},
	devServer: {
		hot: true,
		host: '0.0.0.0',
		historyApiFallback: true,
		https: true,
		static: {
			directory: path.join(__dirname, 'dist'),
			publicPath: '/',
		},
		port: DEV_PORT
	}
};