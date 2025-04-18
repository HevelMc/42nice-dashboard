import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		alias: {
			$components: './src/lib/components',
			$stores: './src/stores',
			$routes: './src/routes',
			$lib: './src/lib',
			$src: './src'
		}
	}
};

export default config;
