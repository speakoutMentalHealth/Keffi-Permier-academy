
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

/* =========================================================
   ELITE V6 — IMMERSIVE INTERACTIONS
   ========================================================= */
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  // Announcement carousel: automatic, swipe-like vertical transitions, manual arrows, pause.
  const ann=$('.announcement'), annSlides=$$('.announcement-slide'), prev=$('[data-ann-prev]'), next=$('[data-ann-next]'), pause=$('[data-ann-pause]');
  if(ann && annSlides.length){
    let ai=0, annTimer=null, paused=false;
    const progress=()=>$('.announcement-progress span');
    const resetProgress=()=>{const p=progress(); if(!p)return; p.style.animation='none'; void p.offsetWidth; p.style.animation='announcementProgress 5.6s linear infinite'; if(paused)p.style.animationPlayState='paused'};
    const show=i=>{
      const old=annSlides[ai]; old.classList.remove('active'); old.classList.add('leaving');
      ai=(i+annSlides.length)%annSlides.length;
      const fresh=annSlides[ai]; fresh.classList.remove('leaving');
      requestAnimationFrame(()=>fresh.classList.add('active'));
      setTimeout(()=>old.classList.remove('leaving'),550); resetProgress();
    };
    const start=()=>{clearInterval(annTimer); if(!paused && !matchMedia('(prefers-reduced-motion: reduce)').matches)annTimer=setInterval(()=>show(ai+1),5600)};
    next?.addEventListener('click',()=>{show(ai+1);start()});
    prev?.addEventListener('click',()=>{show(ai-1);start()});
    pause?.addEventListener('click',()=>{paused=!paused;ann.classList.toggle('paused',paused);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Resume announcements':'Pause announcements');if(paused)clearInterval(annTimer);else start()});
    ann.addEventListener('mouseenter',()=>{if(!paused)clearInterval(annTimer)});ann.addEventListener('mouseleave',()=>start());
    start();
  }

  // Adventure selector: changes the left console instantly on tap/click.
  const adventureData={
    scientist:{icon:'🔬',title:'Future Scientist',text:'Follow curiosity through science and STEM: ask better questions, test ideas, work with others and learn from what does not work.',progress:'42%'},
    creator:{icon:'🎭',title:'Creative Voice',text:'Build confidence through literacy, culture and drama: read deeply, communicate clearly, perform boldly and tell meaningful stories.',progress:'58%'},
    digital:{icon:'💻',title:'Digital Builder',text:'Use ICT as a creative tool: understand technology, solve practical problems and practise responsible digital citizenship.',progress:'74%'},
    leader:{icon:'🌱',title:'Purposeful Leader',text:'Grow through service, teamwork and reflection: practise responsibility, care for others and learn how to lead with character.',progress:'90%'}
  };
  const display=$('#adventureDisplay'), bar=$('#adventureProgress');
  $$('.adventure-card').forEach(card=>card.addEventListener('click',()=>{
    $$('.adventure-card').forEach(c=>c.classList.remove('active'));card.classList.add('active');
    const d=adventureData[card.dataset.adventureKey]; if(!d||!display)return;
    display.innerHTML=`<div class="adventure-icon">${d.icon}</div><h3>${d.title}</h3><p>${d.text}</p><div class="adventure-progress"><span id="adventureProgress" style="width:${d.progress}"></span></div>`;
    burst(card);
  }));

  // Small tactile sparkle on selected high-value controls. Decorative only; never persistent or randomized rewards.
  function burst(origin){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const r=origin.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    [[-34,-28],[32,-24],[-30,26],[35,28],[0,-38]].forEach(([dx,dy],i)=>{
      const s=document.createElement('i');s.className='tap-spark';s.style.left=(cx-5)+'px';s.style.top=(cy-5)+'px';s.style.setProperty('--dx',dx+'px');s.style.setProperty('--dy',dy+'px');s.style.background=i%2?'#6b49bf':'#d8b766';document.body.appendChild(s);setTimeout(()=>s.remove(),650)
    });
  }
  $$('.btn-primary,.btn-gold,.tab-btn,.orbit-node').forEach(el=>el.addEventListener('click',()=>burst(el)));

  // Search from the mobile menu should close the menu first so the search modal is visible.
  $$('.mobile-menu [data-search]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.mobile-menu')?.classList.remove('open');document.body.classList.remove('no-scroll')}));
})();


