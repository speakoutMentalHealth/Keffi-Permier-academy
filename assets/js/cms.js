import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const cfg=window.KPA_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT')&&!cfg.anonKey.includes('YOUR_SUPABASE');
const sb=ready?createClient(cfg.url,cfg.anonKey):null;
const esc=(v='')=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const fmt=v=>v?new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';

async function loadAnnouncements(){
  if(!sb)return;
  const {data,error}=await sb.from('announcements').select('*').eq('is_active',true).is('deleted_at',null).order('priority',{ascending:false}).order('created_at',{ascending:false}).limit(4);
  if(error||!data?.length)return;
  const slides=[...document.querySelectorAll('.announcement-slide')];
  slides.forEach((s,i)=>s.style.display=i<data.length?'':'none');
  data.forEach((x,i)=>{const s=slides[i];if(!s)return;s.href=x.link_url||'#';const body=s.querySelector('span:nth-child(2)');if(body)body.innerHTML=`<strong>${esc(x.title||'KPA Update')}</strong> ${esc(x.message||'')}`});
  document.dispatchEvent(new CustomEvent('kpa:announcements-updated'));
}

async function loadNews(){
  const grid=document.querySelector('#newsGrid');if(!grid||!sb)return;
  const {data,error}=await sb.from('news_articles').select('*').eq('status','published').is('deleted_at',null).lte('published_at',new Date().toISOString()).order('featured',{ascending:false}).order('published_at',{ascending:false}).limit(30);
  if(error)return;
  if(!data?.length){grid.innerHTML='<article class="card"><span class="tag">News</span><h3>No published stories yet</h3><p>School news and announcements will appear here as they are published.</p></article>';return}
  grid.innerHTML=data.map(x=>`<article class="card cms-news-card" data-category="${esc((x.category||'school').toLowerCase())}">${x.image_url?`<img class="cms-news-image" src="${esc(x.image_url)}" alt="${esc(x.image_alt||x.title)}" loading="lazy">`:''}<div class="cms-news-body"><div class="tag">${esc(x.category||'School')}</div><h3>${esc(x.title)}</h3><p>${esc(x.excerpt||'')}</p><div class="cms-news-meta">${fmt(x.published_at)}</div><button class="btn btn-outline cms-read-more" type="button" data-id="${x.id}">Read story</button></div></article>`).join('');
  grid.querySelectorAll('.cms-read-more').forEach(btn=>btn.onclick=()=>{const x=data.find(n=>n.id===btn.dataset.id),m=document.querySelector('#newsModal');if(!x||!m)return;m.querySelector('[data-news-title]').textContent=x.title;m.querySelector('[data-news-content]').textContent=x.content||x.excerpt||'';m.classList.add('open');document.body.classList.add('no-scroll')});
}

async function loadSettings(){
  if(!sb)return;
  const {data}=await sb.from('website_settings').select('key,value');
  const map=Object.fromEntries((data||[]).map(x=>[x.key,x.value||'']));
  document.querySelectorAll('[data-setting]').forEach(el=>{const v=map[el.dataset.setting];if(v)el.textContent=v});
  document.querySelectorAll('[data-setting-href]').forEach(el=>{const key=el.dataset.settingHref,v=map[key];if(!v)return;if(key==='whatsapp'){const digits=v.replace(/\D/g,'');el.href=`https://wa.me/${digits}`}else if(key.includes('email'))el.href=`mailto:${v}`;else if(key.includes('phone'))el.href=`tel:${v.replace(/\s/g,'')}`});
}

function wireSpeakOut(){
  const signup=cfg.speakout?.signupUrl,login=cfg.speakout?.loginUrl;
  document.querySelectorAll('[data-speakout-signup]').forEach(a=>{if(signup&&!signup.includes('YOUR-SPEAKOUT')){a.href=signup;a.target='_self'}else{a.href='#';a.addEventListener('click',e=>{e.preventDefault();alert('The SpeakOut portal registration link is being configured.')})}});
  document.querySelectorAll('[data-speakout-login]').forEach(a=>{if(login&&!login.includes('YOUR-SPEAKOUT')){a.href=login;a.target='_self'}else{a.href='#';a.addEventListener('click',e=>{e.preventDefault();alert('The SpeakOut portal login link is being configured.')})}});
}

document.addEventListener('DOMContentLoaded',()=>{document.querySelector('[data-news-close]')?.addEventListener('click',()=>{document.querySelector('#newsModal')?.classList.remove('open');document.body.classList.remove('no-scroll')});wireSpeakOut();loadAnnouncements();loadNews();loadSettings()});
