import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, '../public/data/scriptures.json');
const backendPath = path.resolve(__dirname, '../../sacred-beetle-backend/data/scriptures.json');

const expectedTitles = [
  'Если бы святой жук оказался в безвыходной ситуации',
  'Жук — святое насекомое',
  'Святой жук в любом обличии святой',
  'Святой жук в любом обличии пиздат',
  'Кайфуй, сестра',
  'О ядовитом жуке и его проклятии',
  'Поддержка святого жука',
  'Аминьжук и иншажук',
  'Святой жук и женщина',
  'Кучка, круглая и не круглая',
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

test('default scriptures are present in frontend and backend data files', () => {
  const frontendData = readJson(frontendPath);
  const backendData = readJson(backendPath);

  const frontendTitles = frontendData.map((item) => item.title);
  const backendTitles = backendData.map((item) => item.title);

  for (const title of expectedTitles) {
    assert.ok(frontendTitles.includes(title), `Frontend missing: ${title}`);
    assert.ok(backendTitles.includes(title), `Backend missing: ${title}`);
  }
});
