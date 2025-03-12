import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

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
    // Process and bundle CSS
    postcss({
      extract: 'dotbox-components.bundled.css',
      minimize: true,
      plugins: [
        cssnano({
          preset: 'default',
        })
      ],
      // Include all CSS files
      include: ['**/*.css'],
      // Don't inject CSS into JS
      inject: false
    }),
    // Minify the output
    terser({
      format: {
        comments: false
      }
    }),
    // Copy original CSS files for those who want to use them separately
    copy({
      targets: [
        { src: 'components/**/*.css', dest: 'dist/css' }
      ]
    })
  ]
}; 