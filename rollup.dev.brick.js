import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const { name } = pkg;

export default {
  input: 'brick/index.ts',
  output: [
    {
      file: './dist/brick.browser.mjs',
      format: 'es',
      sourcemap: true,
      name,
      globals: {
        svelte: 'svelte'
      }
    },
    {
      file: './dist/brick.browser.js',
      format: 'umd',
      sourcemap: true,
      name,
      globals: {
        svelte: 'svelte'
      }
    },
  ],
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // generate: production ? 'dom' : 'ssr',
      hydratable: true
    }),
    resolve(),
    commonjs()
  ],
  external: ['svelte'],
  watch: {
    clearScreen: false,
  }
}