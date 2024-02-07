import { defineConfig } from 'vite';
import copyPlugin from 'rollup-plugin-copy';

/** @type {import('vite').UserConfig} */
// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  plugins: [
    copyPlugin({
      targets: [{ src: 'src/driver/wdio.mjs', dest: '.vite/build' }],
    }),
  ]
});
