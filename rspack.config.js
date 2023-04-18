const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, 'docs');
if (fs.existsSync(dist)) {
	fs.rmSync(dist, { recursive: true });
}

/**
 * @param {string} tmpl
 * @param {string} chunk
 */
function template(tmpl, chunk) {
	return {
		template: `./templates/${tmpl}.html`,
		chunks: [chunk],
		filename: `${chunk}.html`,
		publicPath: './'
	};
}


/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		'a-react-perf': './src/react/a-perf.tsx',
		'a-fast-perf': './src/fast/a-perf.ts',
		'b-react-perf': './src/react/b-perf.tsx',
		'b-fast-perf': './src/fast/b-perf.ts',
	},
	output: {
		path: 'docs',
	},
	builtins: {
		html: [
			template('react', 'a-react-perf'),
			template('fast', 'a-fast-perf'),
			template('react', 'b-react-perf'),
			template('fast', 'b-fast-perf'),
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
		open: true,
	}
};
