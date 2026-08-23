import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const cfg=window.KPA_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT')&&!cfg.anonKey.includes('YOUR_SUPABASE');
const sb=ready?createClient(cfg.url,cfg.anonKey):null;
const form=document.querySelector('#fullAdmissionForm'),out=document.querySelector('#admissionMessage');
const reference=()=>`KPA-ADM-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;

form?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!sb){out.textContent='The admissions service is temporarily unavailable. Please contact the School.';out.className='form-status error';return}
  const btn=form.querySelector('[type=submit]'),f=new FormData(form),ref=reference();
  btn.disabled=true;btn.textContent='Submitting application…';out.textContent='';out.className='form-status';
  const payload={
    reference_number:ref,student_first_name:f.get('student_first_name'),student_last_name:f.get('student_last_name'),student_other_names:f.get('student_other_names')||null,
    date_of_birth:f.get('date_of_birth')||null,gender:f.get('gender'),nationality:f.get('nationality')||'Nigerian',state_of_origin:f.get('state_of_origin')||null,
    current_school:f.get('current_school')||null,current_class:f.get('current_class')||null,applying_for_class:f.get('applying_for_class'),academic_session:f.get('academic_session'),
    parent_name:f.get('parent_name'),relationship_to_student:f.get('relationship_to_student'),parent_phone:f.get('parent_phone'),parent_whatsapp:f.get('parent_whatsapp')||null,
    parent_email:f.get('parent_email'),residential_address:f.get('residential_address'),occupation:f.get('occupation')||null,emergency_contact_name:f.get('emergency_contact_name')||null,
    emergency_contact_phone:f.get('emergency_contact_phone')||null,previous_school_notes:f.get('previous_school_notes')||null,support_information:f.get('support_information')||null,
    how_heard:f.get('how_heard')||null,parent_message:f.get('parent_message')||null,consent:true,status:'new',source:'website',email_status:'pending'
  };
  const {data,error}=await sb.from('admission_applications').insert(payload).select('id,reference_number').single();
  if(error){console.error(error);out.textContent='We could not submit the application. Please review the form and try again.';out.className='form-status error';btn.disabled=false;btn.textContent='Submit Application';return}
  let emailNote='';
  try{const {data:mailData,error:mailError}=await sb.functions.invoke('notify-admission',{body:{applicationId:data.id}});if(mailError)throw mailError;if(mailData?.emailConfigured===false)emailNote=' The application is safely in the dashboard; email confirmation is being configured.'}catch(err){console.warn('Admission notification:',err);emailNote=' The application is safely in the dashboard even though the email notification could not be confirmed.'}
  form.reset();out.innerHTML=`Application received successfully. Your reference number is <strong>${data.reference_number||ref}</strong>. Please keep it for follow-up.${emailNote}`;out.className='form-status success';btn.disabled=false;btn.textContent='Submit Application';out.scrollIntoView({behavior:'smooth',block:'center'});
});
