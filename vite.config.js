import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
	base: '/mewgenics-visual-cat-organizer/',
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
	},
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: 'data-grabber/python/public/demo_mewgenics_cats.json',
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
		reportCompressedSize: false,
	},
	publicDir: false, // Disable default publicDir, use static copy instead
});
