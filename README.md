# Understand Quran — Word by Word | DeTLeng

An independent Quran vocabulary practice interface using the existing DeTLeng Flashcard engine.

## Deploy
1. Extract the complete folder into `D:\DETLENG2\understandquran-detleng`.
2. Copy the remaining Urdu files `Para-02-ur.docx` through `Para-30-ur.docx` into `data/urdu/` exactly (do not modify the DOCX contents). Copy Para-01 too: the uploaded DOCX could not be embedded in this archive.
3. To verify locally run `python -m http.server 8000` from repository root and open `http://localhost:8000/`. Do **not** open `index.html` as a `file://` URL; browser fetch requires HTTP.
4. Push repository contents (not an enclosing extra folder) to the `main` branch of `Navid-Ishaq/understandquran-detleng`. GitHub Pages: main / (root). The `CNAME` is `understandquran.detleng.com`.
5. Confirm DNS and HTTPS on GitHub Pages.

## What is preserved
`app.js` and `vendor/jszip.min.js` are byte-for-byte identical to the provided working site. Original parsing, MCQ, Classic, Learning, Test, range groups, navigation, edit and exports remain untouched. `quran-paras.js` loads a pre-defined DOCX with `fetch()`, wraps it as a `File` and invokes the same existing `handleFile(file)` function. Hidden login, upload and sample DOM nodes are retained because the legacy engine expects them.

## Filenames
- Urdu: `data/urdu/Para-01-ur.docx` ... `Para-30-ur.docx`. Copy all 30 files (including Para-01) into this folder.
- Future English: `data/english/Para-01-en.docx` ... `Para-30-en.docx`.
- Future bilingual: `data/urdu-english/Para-01-ur-en.docx` ... `Para-30-ur-en.docx`.
- Only Urdu is enabled in the new selector. Future tabs display Coming Soon until implemented.

## Dictionaries
The PDF download paths are configured, but the PDFs could not be embedded in this ZIP. Copy both original PDFs into `downloads/` using exactly the filenames below. Current vocabulary reference: 50-page edition; earlier preserved reference: 39 pages. Please verify that public redistribution is permitted before publishing. The Academy is acknowledged; this project is independent of it.

## Testing
- After copying Para-01-ur.docx, test Para 01: click Urdu > Para 01 > confirm the original question extraction and range/group controls.
- Generate MCQ Learning, MCQ Test, Classic; review flip/navigation/results and all exports.
- Test missing Urdu Para 02 before copying it: user sees a clear message. Add it and retry.
- Test English / bilingual Para cards: Coming Soon dialog appears.
- Test dark mode, mobile menu, dictionary dropdown and all anchor links.
- Run `python tools/verify_files.py` to audit 30 Urdu file paths.

**Important:** Browser-level end-to-end testing requires a browser with access to the hosted files. The package is assembled and checked statically; please run the smoke-test checklist after uploading all 30 Word files.

## Required user file copies before publishing
- `data/urdu/Para-01-ur.docx` through `Para-30-ur.docx`
- `downloads/Quran-Dictionary-Urdu-50-Pages.pdf`
- `downloads/Quran-Dictionary-Urdu-39-Pages.pdf`
The documents were supplied in chat but could not be embedded by the archive build environment. They are deliberately not replaced with dummy files.
