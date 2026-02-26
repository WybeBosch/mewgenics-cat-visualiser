import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/mewgenics-cat-visualiser/',
	plugins: [react()],
	root: 'src',
	build: {
		outDir: '../dist',
	},
	publicDir: '../get-the-data', // Serve static files from get-the-data
});
