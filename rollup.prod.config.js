import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'components/index.js',
  output: {
    file: 'dist/dotbox-components.bundled.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    // Resolve node modules
    resolve(),
    // Convert CommonJS modules to ES6
    commonjs(),
    // Minify the output
    terser({
      format: {
        comments: false
      }
    }),
    // Copy CSS files
    copy({
      targets: [
        { src: 'components/**/*.css', dest: 'dist' }
      ]
    })
  ]
}; 