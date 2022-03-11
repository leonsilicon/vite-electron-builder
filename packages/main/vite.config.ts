import * as fs from 'node:fs';
import * as process from 'node:process';
import { join } from 'node:path';
import { builtinModules } from 'node:module';
import { dirname } from 'desm';
import type { UserConfig } from 'vite';

const { node } = JSON.parse(
	fs.readFileSync('../../electron-vendors.cache.json', 'utf-8')
) as { node: string };

const PACKAGE_ROOT = dirname(import.meta.url);

/**
 * @see https://vitejs.dev/config/
 */
const config: UserConfig = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	envDir: process.cwd(),
	resolve: {
		alias: {
			'~': join(PACKAGE_ROOT, 'src') + '/',
		},
	},
	build: {
		sourcemap: 'inline',
		target: `node${node}`,
		outDir: 'dist',
		assetsDir: '.',
		minify: process.env.MODE !== 'development',
		lib: {
			entry: 'src/index.ts',
			formats: ['cjs'],
		},
		rollupOptions: {
			external: [
				'electron',
				'electron-devtools-installer',
				...builtinModules.flatMap((p) => [p, `node:${p}`]),
			],
			output: {
				entryFileNames: '[name].cjs',
			},
		},
		emptyOutDir: true,
		brotliSize: false,
	},
};

export default config;
