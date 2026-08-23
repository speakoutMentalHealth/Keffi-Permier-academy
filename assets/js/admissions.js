
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const cfg=window.KPA_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes("YOUR_PROJECT")&&!cfg.anonKey.includes("YOUR_SUPABASE");
const supabase=ready?createClient(cfg.url,cfg.anonKey):null;
const form=document.querySelector("#fullAdmissionForm"),out=document.querySelector("#admissionMessage");
const ref=()=>`KPA-ADM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
form?.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!supabase){out.textContent="Admissions backend is not configured yet.";out.className="form-status error";return}
  const btn=form.querySelector('[type="submit"]');btn.disabled=true;btn.textContent="Submitting...";
  const f=new FormData(form),reference=ref();
  const payload={
    reference_number:reference,student_first_name:f.get("student_first_name"),student_last_name:f.get("student_last_name"),
    student_other_names:f.get("student_other_names")||null,date_of_birth:f.get("date_of_birth")||null,gender:f.get("gender"),
    nationality:f.get("nationality")||"Nigerian",state_of_origin:f.get("state_of_origin")||null,current_school:f.get("current_school")||null,
    current_class:f.get("current_class")||null,applying_for_class:f.get("applying_for_class"),academic_session:f.get("academic_session"),
    parent_name:f.get("parent_name"),relationship_to_student:f.get("relationship_to_student"),parent_phone:f.get("parent_phone"),
    parent_whatsapp:f.get("parent_whatsapp")||null,parent_email:f.get("parent_email"),residential_address:f.get("residential_address"),
    occupation:f.get("occupation")||null,emergency_contact_name:f.get("emergency_contact_name")||null,
    emergency_contact_phone:f.get("emergency_contact_phone")||null,previous_school_notes:f.get("previous_school_notes")||null,
    support_information:f.get("support_information")||null,how_heard:f.get("how_heard")||null,parent_message:f.get("parent_message")||null,
    consent:true,status:"new",source:"website"
  };
  const {data,error}=await supabase.from("admission_applications").insert(payload).select("id,reference_number").single();
  if(error){out.textContent="We could not submit the application. Please try again.";out.className="form-status error";btn.disabled=false;btn.textContent="Submit Application";return}
  try{await supabase.functions.invoke("notify-admission",{body:{applicationId:data.id}})}catch{}
  form.reset();out.innerHTML=`Application received successfully. Your reference number is <strong>${data.reference_number||reference}</strong>.`;
  out.className="form-status success";btn.disabled=false;btn.textContent="Submit Application";
});
