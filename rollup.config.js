import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: 'src/cli.ts',
		output: [
      { file: 'dist/isb.mjs', format: 'esm', banner: '#!/usr/bin/env node\n' },
    ],
		plugins: [
      typescript(),
      resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
		]
	},
]