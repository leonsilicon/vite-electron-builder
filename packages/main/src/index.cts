const { electron } = require('./electron.cjs');

const { app } = electron;

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

(async () => {
	const { main } = await import('./main.js');
	await main();
})();
