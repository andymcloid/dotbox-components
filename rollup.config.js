import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'components/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    terser(),
    copy({
      targets: [
        { src: 'components/**/*.css', dest: 'dist' }
      ]
    })
  ]
}; 