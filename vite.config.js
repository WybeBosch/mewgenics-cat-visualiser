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
					src: 'data-grabber/python/public/*',
					dest: '.',
				},
				{
					src: 'data-grabber/javascript-with-wasm/public/*',
					dest: '.',
				},
			],
		}),
	],
	root: 'src',
	build: {
		outDir: '../dist',
	},
	publicDir: false, // Disable default publicDir, use static copy instead
});