/* V7 MOBILE APP EXPERIENCE */
(() => {
  const isPhone=()=>window.matchMedia('(max-width: 767px)').matches;

  // Active dock item
  const file=(location.pathname.split('/').pop()||'index.html').replace('.html','');
  document.querySelectorAll('[data-dock]').forEach(a=>{
    a.classList.toggle('active',a.dataset.dock===file);
  });

  // Close app drawer when a navigation item is selected
  document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
    document.querySelector('.mobile-menu')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }));

  // Swipe hero manually on phones
  const hero=document.querySelector('.hero');
  const dots=[...document.querySelectorAll('.hero-dot')];
  if(hero && dots.length){
    let sx=0,sy=0;
    hero.addEventListener('touchstart',e=>{
      const t=e.changedTouches[0]; sx=t.clientX; sy=t.clientY;
    },{passive:true});
    hero.addEventListener('touchend',e=>{
      if(!isPhone())return;
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)){
        const active=dots.findIndex(d=>d.classList.contains('active'));
        const next=dx<0?Math.min(dots.length-1,active+1):Math.max(0,active-1);
        dots[next]?.click();
      }
    },{passive:true});
  }

  // horizontal swipe hint only once per load
  document.querySelectorAll('.values-grid,.page-grid').forEach(scroller=>{
    if(!isPhone())return;
    scroller.setAttribute('aria-label',(scroller.getAttribute('aria-label')||'Swipe horizontally to explore'));
  });

  // Make mobile cards tappable when they contain one link
  if(isPhone()){
    document.querySelectorAll('.card,.value-card,.event-card').forEach(card=>{
      const links=card.querySelectorAll('a[href]');
      if(links.length===1){
        card.style.cursor='pointer';
        card.addEventListener('click',e=>{
          if(e.target.closest('a,button,input,select,textarea'))return;
          links[0].click();
        });
      }
    });
  }

  // App-like page fade, reduced-motion safe
  if(isPhone() && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.body.animate([{opacity:.75},{opacity:1}],{duration:220,easing:'ease-out'});
  }
})();


