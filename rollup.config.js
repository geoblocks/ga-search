import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'ga-search.js',
  output: [{
    file: 'build/ga-search.js',
    format: 'umd',
    sourcemap: true
  }, {
    file: 'build/ga-search.min.js',
    format: 'umd',
    sourcemap: true,
    plugins: [terser()]
  }],
  plugins: [nodeResolve()]
};
