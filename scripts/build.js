import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const files = ['index.html', 'style.css', 'server.js', 'src/app.js', 'src/audio.js', 'src/dsp.js', 'src/scene.js',
  'start-sonic-forcefield.cmd', 'node_modules/three/build/three.module.js', 'node_modules/three/build/three.core.js', 'node_modules/three/LICENSE'];
for (const file of files) {
  const target = new URL(file, output);
  await mkdir(dirname(fileURLToPath(target)), { recursive: true });
  await copyFile(new URL(file, root), target);
}
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
await writeFile(new URL('package.json', output), JSON.stringify({ name: pkg.name, version: pkg.version, private: true,
  type: 'module', scripts: { start: 'node server.js' }, engines: pkg.engines }, null, 2) + '\n');
await writeFile(new URL('README.txt', output), 'Sonic ForceField\nNode.js 20+ is required.\nRun start-sonic-forcefield.cmd or node server.js.\nOpen http://127.0.0.1:8765 in Chrome/Edge.\nClick Start and allow microphone access.\nKeep the page visible; measurement stops when hidden.\nThis detects motion, not identity, distance, or stationary presence.\nNo microphone data is stored or transmitted.\nSoundWave reference: https://www.microsoft.com/en-us/research/project/soundwave-using-the-doppler-effect-to-sense-gestures/\n');
console.log('Built dist/ — includes Three.js; no package installation required at runtime.');
