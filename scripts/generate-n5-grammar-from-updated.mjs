import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = path.join(root, 'pdf-text/n5/grammar/updated-grammar.txt');
const outputPath = path.join(root, 'src/server/generated-grammar.ts');

const raw = fs.readFileSync(inputPath, 'utf8');
const chapterRegex = /(?:\*\*)?第\s*(\d+)\s*回(?:\*\*)?/g;
const chapterMatches = Array.from(raw.matchAll(chapterRegex));

function cleanText(text) {
  return text
    .replace(/^[-*\s]+|[-*\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitJpMm(text) {
  const normalized = cleanText(text);
  const mmIndex = normalized.search(/[\u1000-\u109F]/);
  if (mmIndex < 0) {
    return { japanese: normalized, burmese: '' };
  }
  let japanese = cleanText(normalized.slice(0, mmIndex));
  let burmese = cleanText(normalized.slice(mmIndex));

  // Fix OCR-style split where placeholder token (e.g. N/V/Adj) is attached to Japanese side.
  const trailingTokenMatch = japanese.match(/\s([A-Za-z~～][A-Za-z0-9~～/()（）+-]{0,14})$/);
  if (trailingTokenMatch) {
    const token = trailingTokenMatch[1];
    const isPlaceholder =
      /^(N|V|Adj|Time|Place|person|Person|plain|Plain|Dic|VDic|Verb)$/i.test(token) ||
      /^[NV][0-9]$/i.test(token) ||
      /^[A-Za-z]{1,5}[0-9]$/.test(token);
    if (isPlaceholder) {
      japanese = cleanText(japanese.slice(0, -token.length));
      burmese = cleanText(`${token} ${burmese}`);
    }
  }

  return { japanese, burmese };
}

function parseExampleSegments(line) {
  const content = cleanText(line.replace(/^例\s*[：:]\s*/, ''));
  if (!content) return [];

  const rawSegments = content.split(/(?=(?:^|\s)[0-9０-９]+\s*[．.])/).map((s) => cleanText(s)).filter(Boolean);
  const segments = rawSegments.length ? rawSegments : [content];

  return segments
    .map((seg) => {
      const stripped = cleanText(seg.replace(/^[0-9０-９]+\s*[．.]\s*/, ''));
      const { japanese, burmese } = splitJpMm(stripped);
      if (!japanese) return null;
      return {
        japanese,
        burmese: burmese || 'ဥပမာဝါကျ',
      };
    })
    .filter(Boolean);
}

const chapters = [];

for (let i = 0; i < chapterMatches.length; i += 1) {
  const match = chapterMatches[i];
  const chapterId = Number(match[1]);
  if (!Number.isFinite(chapterId) || chapterId < 1 || chapterId > 25) {
    continue;
  }

  const start = (match.index ?? 0) + match[0].length;
  const end = i + 1 < chapterMatches.length ? (chapterMatches[i + 1].index ?? raw.length) : raw.length;
  const chunk = raw.slice(start, end);

  const context = [];
  const points = [];
  const blocks = chunk.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && line !== '---');

    if (!lines.length) {
      continue;
    }

    const first = lines[0];
    const pointMatch = first.match(/^([0-9０-９]+)\s*[．.]\s*(.+)$/);

    if (!pointMatch) {
      context.push(...lines.map(cleanText));
      continue;
    }

    const { japanese, burmese } = splitJpMm(pointMatch[2]);
    const point = {
      id: `updated-c${chapterId}-p${points.length + 1}`,
      pattern: japanese || cleanText(pointMatch[2]),
      meaning: burmese || japanese || cleanText(pointMatch[2]),
      examples: [],
    };
    const pointNotes = [];

    let inExamples = false;

    for (const line of lines.slice(1)) {
      if (line.startsWith('例')) {
        inExamples = true;
        point.examples.push(...parseExampleSegments(line));
        continue;
      }

      if (inExamples && /^[0-9０-９]+\s*[．.]\s*/.test(line)) {
        point.examples.push(...parseExampleSegments(line));
        continue;
      }

      inExamples = false;
      pointNotes.push(cleanText(line));
    }

    if (pointNotes.length) {
      point.meaning = [point.meaning, ...pointNotes].filter(Boolean).join('\n');
    }

    points.push(point);
  }

  chapters.push({
    chapterId,
    chapterTitle: `Chapter ${chapterId}`,
    context: context.filter(Boolean),
    points,
  });
}

chapters.sort((a, b) => a.chapterId - b.chapterId);

const out = `/* Auto-generated from pdf-text/n5/grammar/updated-grammar.txt by scripts/generate-n5-grammar-from-updated.mjs */\n\nexport const GENERATED_N5_GRAMMAR = ${JSON.stringify(chapters, null, 2)} as const;\n`;

fs.writeFileSync(outputPath, out, 'utf8');
console.log(`Generated ${chapters.length} chapters to ${outputPath}`);
console.log(chapters.slice(0, 5).map((c) => `${c.chapterId}:${c.points.length}p/${c.context.length}ctx`).join(', '));
