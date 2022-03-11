import * as process from 'node:process';
import { execaCommandSync as exec } from 'execa';

try {
	exec('pnpm exec nano-staged', { stdio: 'inherit' });
} catch {
	process.exit(1);
}
