# Understand Quran — Future Updates Without Rebuilding the Website

This DeTLeng project activates a Para whenever its expected DOCX exists in the corresponding folder. The original Flashcard engine remains untouched.

## English DOCX files
Copy `Para-01-en.docx` through `Para-30-en.docx` into `data/english/`. You can upload one Para at a time. Click English, then that Para; it will work immediately when deployed. A Para whose file is missing shows Coming Soon.

## Urdu + English DOCX files
Copy `Para-01-ur-en.docx` through `Para-30-ur-en.docx` into `data/urdu-english/`. The same per-Para activation applies.

## Existing Urdu DOCX files
Keep `Para-01-ur.docx` through `Para-30-ur.docx` in `data/urdu/`; these are included and must not be removed.

Each DOCX needs the original 3-column format: serial numeric ID, question, answer; include at least three distinct answers for MCQs. Do not rename the folders.

## YouTube guide video
1. Upload the actual mouse-click tutorial video to YouTube.
2. Open `config/tutorial.js` and set `window.DETLENG_TUTORIAL_URL = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID';`
3. Save and push. `how-to-use.html` will display the embedded video and YouTube link automatically.

**PowerShell example** (run inside your own existing Git clone, never delete `.git`):

```powershell
cd D:\DETLENG2\understandquran-detleng
# After adding your DOCX files or changing config/tutorial.js:
git add .
git commit -m "Add Quran learning resources"
git push origin main
```

After GitHub Pages finishes deploying, refresh the website (Ctrl+Shift+R if needed). No new ZIP or HTML modifications are needed.

## QA
Check Urdu Para 01, an English Para whose file is missing, an English Para after uploading its DOCX, group selection, MCQ, Classic, test, back-to-groups, Restart Cancel, dark mode, How to Use, and Dictionary PDF links.

## Resource acknowledgements
Understand Al Quran Academy: https://understandquran.com/
Original Quran Dictionaries: https://understandquran.com/quran-dictionaries/quran-dictionaries-english/
This site is an independent DeTLeng educational project, not the Academy's official site. Check redistribution permission for third-party PDF and translations.


## November 2026 reading and motivation UI update
- Motivation replaces the public dedication section; English and Urdu text are part of `index.html`.
- The top navigation links to `#motivation` instead of `#dedication`.
- The Video Guide has its player placeholder above the interactive six-step guide. To enable the video, edit only `config/tutorial.js` with the published YouTube URL and push.
- The MCQ Arabic question is visually separated from its reference by `uq-reading.js`; the original data and `app.js` are unchanged.
- Reading size persists in browser localStorage, while only question/answer presentation is adjusted.
- English and bilingual learning collections remain automatic per-Para using their existing directories and filenames.
