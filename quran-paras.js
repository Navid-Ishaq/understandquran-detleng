/* Para selector — the original app.js and its handleFile(file) are unchanged. */
(() => {
  'use strict';
  const grid=document.getElementById('paraGrid');
  const notice=document.getElementById('paraLanguageNotice');
  const dialog=document.getElementById('comingSoonDialog');
  const menu=document.getElementById('dictionaryToggle');
  const links=document.getElementById('dictionaryLinks');
  let currentLanguage='urdu';
  let currentRequest=0;
  const codes={urdu:'ur',english:'en','urdu-english':'ur-en'};
  const labels={urdu:'Urdu',english:'English','urdu-english':'Urdu + English'};
  const available={urdu:true,english:false,'urdu-english':false};
  function setSelected(n,language){
    document.getElementById('selectedParaLabel').textContent=`Para ${String(n).padStart(2,'0')} — ${labels[language]}`;
    document.querySelectorAll('[data-para]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.para)===n && currentLanguage===language));
  }
  function render(){
    grid.replaceChildren();
    notice.textContent=currentLanguage==='urdu'?'Urdu vocabulary · Choose a Para to load its Word document.':'This collection is being prepared. Select a Para to see the update.';
    for(let n=1;n<=30;n++){
      const button=document.createElement('button');
      button.type='button'; button.className='para-card';button.dataset.para=n;
      button.setAttribute('aria-label',`Para ${n}, ${labels[currentLanguage]}${available[currentLanguage]?'':' coming soon'}`);
      const number=String(n).padStart(2,'0');
      button.innerHTML=`<span class="para-number">${number}</span><span class="para-word">${currentLanguage==='urdu'?'پارہ':'Para'}</span><span class="para-state">${available[currentLanguage]?'Explore vocabulary':'Coming soon'}</span>`;
      button.addEventListener('click',()=>pick(n,currentLanguage)); grid.append(button);
    }
  }
  function showComingSoon(n,language){
    document.getElementById('comingSoonDetail').textContent=`Para ${String(n).padStart(2,'0')} · ${labels[language]} vocabulary is being prepared with care. Insha Allah, it will be available in a future update.`;
    dialog.showModal();
  }
  async function pick(n,language){
    if(!available[language]){showComingSoon(n,language);return;}
    const request=++currentRequest;
    const filename=`Para-${String(n).padStart(2,'0')}-${codes[language]}.docx`;
    const url=`data/urdu/${filename}`;
    notice.textContent=`Loading Para ${String(n).padStart(2,'0')} vocabulary…`;
    try{
      const response=await fetch(url,{cache:'no-cache'});
      if(!response.ok)throw new Error(`The document ${filename} is not available yet (HTTP ${response.status}).`);
      const blob=await response.blob();
      if(request!==currentRequest)return;
      const file=new File([blob],filename,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      // Reuse the original, tested DOCX input path verbatim.
      await handleFile(file);
      if(request!==currentRequest)return;
      const summary=document.getElementById('fileSummary');
      if(summary.classList.contains('hidden'))throw new Error(`The existing reader could not load ${filename}.`);
      setSelected(n,language);
      notice.textContent=`Para ${String(n).padStart(2,'0')} · ${labels[language]} ready. Choose your question range or group below.`;
      document.getElementById('workspace').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){
      if(request!==currentRequest)return;
      notice.textContent=`Unable to load Para ${String(n).padStart(2,'0')}: ${err.message} Check that ${filename} is present in data/urdu/.`;
      console.error('Para load:',err);
    }
  }
  document.querySelectorAll('[data-lang]').forEach(tab=>tab.addEventListener('click',()=>{
    currentLanguage=tab.dataset.lang;
    document.querySelectorAll('[data-lang]').forEach(t=>{const isSelected=t===tab;t.classList.toggle('active',isSelected);t.setAttribute('aria-selected',String(isSelected));});
    render();
  }));
  document.getElementById('changeParaBtn').addEventListener('click',()=>document.getElementById('paras').scrollIntoView({behavior:'smooth'}));
  document.getElementById('closeComingSoon').addEventListener('click',()=>dialog.close());
  document.getElementById('okayComingSoon').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  menu.addEventListener('click',()=>{const open=links.hidden;links.hidden=!open;menu.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',e=>{if(!e.target.closest('.dictionary-menu')){links.hidden=true;menu.setAttribute('aria-expanded','false')}});
  render();
})();
