# Minna no Nihongo PDF source

Source file used for lesson design:
`/Users/waiminhein/Documents/Japanese Learning/Books/Minna_no_Nihongo_I_Second_Edition_Translation_and_Grammar_Notes.pdf`

Extraction command:
`npm run extract:minna -- '<pdf-path>' '<optional-output-path>'`

Current result from the provided file:
- File is readable.
- `pdf-parse` detects 203 pages.
- Most pages appear to be image/scanned content, so text extraction returns mostly page markers.

If you want automatic lesson generation from this PDF, add OCR (for example OCRmyPDF or Tesseract) before parsing text.
