import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readProjectFile(relativePath) {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

test('project files exist and are wired together', () => {
  assert.match(readProjectFile('index.html'), /<title>Ketryx Learning Project<\/title>/);
  assert.match(readProjectFile('index.html'), /<script src="script.js"><\/script>/);
  assert.match(readProjectFile('script.js'), /localStorage/);
  assert.match(readProjectFile('styles.css'), /\.card/);
});

test('package.json exposes a start script and a test script', () => {
  const pkg = JSON.parse(readProjectFile('package.json'));
  assert.equal(pkg.scripts.start.includes('http.server'), true);
  assert.equal(pkg.scripts.test, 'node --test');
});
