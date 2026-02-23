import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = path.join(root, 'pdf-text/n3/vocabs.txt');
const outputPath = path.join(root, 'src/server/generated-n3-units.ts');

const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw.split(/\r?\n/);

const unitHeaderPattern = /UNIT\s+(\d+)\s*\(([^)]*)\)/i;
const itemPattern = /^\s*([0-9]+|-)\.\s*(.+)$/;

const units = [];
let currentUnit = null;
let fallbackIndex = 1;

function clean(value) {
  return value
    .replace(/^\*+|\*+$/g, '')
    .replace(/^[-\s]+|[-\s]+$/g, '')
    .trim();
}

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line) {
    continue;
  }

  const headerMatch = line.match(unitHeaderPattern);
  if (headerMatch) {
    const unitNumber = Number(headerMatch[1]);
    const title = clean(headerMatch[2]) || `Unit ${unitNumber}`;
    currentUnit = {
      id: `n3-unit-${unitNumber}`,
      unitNumber,
      title: `Unit ${unitNumber}`,
      focus: title,
      vocabulary: [],
    };
    units.push(currentUnit);
    fallbackIndex = 1;
    continue;
  }

  if (!currentUnit) {
    continue;
  }

  if (/^No\./i.test(line)) {
    continue;
  }

  const itemMatch = line.match(itemPattern);
  if (!itemMatch) {
    continue;
  }

  const numberToken = itemMatch[1];
  const content = itemMatch[2];
  const columns = content.split(',').map((part) => part.trim());

  const japanese = clean(columns[0] || content);
  const hiragana = clean(columns[1] || '');
  const meaning = clean(columns.slice(2).join(', ') || '');

  if (!japanese) {
    continue;
  }

  const itemIndex = numberToken === '-' ? `x${fallbackIndex++}` : numberToken;
  currentUnit.vocabulary.push({
    id: `n3-u${currentUnit.unitNumber}-v${itemIndex}`,
    japanese,
    ...(hiragana && hiragana !== '-' ? { hiragana } : {}),
    romaji: '',
    burmesePronunciation: '',
    meaning: meaning || '(from vocabs.txt)',
  });
}

const header = '/* Auto-generated from pdf-text/n3/vocabs.txt by scripts/generate-n3-units.mjs */\n\n';
const body = `export const GENERATED_N3_UNITS = ${JSON.stringify(units, null, 2)} as const;\n`;
fs.writeFileSync(outputPath, header + body, 'utf8');

console.log(`Generated ${units.length} N3 units at ${outputPath}`);
console.log(units.slice(0, 5).map((u) => `${u.unitNumber}:${u.vocabulary.length}`).join(', '));
