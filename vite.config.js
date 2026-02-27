import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	base: '/mewgenics-cat-visualiser/',
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: 'data-grabber/python/public/example_mewgenics_cats.json',
					dest: '.',
				},
				{
					src: 'data-grabber/javascript-with-wasm/public/compiled-binaries/*',
					dest: '.',
				},
			],
		}),
	],
	root: 'src',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
	},
	publicDir: false, // Disable default publicDir, use static copy instead
});
