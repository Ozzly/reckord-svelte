import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/api/openlibrary': {
				target: 'https://openlibrary.org',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/openlibrary/, '')
			}
		}
	}
});
