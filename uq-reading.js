/* Presentation-only controls: original app.js is deliberately unchanged. */
(() => {
  'use strict';
  const get=id=>document.getElementById(id);
  function setSize(value){
    const size=Math.max(18,Math.min(40,Math.round(Number(value)/2)*2));
    document.documentElement.style.setProperty('--uq-reading-size',size+'px');
    get('readingSize').value=String(size);
    get('readingSizeValue').textContent=size+'px';
    try{localStorage.setItem('uq-reading-size',String(size));}catch(_){}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    let saved=24;
    try{saved=Number(localStorage.getItem('uq-reading-size'))||24;}catch(_){}
    setSize(saved);
    get('readingSize').addEventListener('input',e=>setSize(e.target.value));
    get('readingMinus').addEventListener('click',()=>setSize(Number(get('readingSize').value)-2));
    get('readingPlus').addEventListener('click',()=>setSize(Number(get('readingSize').value)+2));
    get('readingReset').addEventListener('click',()=>setSize(24));
    document.querySelectorAll('[data-motivation-lang]').forEach(button=>button.addEventListener('click',()=>{
      const urdu=button.dataset.motivationLang==='urdu';
      get('motivationUrdu').hidden=!urdu;get('motivationEnglish').hidden=urdu;
      document.querySelectorAll('[data-motivation-lang]').forEach(b=>{
        const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));
      });
    }));
    const container=get('cardContent');
    const shapeQuestion=()=>{
      const node=container.querySelector('.question-text');
      if(!node || node.querySelector('.uq-arabic-focus'))return;
      const plain=node.textContent.trim();
      // Keep the source reference for learning; simply give the Arabic its own prominent line.
      const match=plain.match(/^(P\d{1,2}-S\d{1,3}-\d{1,4})\s*[-–—]\s*(.+)$/u);
      if(!match){node.classList.add('uq-centered-question');return;}
      const word=document.createElement('span');word.className='uq-arabic-focus';word.lang='ar';word.dir='rtl';word.textContent=match[2];
      const reference=document.createElement('span');reference.className='uq-reference';reference.textContent=match[1];
      node.replaceChildren(word,reference);
      node.classList.add('uq-centered-question');
    };
    // The flashcard engine re-renders cardContent on each navigation. Observe its content, not its logic.
    const observer=new MutationObserver(()=>shapeQuestion());
    observer.observe(container,{childList:true});
    shapeQuestion();
  });
})();
