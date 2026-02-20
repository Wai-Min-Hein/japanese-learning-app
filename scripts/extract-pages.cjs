const fs = require('node:fs/promises');
const { PDFParse } = require('pdf-parse');

async function main() {
  const [pdfPath, pageStartRaw, pageEndRaw, outputPath] = process.argv.slice(2);
  if (!pdfPath || !pageStartRaw || !pageEndRaw || !outputPath) {
    throw new Error('Usage: node scripts/extract-pages.cjs <pdfPath> <startPage> <endPage> <outputPath>');
  }

  const start = Number(pageStartRaw);
  const end = Number(pageEndRaw);
  const partial = [];
  for (let i = start; i <= end; i += 1) partial.push(i);

  const data = await fs.readFile(pdfPath);
  const parser = new PDFParse({ data });
  const result = await parser.getText({ partial });
  await parser.destroy();

  await fs.writeFile(outputPath, result.text || '', 'utf8');
  console.log(`Wrote ${outputPath} (${(result.text || '').length} chars)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
