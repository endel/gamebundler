#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { execPath } from 'process';

const loader = fileURLToPath(new URL('../lib/utils/node-loader.js', import.meta.url));
const cli = fileURLToPath(new URL('../lib/cli.js', import.meta.url));

const child = spawn(execPath, [
  '--experimental-loader',
  loader,
  cli,
  ...process.argv.slice(2)
], {
  encoding: 'utf8'
});

// forward stdout and stderr to the current process
child.stdout.on('data', data => process.stdout.write(data));
child.stderr.on('data', data => process.stderr.write(data));
child.on("exit", () => process.exit());

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => child.kill(signal));
});
