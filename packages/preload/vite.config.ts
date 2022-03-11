import * as fs from 'node:fs';
import * as process from 'node:process';
import { builtinModules } from 'node:module';
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
	envDir: process.cwd(),
	build: {
		sourcemap: 'inline',
		target: `chrome${chrome}`,
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
