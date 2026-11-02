from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=[root/'data'/'urdu'/f'Para-{i:02d}-ur.docx' for i in range(1,31)]
for i,p in enumerate(files,1):
 print(f'Para {i:02d}: '+('OK' if p.is_file() and p.stat().st_size>0 else 'MISSING'))
print(f'Available: {sum(p.is_file() for p in files)}/30')
