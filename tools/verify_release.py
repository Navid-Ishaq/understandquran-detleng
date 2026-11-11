"""Static release checks for Understand Quran. Run from repo root: python tools/verify_release.py"""
from pathlib import Path
import sys,zipfile
root=Path(__file__).resolve().parent.parent
needed=['index.html','how-to-use.html','how-to-use.js','uq-experience.js','uq-experience.css',
        'quran-paras.js','app.js','CNAME','FUTURE-UPDATES.md','config/tutorial.js',
        'downloads/Quran-Dictionary-Urdu-39-Pages.pdf','downloads/Quran-Dictionary-Urdu-50-Pages.pdf']
missing=[x for x in needed if not (root/x).is_file()]
for p in range(1,31):
    f=root/f'data/urdu/Para-{p:02}-ur.docx'
    if not f.is_file() or not zipfile.is_zipfile(f):missing.append(str(f.relative_to(root)))
for lang in ['english','urdu-english']:
    if not (root/'data'/lang).is_dir():missing.append('data/'+lang)
html=(root/'index.html').read_text(encoding='utf-8')
for key in ['id="dedication"','id="practiceScreen"','id="groupSelectionScreen"','id="restartBtn"','how-to-use.html']:
    if key not in html:missing.append('index.html missing '+key)
if 'Irfan-ul-Quran' in html:missing.append('Incorrect project branding')
print('Urdu DOCX files:',len(list((root/'data/urdu').glob('Para-??-ur.docx'))))
print('Future English DOCX files:',len(list((root/'data/english').glob('*.docx'))))
print('Future bilingual DOCX files:',len(list((root/'data/urdu-english').glob('*.docx'))))
print('Release files:', 'OK' if not missing else 'ISSUES: '+', '.join(missing))
sys.exit(bool(missing))
