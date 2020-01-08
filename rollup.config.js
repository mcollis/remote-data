import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      output: 'compact',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      output: 'compact',
    },
  ],
  plugins: [
    external(),
    url({ exclude: ['**/*.svg'] }),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
  ],
};
