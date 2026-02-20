const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFParse } = require('pdf-parse');

async function main() {
  const input = process.argv[2];
  const output = process.argv[3] || path.join(process.cwd(), 'scripts', 'minna-preview.txt');

  if (!input) {
    throw new Error('Usage: node scripts/extract-minna-pdf.cjs <pdf-path> [output-path]');
  }

  const dataBuffer = await fs.readFile(input);
  const parser = new PDFParse({ data: dataBuffer });
  const data = await parser.getText();
  await parser.destroy();
  const compact = data.text
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const preview = compact.slice(0, 12000);
  const header = `Source: ${input}\nPages: ${data.total}\nPreview length: ${preview.length}\n\n`;

  await fs.writeFile(output, header + preview, 'utf8');
  console.log(`Extracted preview to ${output}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
