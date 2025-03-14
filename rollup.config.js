import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'components/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  external: [
    'lit', 
    'lit/html.js', 
    'lit/directives/',
    '@lit/reactive-element',
    '@lit/reactive-element/',
    'lit-html',
    'lit-html/',
    'lit-element/lit-element.js'
  ],
  plugins: [
    resolve(),
    terser({
      format: {
        comments: false
      }
    }),
    copy({
      targets: [
        { src: 'components/**/*.css', dest: 'dist' }
      ]
    })
  ]
}; 