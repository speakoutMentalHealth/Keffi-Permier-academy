
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const cfg=window.KPA_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes("YOUR_PROJECT")&&!cfg.anonKey.includes("YOUR_SUPABASE");
const supabase=ready?createClient(cfg.url,cfg.anonKey):null;
const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const fmt=v=>v?new Date(v).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"";

async function announcements(){
  if(!supabase)return;
  const {data,error}=await supabase.from("announcements").select("*").eq("is_active",true).order("priority",{ascending:false}).order("created_at",{ascending:false}).limit(4);
  if(error||!data?.length)return;
  const slides=[...document.querySelectorAll(".announcement-slide")];
  data.forEach((x,i)=>{
    const s=slides[i];if(!s)return;
    s.href=x.link_url||"#";
    const body=s.querySelector("span:nth-child(2)");
    if(body)body.innerHTML=`<strong>${esc(x.title||"KPA Update")}</strong> ${esc(x.message||"")}`;
    s.style.display="";
  });
  for(let i=data.length;i<slides.length;i++)slides[i].style.display="none";
}

async function news(){
  const grid=document.querySelector("#newsGrid");
  if(!grid||!supabase)return;
  const {data,error}=await supabase.from("news_articles").select("*").eq("status","published").order("featured",{ascending:false}).order("published_at",{ascending:false}).limit(24);
  if(error||!data?.length)return;
  grid.innerHTML=data.map(x=>`
    <article class="card cms-news-card" data-category="${esc((x.category||"school").toLowerCase())}">
      ${x.image_url?`<img class="cms-news-image" src="${esc(x.image_url)}" alt="">`:""}
      <div class="cms-news-body">
        <div class="tag">${esc(x.category||"School")}</div>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.excerpt||"")}</p>
        <div class="cms-news-meta">${fmt(x.published_at)}</div>
        <button type="button" class="btn btn-outline cms-read-more" data-title="${esc(x.title)}" data-content="${encodeURIComponent(x.content||x.excerpt||"")}">Read story</button>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".cms-read-more").forEach(btn=>btn.onclick=()=>{
    const m=document.querySelector("#newsModal");if(!m)return;
    m.querySelector("[data-news-title]").textContent=btn.dataset.title||"";
    m.querySelector("[data-news-content]").textContent=decodeURIComponent(btn.dataset.content||"");
    m.classList.add("open");document.body.classList.add("no-scroll");
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelector("[data-news-close]")?.addEventListener("click",()=>{document.querySelector("#newsModal")?.classList.remove("open");document.body.classList.remove("no-scroll")});
  const signup=cfg.speakout?.signupUrl,login=cfg.speakout?.loginUrl;
  if(signup&&!signup.includes("YOUR-SPEAKOUT"))document.querySelectorAll("[data-speakout-signup]").forEach(a=>a.href=signup);
  if(login&&!login.includes("YOUR-SPEAKOUT"))document.querySelectorAll("[data-speakout-login]").forEach(a=>a.href=login);
  announcements();news();
});
