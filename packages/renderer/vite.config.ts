import * as fs from 'node:fs';
import * as process from 'node:process';
import { builtinModules } from 'node:module';
import * as path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { dirname } from 'desm';
import type { UserConfig } from 'vite';

const { chrome } = JSON.parse(
	fs.readFileSync('../../.electron-vendors.cache.json', 'utf-8')
) as {
	chrome: string;
};

const PACKAGE_ROOT = dirname(import.meta.url);

/**
 * @see https://vitejs.dev/config/
 */
const config: UserConfig = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	resolve: {
		alias: {
			'~': path.join(PACKAGE_ROOT, 'src') + '/',
		},
	},
	plugins: [vue()],
	base: '',
	server: {
		fs: {
			strict: true,
		},
	},
	build: {
		sourcemap: true,
		target: `chrome${chrome}`,
		outDir: 'dist',
		assetsDir: '.',
		rollupOptions: {
			input: path.join(PACKAGE_ROOT, 'index.html'),
			external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
		},
		emptyOutDir: true,
		brotliSize: false,
	},
	test: {
		environment: 'happy-dom',
	},
};

export default config;
