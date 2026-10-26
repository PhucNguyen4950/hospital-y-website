"use strict";
const DOCS=[{n:"Dr. Nguyen Van An",s:"Cardiology",e:"15 years, Cardiology Dept. head"},{n:"Dr. Tran Thi Binh",s:"Paediatrics",e:"12 years, newborn care"},
{n:"Dr. Le Minh Chau",s:"Obstetrics",e:"10 years, high-risk pregnancy"},{n:"Dr. Pham Quoc Dung",s:"Oncology",e:"18 years, chemotherapy"},
{n:"Dr. Vo Thanh Ha",s:"Neurology",e:"9 years, stroke care"},{n:"Dr. Do Anh Khoa",s:"ENT",e:"14 years, endoscopic surgery"},{n:"Dr. Bui Thu Lan",s:"Dermatology",e:"11 years, allergy and skin care"},{n:"Dr. Hoang Duc Minh",s:"Orthopaedics",e:"16 years, joint replacement"}];
const SPEC=[...new Set(DOCS.map(d=>d.s))],TIMES=["08:00","08:30","09:00","09:30","10:00","10:30","14:00","14:30"];
const $=(s,r=document)=>r.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const store={get:(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const page=document.body.dataset.p;
function layout(){
 const L=[["index","Home"],["about","About"],["specialties","Specialties"],["doctors","Doctors"],["prices","Prices"],["news","News"],["contact","Contact"],["booking","Book"]];
 $("#hdr").innerHTML=`<a class="skip" href="#main">Skip to content</a><div class="wrap bar"><a class="logo" href="index.html"><img src="logo.svg" alt="Hospital Y" height="40"></a>
 <button class="btn o mbtn" id="mn" aria-expanded="false" aria-controls="nv">Menu</button><nav id="nv" aria-label="Main">${L.map(([h,t])=>`<a href="${h}.html"${h===page?' aria-current="page"':""}>${t}</a>`).join("")}</nav>
 <button class="btn o" id="fz" aria-label="Increase text size">A+</button><a class="btn t" href="login.html">Patient Login</a></div>`;
 $("#ftr").innerHTML=`<div class="wrap"><p><b>Hospital Y</b> &middot; 123 Example St., Ho Chi Minh City &middot; Hotline (028) 0000 0000 &middot; Emergency 115 &middot; Open 24/7</p>
 <p><a href="contact.html">Privacy policy</a> &middot; <a href="contact.html">Terms</a> &middot; <a href="contact.html">Accessibility</a> &middot; <a href="wireframes.html">Wireframes</a></p></div>`;
 document.body.insertAdjacentHTML("beforeend",'<a class="btn r sos" href="tel:115">&#9742; Emergency 115</a>');
 $("#mn").onclick=()=>{const o=$("#nv").classList.toggle("open");$("#mn").setAttribute("aria-expanded",o)};
 let z=store.get("fz",112.5);document.documentElement.style.fontSize=z+"%";
 $("#fz").onclick=()=>{z=z>=150?112.5:z+12.5;document.documentElement.style.fontSize=z+"%";store.set("fz",z)};
}
function card(d){return `<article class="card"><div class="av" aria-hidden="true">${d.n.split(" ").slice(-2).map(w=>w[0]).join("")}</div><h3>${esc(d.n)}</h3><p><b>${esc(d.s)}</b><br>${esc(d.e)}</p><a class="btn" href="booking.html?s=${encodeURIComponent(d.s)}&d=${encodeURIComponent(d.n)}">Book</a></article>`}
const R={
 index(){$("#home-docs").innerHTML=DOCS.slice(0,3).map(card).join("")},
 specialties(){$("#sp").innerHTML=SPEC.map(s=>`<article class="card"><h3>${s}</h3><p>${DOCS.filter(d=>d.s===s).length} doctor(s) &middot; consultation from 300,000 VND</p><a class="btn" href="specialty-${s.toLowerCase().replace(/[^a-z]/g,"")}.html">View details</a></article>`).join("")},
 doctors(){const q=$("#q"),f=$("#f");f.innerHTML='<option value="">All specialties</option>'+SPEC.map(s=>`<option>${s}</option>`).join("");
  const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const go=()=>{const r=DOCS.filter(d=>(!f.value||d.s===f.value)&&norm(d.n+d.s).includes(norm(q.value)));
   $("#dl").innerHTML=r.map(card).join("")||"<p>No doctor found.</p>";$("#cnt").textContent=r.length+" result(s)"};
  q.oninput=f.onchange=go;go()},
 booking(){const p=new URLSearchParams(location.search),sp=$("#sp"),dc=$("#dc"),dt=$("#dt"),sl=$("#sl"),e=$("#e");let time="";
  sp.innerHTML='<option value="">Choose...</option>'+SPEC.map(s=>`<option>${s}</option>`).join("");
  const t=new Date();t.setDate(t.getDate()+1);dt.min=t.toISOString().slice(0,10);
  const taken=()=>store.get("bk",[]);
  const slots=()=>{time="";sl.innerHTML=TIMES.map(x=>{const b=taken().some(k=>k.doc===dc.value&&k.date===dt.value&&k.time===x);return `<button type="button" class="btn o slot" aria-pressed="false" data-t="${x}" ${b||!dc.value||!dt.value?"disabled":""}>${x}</button>`}).join("")};
  const docs=()=>{dc.innerHTML='<option value="">Choose...</option>'+DOCS.filter(d=>d.s===sp.value).map(d=>`<option>${d.n}</option>`).join("");slots()};
  sp.onchange=docs;dc.onchange=dt.onchange=slots;
  sl.onclick=ev=>{const b=ev.target.closest("button");if(!b||b.disabled)return;time=b.dataset.t;sl.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b))};
  if(p.get("s")){sp.value=p.get("s");docs();if(p.get("d"))dc.value=p.get("d")}
  $("#bf").onsubmit=ev=>{ev.preventDefault();const v=id=>$("#"+id).value.trim(),er=[];
   if(!sp.value)er.push("Choose a specialty.");if(!dc.value)er.push("Choose a doctor.");if(!dt.value)er.push("Choose a date.");if(!time)er.push("Choose a time slot.");
   if(v("nm").length<2)er.push("Enter your full name.");if(!/^0\d{9}$/.test(v("ph")))er.push("Phone must be 10 digits starting with 0.");
   if(v("em")&&!/^\S+@\S+\.\S+$/.test(v("em")))er.push("E-mail format is invalid.");
   if(!er.length&&taken().some(k=>k.doc===dc.value&&k.date===dt.value&&k.time===time)){er.push("Sorry, this slot was just taken. Please pick another.");slots()}
   if(er.length){e.innerHTML=er.map(esc).join("<br>");return}
   const k={code:"AP"+Date.now().toString().slice(-6),spec:sp.value,doc:dc.value,date:dt.value,time,name:v("nm"),phone:v("ph")};
   store.set("bk",[...taken(),k]);e.textContent="";$("#bf").hidden=true;
   $("#done").hidden=false;$("#done").innerHTML=`<h2>Appointment confirmed</h2><p>Code <b>${k.code}</b>: ${esc(k.spec)} with ${esc(k.doc)} on ${k.date} at ${k.time}. A reminder will be sent to ${esc(k.phone)}.</p>`;$("#done").focus()}},
 login(){let step=1,fails=0,id="";const e=$("#e");
  $("#lf").onsubmit=ev=>{ev.preventDefault();e.textContent="";
   if(step===1){id=$("#id").value.trim().toUpperCase();
    if(fails>=5){e.textContent="Account temporarily locked. Try again in 15 minutes.";return}
    if(id==="PS001"&&$("#pw").value==="Pass@1234"){step=2;$("#s1").hidden=true;$("#s2").hidden=false;$("#otp").focus()}
    else{fails++;e.textContent="Incorrect ID or password."}}
   else if($("#otp").value==="123456"){sessionStorage.setItem("u",id);location.href="portal.html"}
   else e.textContent="Incorrect code."}},
 portal(){if(!sessionStorage.getItem("u")){location.replace("login.html");return}
  addEventListener("pageshow",()=>{if(!sessionStorage.getItem("u"))location.replace("login.html")});
  const out=()=>{sessionStorage.clear();location.replace("login.html")};$("#lo").onclick=out;
  const ap=[{code:"AP100001",spec:"Cardiology",doc:"Dr. Nguyen Van An",date:"2026-11-24",time:"09:00"},...store.get("bk",[])];
  $("#ap").innerHTML=ap.map(a=>`<tr><td>${a.code}</td><td>${esc(a.spec)}</td><td>${esc(a.doc)}</td><td>${a.date} ${a.time}</td></tr>`).join("");
  let idle=Date.now();["click","keydown","touchstart"].forEach(x=>addEventListener(x,()=>idle=Date.now()));
  setInterval(()=>{if(Date.now()-idle>9e5){alert("Session expired for your security.");out()}},3e4)}
};
layout();R[page]&&R[page]();
