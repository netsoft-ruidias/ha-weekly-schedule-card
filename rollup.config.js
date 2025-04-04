import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/weekly-schedule-card.ts',
  output: {
    file: 'dist/ha-weekly-schedule-card.js',
    format: 'es',
    sourcemap: true
  },
  context: 'window',
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })
  ]
};