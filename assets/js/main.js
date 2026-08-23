
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
    $$('.reveal').forEach(el=>io.observe(el));
  } else $$('.reveal').forEach(el=>el.classList.add('in'));

  const mobile=$('.mobile-menu');
  $$('[data-menu]').forEach(b=>b.addEventListener('click',()=>{
    mobile?.classList.toggle('open');document.body.classList.toggle('no-scroll',mobile?.classList.contains('open'));
  }));

  const sm=$('.search-modal'),si=$('#siteSearch'),sr=$('#searchResults');
  const pages=[
    ['Home','index.html','welcome academics wellbeing admissions portal announcements'],
    ['Our School','about.html','history vision mission core values principal leadership management teachers'],
    ['Academics','academics.html','academics curriculum ict stem literacy subjects learning'],
    ['Admissions','admissions.html','admissions enquiry requirements apply prospectus'],
    ['Premier Wellness Club','wellness.html','wellness mental health leadership clubs parents teachers volunteers'],
    ['Leadership & Staff','leadership.html','leadership management team teachers staff'],
    ['Facilities','facilities.html','facilities classrooms laboratory ict library sports'],
    ['News','news.html','news announcements'],
    ['Events','events.html','events upcoming workshops activities'],
    ['Gallery','gallery.html','photos gallery campus students'],
    ['Achievements','achievements.html','achievements awards students spelling stem'],
    ['School Calendar','calendar.html','calendar dates term events'],
    ['Downloads','downloads.html','downloads documents prospectus forms'],
    ['FAQ','faq.html','questions admissions portal fees school'],
    ['Contact','contact.html','contact whatsapp call email map'],
    ['Portal Access','portal.html','student parent teacher resources courses mental health leadership portal']
  ];
  function doSearch(){
    if(!sr||!si)return;const q=si.value.trim().toLowerCase();sr.innerHTML='';
    if(!q){sr.innerHTML='<div class="muted">Start typing to search the KPA website.</div>';return}
    pages.filter(p=>(p[0]+' '+p[2]).toLowerCase().includes(q)).slice(0,10).forEach(p=>{
      const a=document.createElement('a');a.className='search-result';a.href=p[1];
      a.innerHTML=`<strong>${p[0]}</strong><span class="muted">${p[2].split(' ').slice(0,8).join(' ')}</span>`;sr.appendChild(a)
    });
    if(!sr.children.length)sr.innerHTML='<div class="muted">No matching page found.</div>'
  }
  $$('[data-search]').forEach(b=>b.addEventListener('click',()=>{sm?.classList.add('open');document.body.classList.add('no-scroll');setTimeout(()=>si?.focus(),80)}));
  $$('[data-search-close]').forEach(b=>b.addEventListener('click',()=>{sm?.classList.remove('open');document.body.classList.remove('no-scroll')}));
  si?.addEventListener('input',doSearch);

  const slides=$$('.hero-slide'),dots=$$('.hero-dot');
  if(slides.length){
    let idx=0,timer;
    const show=i=>{idx=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===idx));dots.forEach((d,n)=>d.classList.toggle('active',n===idx))}
    const restart=()=>{clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(idx+1),6500)}
    dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);restart()}));show(0);restart();
  }

  $$('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    const group=btn.closest('[data-tabs]');if(!group)return;
    $$('[data-tab]',group).forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    $$('[data-panel]',group).forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab));
  }));

  const info=$('#orbitInfo'),orbitData={
    ict:['ICT Club','Digital capability, creativity, responsible technology use and confidence in a changing world.'],
    stem:['STEM Club','Curiosity, experimentation, teamwork and practical problem-solving.'],
    literacy:['Spelling Bee & Literacy','Reading, language, communication and confident expression.'],
    culture:['Culture & Drama','Creativity, identity, performance, teamwork and self-expression.'],
    muslim:['Muslim Students Club','Positive faith-aware student engagement, character and community within school safeguarding standards.'],
    leadership:['Leadership Development','Mentorship, service, responsibility, confidence and student voice.']
  };
  $$('.orbit-node').forEach(n=>n.addEventListener('click',()=>{
    $$('.orbit-node').forEach(x=>x.classList.remove('active'));n.classList.add('active');
    const d=orbitData[n.dataset.orbit];if(info&&d)info.innerHTML=`<h3>${d[0]}</h3><p>${d[1]}</p>`;
  }));

  const quiz=$('#studentQuiz');
  if(quiz){
    const choices=$$('.choice',quiz),msg=$('#quizMsg'),stars=$$('.stars span');
    choices.forEach(c=>c.addEventListener('click',()=>{
      if(quiz.dataset.done)return;quiz.dataset.done='1';choices.forEach(x=>x.disabled=true);
      if(c.dataset.correct==='true'){c.classList.add('correct');msg.textContent='Correct — excellent thinking! You earned one Explorer Star.';stars[0]?.classList.add('earned')}
      else{c.classList.add('wrong');choices.find(x=>x.dataset.correct==='true')?.classList.add('correct');msg.textContent='Good try. The highlighted answer is correct — learning is the win.'}
    }));
    $('#quizReset')?.addEventListener('click',()=>{quiz.dataset.done='';choices.forEach(x=>{x.disabled=false;x.classList.remove('correct','wrong')});msg.textContent='';stars.forEach(s=>s.classList.remove('earned'))});
  }

  $$('.mood').forEach(m=>m.addEventListener('click',()=>{
    $$('.mood').forEach(x=>x.classList.remove('selected'));m.classList.add('selected');
    const out=$('#moodMessage');if(out)out.textContent='Thank you for checking in with yourself. If something feels difficult, speak with a trusted adult or use the approved school support pathway.';
  }));

  const quotes=$$('.quote-slide');
  if(quotes.length){
    let qi=0;const qshow=i=>{qi=(i+quotes.length)%quotes.length;quotes.forEach((q,n)=>q.classList.toggle('active',n===qi))};
    $('[data-quote-prev]')?.addEventListener('click',()=>qshow(qi-1));$('[data-quote-next]')?.addEventListener('click',()=>qshow(qi+1));qshow(0)
  }

  $$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    const group=btn.closest('[data-filter-group]');const scope=group?.parentElement;const key=btn.dataset.filter;
    $$('[data-filter]',group).forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    $$('[data-category]',scope).forEach(el=>el.style.display=(key==='all'||el.dataset.category===key)?'':'none')
  }));

  const lb=$('.lightbox'),lbImg=$('.lightbox img');
  $$('.gallery-item').forEach(g=>g.addEventListener('click',()=>{if(lb&&lbImg){lbImg.src=g.querySelector('img').src;lbImg.alt=g.querySelector('img').alt;lb.classList.add('open');document.body.classList.add('no-scroll')}}));
  $('[data-lightbox-close]')?.addEventListener('click',()=>{lb?.classList.remove('open');document.body.classList.remove('no-scroll')});

  $$('.acc-btn').forEach(b=>b.addEventListener('click',()=>{const item=b.closest('.acc-item');const open=item.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false')}));

  $$('[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const x=$('[data-form-msg]',f);if(x)x.textContent='This frontend form is ready to connect to your production form service/backend.'}));

  const am=$('.a11y-menu');$('.a11y-toggle')?.addEventListener('click',()=>am?.classList.toggle('open'));
  $('[data-text-size]')?.addEventListener('click',()=>document.body.classList.toggle('large-text'));
  $('[data-contrast]')?.addEventListener('click',()=>document.body.classList.toggle('high-contrast'));
  $('[data-motion]')?.addEventListener('click',()=>document.body.classList.toggle('reduce-motion'));
})();
