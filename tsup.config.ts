import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: { entry: { index: 'src/types.ts' } },
    sourcemap: false,
    clean: true,
    target: 'es2022',
    platform: 'neutral',
    treeshake: false,
    splitting: false,
  },
  {
    entry: { jsbn: 'src/index.ts' },
    format: ['iife'],
    globalName: 'jsbn',
    sourcemap: false,
    clean: false,
    target: 'es2022',
    platform: 'browser',
    treeshake: false,
    outExtension() {
      return { js: '.global.js' };
    },
  },
]);
