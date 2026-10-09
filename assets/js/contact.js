import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const cfg=window.KPA_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT')&&!cfg.anonKey.includes('YOUR_SUPABASE');
const sb=ready?createClient(cfg.url,cfg.anonKey):null;
const form=document.querySelector('#contactForm'),out=document.querySelector('#contactMessage');
if(out)out.setAttribute('role','status');
form?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!sb){out.textContent='Contact form is temporarily unavailable. Please use the school contact details.';return}
  const d=new FormData(form),btn=form.querySelector('[type=submit]');
  const originalLabel=btn.textContent;
  btn.disabled=true;btn.textContent='Sending…';
  const payload={name:d.get('name'),phone:d.get('phone')||null,email:d.get('email')||null,enquiry_type:d.get('enquiry_type')||'General enquiry',message:d.get('message'),status:'new'};
  try{
    const {error}=await sb.from('contact_enquiries').insert(payload);
    if(error)throw error;
    form.reset();
    out.textContent='Thank you. Your enquiry has been sent to Keffi Premier Academy.';
  }catch(error){
    console.error('Contact enquiry failed:',error);
    out.textContent='We could not send your enquiry. Please check your connection and try again.';
  }finally{
    btn.disabled=false;btn.textContent=originalLabel;
  }
});
