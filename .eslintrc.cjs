const path = require('path');

module.exports = {
	extends: [require.resolve('@leonzalion/configs/eslint.cjs')],
	parserOptions: { project: [path.resolve(__dirname, 'tsconfig.eslint.json')] }
};
