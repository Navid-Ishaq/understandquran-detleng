(() => {
  'use strict';
  const steps=[
    ['🌐','Choose your translation language','Urdu is available now. English and Urdu + English are future-ready: their Paras become available as soon as the corresponding DOCX files are uploaded.'],
    ['📖','Select one of the 30 Paras','Choose a Para card. If its file is available, the website loads its Word document automatically; otherwise a clear Coming Soon message appears.'],
    ['🔢','Select a question group','Choose All questions, a group of 10, or manually set a question range. Press Generate Flashcards to open the full-width practice screen.'],
    ['🧠','Choose MCQ or Classic Flashcard','In MCQ Learning Mode, pick one of three answers and get instant feedback. Test Mode shows results after completion. In Classic mode, think of the answer and flip the card.'],
    ['↔','Navigate and return safely','Use Previous and Next, or select a question number from Quiz Navigation. Back to Question Groups lets you choose another set. Restart is separated from navigation and always asks for confirmation.'],
    ['✓','Review results and download','Review your responses and choose another group. Download your study deck as interactive HTML, printable PDF, CSV, Excel, or offline ZIP when the deck is generated.']
  ];
  const $=id=>document.getElementById(id);
  let selected=0;
  function render(i){
    selected=Math.max(0,Math.min(i,steps.length-1));
    const [icon,head,text]=steps[selected];
    $('tutorialIcon').textContent=icon;$('tutorialHeading').textContent=head;
    $('tutorialText').textContent=text;$('tutorialCount').textContent=`STEP ${selected+1} OF ${steps.length}`;
    document.querySelectorAll('[data-step]').forEach(b=>{
      const active=Number(b.dataset.step)===selected;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;
    });
    $('prevGuide').disabled=selected===0;
    $('nextGuide').textContent=selected===steps.length-1?'Back to First Step ↺':'Next Step →';
  }
  document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>render(Number(b.dataset.step))));
  $('prevGuide').addEventListener('click',()=>render(selected-1));
  $('nextGuide').addEventListener('click',()=>render(selected===steps.length-1?0:selected+1));
  document.querySelector('.tutorial-steps').addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();render(selected+1);document.querySelector(`[data-step="${selected}"]`).focus();}
    if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();render(selected-1);document.querySelector(`[data-step="${selected}"]`).focus();}
  });
  $('guideThemeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');$('guideThemeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾';});
  function getYoutubeId(value){
    if(!value||typeof value!=='string')return null;
    try{
      const u=new URL(value.trim());
      let id=null;
      if(u.hostname==='youtu.be'||u.hostname==='www.youtu.be')id=u.pathname.slice(1).split('/')[0];
      else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname)){
        id=u.pathname==='/watch'?u.searchParams.get('v'):(/^\/(embed|shorts)\//.test(u.pathname)?u.pathname.split('/')[2]:null);
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(id||'')?id:null;
    }catch{return null;}
  }
  const url=window.DETLENG_TUTORIAL_URL||'';
  const id=getYoutubeId(url);
  if(id){
    const frame=document.createElement('iframe');frame.className='video-frame';
    frame.title='Understand Quran step-by-step tutorial';frame.loading='lazy';
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.src=`https://www.youtube-nocookie.com/embed/${id}`;
    $('videoContainer').replaceWith(frame);
    $('videoStatus').textContent='Watch a real demonstration of the complete learning experience.';
    $('watchOnYoutube').href=`https://www.youtube.com/watch?v=${id}`;$('watchOnYoutube').hidden=false;
  }
  render(0);
})();
