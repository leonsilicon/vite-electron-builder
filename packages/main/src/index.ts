/* eslint-disable unicorn/no-process-exit */

import { app } from 'electron';
import './security-restrictions.js';
import * as process from 'node:process';
import { restoreOrCreateWindow } from './main-window.js';

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create app window when background process will be ready
 */
app
	.whenReady()
	.then(restoreOrCreateWindow)
	.catch((error) => {
		console.error('Failed create window:', error);
	});

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
	app
		.whenReady()
		.then(async () => import('electron-devtools-installer'))
		// eslint-disable-next-line @typescript-eslint/naming-convention
		.then(async ({ default: installExtension, VUEJS3_DEVTOOLS }) =>
			installExtension(VUEJS3_DEVTOOLS, {
				loadExtensionOptions: {
					allowFileAccess: true,
				},
			})
		)
		.catch((error) => {
			console.error('Failed install extension:', error);
		});
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
	app
		.whenReady()
		.then(async () => import('electron-updater'))
		.then(async ({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
		.catch((error) => {
			console.error('Failed check updates:', error);
		});
}
