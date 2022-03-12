import * as fs from 'node:fs';
import * as process from 'node:process';
import { builtinModules } from 'node:module';
import { join, dirname } from 'desm';
import type { UserConfig } from 'vite';
import type { Plugin } from 'rollup';
import ts from 'typescript';

const { node } = JSON.parse(
	fs.readFileSync(
		join(import.meta.url, '../../.electron-vendors.cache.json'),
		'utf-8'
	)
) as { node: string };

const PACKAGE_ROOT = dirname(import.meta.url);

function copyElectronCjs(): Plugin {
	return {
		name: 'copy-electron-cjs',
		buildStart() {
			const source = fs.readFileSync(
				join(import.meta.url, 'src/electron.cts'),
				'utf-8'
			);

			const result = ts.transpileModule(source, {});

			fs.writeFileSync(
				join(import.meta.url, './dist/electron.cjs'),
				result.outputText
			);
		},
	};
}

/**
 * @see https://vitejs.dev/config/
 */
const config: UserConfig = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	envDir: process.cwd(),
	resolve: {
		alias: {
			'~r': join(import.meta.url, '../renderer/src'),
			'~p': join(import.meta.url, '../preload/src'),
			'~m': join(import.meta.url, './src'),
		},
	},
	build: {
		sourcemap: 'inline',
		target: `node${node}`,
		outDir: 'dist',
		assetsDir: '.',
		minify: process.env.MODE !== 'development',
		lib: {
			entry: 'src/index.cts',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				/electron\.cjs/,
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
	plugins: [copyElectronCjs()],
};

export default config;
