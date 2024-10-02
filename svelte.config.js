import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter(),
        paths: {
            base: process.env.NODE_ENV === 'production' ? 'https://SamuelWeese.github.io/BillingTracker' : '',
        }
	}
};