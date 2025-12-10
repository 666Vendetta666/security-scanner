import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI build
  {
    entry: ['src/cli.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: false,
    shims: true,
    target: 'node18',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  // Library build (no shebang)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    shims: true,
    target: 'node18',
  },
  // Worker build
  {
    entry: { 'scanner-worker': 'src/scanner/worker.ts' },
    format: ['cjs', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: false,
    shims: true,
    target: 'node18',
    outDir: 'dist',
  },
]);
