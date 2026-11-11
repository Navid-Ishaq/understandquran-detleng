/* Understand Quran: DOCX routing only. Original DeTLeng flashcard engine in app.js is unchanged. */
(() => {
  'use strict';
  const grid = document.getElementById('paraGrid');
  const notice = document.getElementById('paraLanguageNotice');
  const dialog = document.getElementById('comingSoonDialog');
  const menu = document.getElementById('dictionaryToggle');
  const links = document.getElementById('dictionaryLinks');
  const collections = {
    urdu: {label:'Urdu',code:'ur',dir:'urdu'},
    english: {label:'English',code:'en',dir:'english'},
    'urdu-english': {label:'Urdu + English',code:'ur-en',dir:'urdu-english'}
  };
  let currentLanguage='urdu', currentRequest=0;
  let currentPara=null;
  function filenameFor(n,language){
    const c=collections[language];
    return `Para-${String(n).padStart(2,'0')}-${c.code}.docx`;
  }
  function urlFor(n,language){return `data/${collections[language].dir}/${filenameFor(n,language)}`;}
  function updateSelected(n,language){
    currentPara=n;
    document.getElementById('selectedParaLabel').textContent=`Para ${String(n).padStart(2,'0')} — ${collections[language].label}`;
    grid.querySelectorAll('[data-para]').forEach(button=>{
      button.classList.toggle('selected',Number(button.dataset.para)===n && currentLanguage===language);
    });
    document.getElementById('practiceParaSummary').textContent=`Para ${String(n).padStart(2,'0')} · ${collections[language].label}`;
  }
  function render(){
    grid.replaceChildren();
    notice.textContent=`${collections[currentLanguage].label} vocabulary · Choose a Para. Available DOCX files open automatically.`;
    for(let n=1;n<=30;n++){
      const button=document.createElement('button');
      button.type='button';button.className='para-card';button.dataset.para=n;
      button.setAttribute('aria-label',`Para ${n}, ${collections[currentLanguage].label}`);
      button.innerHTML=`<span class="para-number">${String(n).padStart(2,'0')}</span><span class="para-word" lang="ur" dir="rtl">پارہ</span><span class="para-state">Select to learn</span>`;
      button.addEventListener('click',()=>pick(n,currentLanguage));grid.append(button);
    }
    if(currentPara!==null)grid.querySelector(`[data-para="${currentPara}"]`)?.classList.add('selected');
  }
  function showComingSoon(n,language){
    document.getElementById('comingSoonDetail').textContent=`Para ${String(n).padStart(2,'0')} · ${collections[language].label} vocabulary will be available when its Word document is added. Coming Soon, Insha Allah!`;
    if(!dialog.open)dialog.showModal();
  }
  async function pick(n,language){
    const request=++currentRequest;
    const filename=filenameFor(n,language);
    const url=urlFor(n,language);
    notice.textContent=`Loading Para ${String(n).padStart(2,'0')} · ${collections[language].label}…`;
    try{
      const response=await fetch(url,{cache:'no-store'});
      if(request!==currentRequest)return;
      if(response.status===404){notice.textContent=`${collections[language].label} · Para ${String(n).padStart(2,'0')} is being prepared, Insha Allah.`;showComingSoon(n,language);return;}
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const blob=await response.blob();
      if(!blob.size)throw new Error('The Word document is empty.');
      const signature=new Uint8Array(await blob.slice(0,4).arrayBuffer());
      if(signature[0]!==80 || signature[1]!==75)throw new Error('The file is not a valid DOCX archive.');
      if(request!==currentRequest)return;
      const file=new File([blob],filename,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      await handleFile(file);
      if(request!==currentRequest)return;
      const summary=document.getElementById('fileSummary');
      if(summary.classList.contains('hidden') || state.name!==filename || !state.rows.length)throw new Error('The DOCX question bank could not be read.');
      updateSelected(n,language);
      notice.textContent=`Para ${String(n).padStart(2,'0')} · ${collections[language].label} ready. Choose a question group.`;
      if(typeof window.UQExperience!=='undefined')window.UQExperience.showStage('groups');
      else document.getElementById('workspace').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){
      if(request!==currentRequest)return;
      notice.textContent=`Unable to load ${filename}: ${err.message}`;
      console.error('Understand Quran DOCX load:',err);
    }
  }
  document.querySelectorAll('[data-lang]').forEach(tab=>tab.addEventListener('click',()=>{
    ++currentRequest;
    currentLanguage=tab.dataset.lang;
    currentPara=null;
    document.querySelectorAll('[data-lang]').forEach(t=>{
      const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));
    });
    render();
  }));
  document.getElementById('changeParaBtn').addEventListener('click',()=>{
    if(window.UQExperience)window.UQExperience.showStage('paras');
    else document.getElementById('paras').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('closeComingSoon').addEventListener('click',()=>dialog.close());
  document.getElementById('okayComingSoon').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  menu.addEventListener('click',()=>{
    const open=links.hidden;links.hidden=!open;menu.setAttribute('aria-expanded',String(open));
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest('.dictionary-menu')){links.hidden=true;menu.setAttribute('aria-expanded','false');}
  });
  render();
})();