/* =========================================================
   V8 SIGNATURE INTERACTIONS
   ========================================================= */
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  /* scroll-aware header */
  const header=$('.site-header');
  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>60);
  onScroll(); addEventListener('scroll',onScroll,{passive:true});

  /* Premier Compass */
  const compassStory=$('#compassStory');
  const compassData={
    knowledge:{
      label:'Knowledge',
      title:'Curiosity becomes capability.',
      text:'Academic foundations, literacy, numeracy, science, ICT and STEM help students build the confidence to understand, question and solve.',
      link:'academics.html'
    },
    character:{
      label:'Character',
      title:'Values become daily habits.',
      text:'Integrity, responsibility, respect, compassion and faith-aware character are reinforced through school culture, relationships and leadership.',
      link:'about.html'
    },
    wellbeing:{
      label:'Wellbeing',
      title:'Belonging strengthens learning.',
      text:'The Premier Wellness framework connects mental health, clubs, trusted adults, parents, teachers and digital resources around the whole child.',
      link:'wellness.html'
    },
    leadership:{
      label:'Leadership',
      title:'Student voice becomes contribution.',
      text:'Mentoring, service, teamwork and responsibility create repeated opportunities for students to practise confidence and purposeful leadership.',
      link:'wellness.html'
    }
  };
  $$('.compass-node').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.compass-node').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const d=compassData[btn.dataset.compass];
    if(compassStory&&d){
      compassStory.innerHTML=`<div class="kicker" style="color:#efd58c">${d.label}</div><h3>${d.title}</h3><p>${d.text}</p><a class="btn btn-gold" href="${d.link}">Explore ${d.label} →</a>`;
    }
  }));

  /* A day at KPA */
  const dayStage=$('#dayStage'),dayImage=$('#dayImage'),dayTime=$('#dayClock'),dayTitle=$('#dayTitle'),dayText=$('#dayText'),dayProgress=$('#dayProgress');
  const dayData={
    arrival:['07:30','Arrival & Welcome','Students enter a calm, values-led environment and begin the day with connection, preparation and purpose.','assets/images/muslim-students-girls.jpg',20],
    learn:['09:15','Deep Learning','Core academics, science, literacy and problem-solving build strong knowledge foundations.','assets/images/african-students-boys.jpg',40],
    create:['12:30','Create & Explore','ICT, STEM, literacy, culture and drama give students practical ways to discover strengths.','assets/images/muslim-students-girls.jpg',60],
    belong:['14:00','Clubs & Belonging','Premier Wellness Club activities create structured opportunities for connection, mentoring and positive participation.','assets/images/african-students-boys.jpg',80],
    reflect:['15:30','Reflect & Grow','Students leave with more than completed lessons: they carry new knowledge, stronger confidence and a clearer sense of responsibility.','assets/images/muslim-students-girls.jpg',100]
  };
  $$('[data-day]').forEach(btn=>btn.addEventListener('click',()=>{
    $$('[data-day]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const d=dayData[btn.dataset.day];if(!d)return;
    if(dayImage){dayImage.style.opacity='.35';setTimeout(()=>{dayImage.src=d[3];dayImage.style.opacity='1'},130)}
    if(dayTime)dayTime.textContent=d[0];if(dayTitle)dayTitle.textContent=d[1];if(dayText)dayText.textContent=d[2];
    if(dayProgress)dayProgress.style.width=d[4]+'%';
  }));

  /* Audience path selector */
  $$('[data-audience]').forEach(btn=>btn.addEventListener('click',()=>{
    const section=btn.closest('.audience-section');if(!section)return;
    $$('[data-audience]',section).forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    $$('[data-audience-panel]',section).forEach(p=>p.classList.toggle('active',p.dataset.audiencePanel===btn.dataset.audience));
  }));

  /* KPA concierge */
  const launcher=$('.kpa-concierge-launcher'),panel=$('.kpa-concierge'),close=$('.concierge-close'),answer=$('.concierge-answer');
  launcher?.addEventListener('click',()=>panel?.classList.toggle('open'));
  close?.addEventListener('click',()=>panel?.classList.remove('open'));
  const answers={
    admissions:['Admissions','Start with the Admissions page to understand the journey, submit an enquiry and arrange a visit.','admissions.html'],
    portal:['Portal access','Students, parents, staff and administrators continue into the secure SpeakOut Portal. New users link to KPA using the School’s unique code.','portal.html'],
    wellness:['Premier Wellness Club','The Wellness Club is the umbrella framework for student mental health, leadership and existing clubs including ICT, STEM, Literacy, Culture & Drama and Muslim Students Club.','wellness.html'],
    calendar:['School calendar','Use the School Calendar for important dates, programmes, workshops and events.','calendar.html'],
    contact:['Contact KPA','Use the Contact page for WhatsApp, telephone, email, enquiries and map information once official school details are added.','contact.html']
  };
  $$('.concierge-chip').forEach(chip=>chip.addEventListener('click',()=>{
    const d=answers[chip.dataset.ask];if(answer&&d){
      answer.innerHTML=`<strong>${d[0]}</strong><p>${d[1]}</p><a href="${d[2]}">Go there →</a>`;
      answer.classList.add('show');
    }
  }));

  /* Count-up facts, once */
  const counters=$$('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target,end=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';
      const start=performance.now(),duration=900;
      const tick=now=>{
        const p=Math.min(1,(now-start)/duration);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.round(end*eased)+suffix;
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);io.unobserve(el);
    }),{threshold:.5});
    counters.forEach(el=>io.observe(el));
  }

  /* Subtle pointer tilt, desktop only */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    $$('[data-tilt]').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(800px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }
})();


/* FINAL V9 HARDENING */
(() => {
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];

  // Ensure one mobile drawer state only
  const drawer=$('.mobile-menu');
  $$('[data-menu]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const open=drawer?.classList.contains('open');
      setTimeout(()=>{
        document.body.classList.toggle('no-scroll',!!drawer?.classList.contains('open'));
      },0);
    });
  });

  // Close drawer on Escape
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      drawer?.classList.remove('open');
      document.body.classList.remove('no-scroll');
      $('.search-modal')?.classList.remove('open');
      $('.kpa-concierge')?.classList.remove('open');
    }
  });

  // Prevent fixed dock from covering anchors on phones
  if(matchMedia('(max-width:767px)').matches){
    document.documentElement.style.scrollPaddingBottom='110px';
  }

  // Make ticker continuously move after page restore / bfcache
  addEventListener('pageshow',()=>{
    const track=$('.ticker-track');
    if(track && matchMedia('(max-width:767px)').matches){
      track.style.animationPlayState='running';
    }
  });
})();
