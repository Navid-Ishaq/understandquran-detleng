/* Interface-only stage routing: original app.js stays byte-for-byte unchanged. */
(() => {
  'use strict';
  const byId=id=>document.getElementById(id);
  let stage='paras';
  function showStage(next){
    if(!['paras','groups','practice'].includes(next))return;
    if(next==='groups' && stage==='practice' && typeof retainAttempt==='function')retainAttempt();
    stage=next;
    const workspace=byId('workspace');
    const para=byId('paras');
    byId('groupSelectionScreen').hidden=next!=='groups';
    byId('practiceScreen').hidden=next!=='practice';
    workspace.hidden=next==='paras';
    para.hidden=next!=='paras';
    if(next==='paras')para.hidden=false;
    const target=next==='paras'?para:next==='groups'?byId('groupSelectionScreen'):byId('practiceScreen');
    // Reveal the destination before scrolling to avoid previous two-column scroll targets.
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  window.UQExperience={showStage,getStage:()=>stage};
  document.addEventListener('DOMContentLoaded',()=>{
    showStage('paras');
    const generate=byId('generateBtn');
    generate.addEventListener('click',()=>{
      // Let the original app.js generate or resume the deck first.
      setTimeout(()=>{
        if(state.deck.length && state.activeAttempt && !generate.disabled &&
           !byId('status').classList.contains('error'))showStage('practice');
      },0);
    });
    byId('backToGroups').addEventListener('click',()=>showStage('groups'));
    // Switching MCQ/Test/Classic in the underlying engine starts a new attempt.
    // Guard those controls after answers have been recorded.
    ['learningModeBtn','testModeBtn','mcqModeBtn','classicModeBtn'].forEach(id=>{
      byId(id).addEventListener('click',event=>{
        const next=id==='learningModeBtn'?'learning':id==='testModeBtn'?'test':id==='mcqModeBtn'?'mcq':'classic';
        const active=(next==='learning'||next==='test')?state.sessionMode===next:state.studyMode===next;
        if(active || !state.responses.size)return;
        if(window.confirm('Changing this practice mode may start a new attempt and reset your current answers. Continue?'))return;
        event.preventDefault();event.stopImmediatePropagation();
      },true);
    });
    const restart=byId('restartBtn');
    // Capture-phase guard prevents accidental clicks from reaching app.js's reset handler.
    restart.addEventListener('click',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      if(!window.confirm('Restart this question set? All answers and progress for this attempt will be cleared.'))return;
      if(typeof resetAttempt==='function'){resetAttempt();render();}
    },true);
    // Show the settings stage when a user explicitly selects a new question group.
    // The original engine retains attempts when a new group is generated.
    byId('changeParaBtn').addEventListener('click',()=>showStage('paras'));
    document.querySelectorAll('a[href="#paras"]').forEach(a=>a.addEventListener('click',()=>showStage('paras')));
    window.addEventListener('hashchange',()=>{
      if(location.hash==='#paras')showStage('paras');
      if(location.hash==='#workspace' && byId('selectedParaLabel').textContent!=='No Para selected yet')showStage('groups');
    });
  });
})();
