/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		react: './src/react/index.tsx',
		fast: './src/fast/index.ts',
	},
	output: {
		path: 'docs',
	},
	builtins: {
		html: [
			{
				template: './templates/react-perf.html',
				chunks: ['react'],
				filename: 'react-perf.html',
				publicPath: './'
			},
			{
				template: './templates/fast-perf.html',
				chunks: ['fast'],
				filename: 'fast-perf.html',
				publicPath: './'
			},
			{
				template: './templates/index.html',
				chunks: [],
				filename: 'index.html',
			},
		]
	},
	module: {
		rules: []
	},
	devServer: {
		hot: false,
		liveReload: false,
	}
};
