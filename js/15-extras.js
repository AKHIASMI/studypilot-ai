/* Extras: focus timer, calendar, insights, notes/steps, backup, reminders */
const pad=n=>String(n).padStart(2,"0");
function dlf(name,txt,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}
function note(m){toast(m);try{if(S.rem&&Notification.permission==="granted")new Notification("StudyPilot AI",{body:m})}catch(e){}}
function remind(){try{const h=new Date().getHours();if(!S.rem||Notification.permission!=="granted"||S.lastRem===TODAY||h<7||h>=22)return;const d=allT().filter(t=>left(t)>0&&dl(t)<=1&&!t.kind);if(d.length){new Notification("StudyPilot AI",{body:d.length+" task(s) due today or tomorrow: "+d.slice(0,2).map(t=>t.title).join(", ")});S.lastRem=TODAY;save()}}catch(e){}}
/* notes and steps on tasks */
function det(t){const st=t.sub||[];return `<details><summary class="mut">Notes &amp; steps${st.length?" ("+st.filter(x=>x.d).length+"/"+st.length+")":""}</summary>${st.map((x,i)=>`<label style="display:flex;flex-direction:row;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" style="width:auto" ${x.d?"checked":""} onchange="subT('${t.id}',${i})">${esc(x.t)}</label>`).join("")}<input placeholder="Add a step, press Enter" aria-label="Add step" onkeydown="if(event.key==='Enter')addSub('${t.id}',this.value)"><textarea rows="2" placeholder="Notes or links" aria-label="Notes" onchange="noteT('${t.id}',this.value)" style="margin-top:6px">${esc(t.notes||"")}</textarea></details>`}
const mt=id=>S.tasks.find(t=>t.id==id);
function subT(id,i){const t=mt(id);t.sub[i].d=!t.sub[i].d;save();render()}
function addSub(id,v){if(!v.trim())return;const t=mt(id);(t.sub=t.sub||[]).push({t:v.trim().slice(0,80),d:false});save();render()}
function noteT(id,v){mt(id).notes=v.slice(0,2000);save()}
/* focus timer */
let FT={id:"",left:S.fm*60,tot:S.fm*60,run:false,mode:"focus",iv:0};
function ftShow(){const e=$("#tm");if(e)e.textContent=Math.floor(FT.left/60)+":"+pad(FT.left%60)}
function ftLog(sec){const t=FT.id?byId(FT.id):null,h=sec/3600;S.logs.push({d:TODAY,h,id:FT.id,sub:t?t.subject||"":"",cat:t?t.cat:"",t:t?t.title:"Free focus"});if(t)doneS(FT.id,h);else{save();render()}}
function ftReset(){clearInterval(FT.iv);FT.run=false;FT.mode="focus";FT.tot=FT.left=S.fm*60;render()}
function ftDone(){clearInterval(FT.iv);FT.run=false;if(FT.mode==="focus"){ftLog(FT.tot);FT.mode="break";FT.tot=FT.left=S.brk*60;note("Focus session done. Take a break.")}else{FT.mode="focus";FT.tot=FT.left=S.fm*60;note("Break over. Ready when you are.")}render()}
function ftSkip(){const el=FT.tot-FT.left;if(FT.mode==="focus"&&el>=60){clearInterval(FT.iv);FT.run=false;ftLog(el)}ftReset()}
function ftGo(){if(FT.run){clearInterval(FT.iv);FT.run=false;return render()}const s=$("#ft");if(s&&FT.mode==="focus")FT.id=s.value;FT.run=true;FT.iv=setInterval(()=>{FT.left--;ftShow();if(FT.left<=0)ftDone()},1000);render()}
const lh=(a,b)=>S.logs.filter(l=>l.d>=a&&l.d<=b).reduce((x,l)=>x+l.h,0);
function focusV(){const ts=allT().filter(t=>left(t)>0),rec=[...S.logs].reverse().slice(0,5);
 return `<h2>Focus</h2><p class="mut">Work in short sessions. Finished time is logged to the task and your insights.</p><div class="card"><label>Task<select id="ft" ${FT.run?"disabled":""} onchange="FT.id=this.value"><option value="">Free focus (no task)</option>${ts.map(t=>`<option value="${t.id}" ${t.id==FT.id?"selected":""}>${esc(t.title)}</option>`).join("")}</select></label><div id="tm" role="timer"></div><p class="mut" style="text-align:center">${FT.mode==="focus"?"Focus time":"Break time"}</p><div class="row" style="justify-content:center;margin-top:10px"><button class="b" onclick="ftGo()">${FT.run?"Pause":"Start"}</button><button class="g" onclick="ftReset()">Reset</button><button class="g" onclick="ftSkip()">Finish &amp; log</button></div></div><div class="card"><h3>Today: ${fh(lh(TODAY,TODAY))} focused</h3>${rec.length?rec.map(l=>`<div class="mut" style="margin-top:6px">${l.d} · ${esc(l.t)} · ${Math.round(l.h*60)} min</div>`).join(""):'<p class="mut" style="margin-top:6px">No sessions yet.</p>'}</div>`}
/* month calendar */
let CM=0;
function cal(){const b=new Date(T0.getFullYear(),T0.getMonth()+CM,1),y=b.getFullYear(),m=b.getMonth(),f=(b.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),ev={},hr={};
 S.tasks.filter(t=>left(t)>0).forEach(t=>(ev[t.due]=ev[t.due]||[]).push("📌 "+t.title));S.subs.forEach(s=>s.exam&&(ev[s.exam]=ev[s.exam]||[]).push("🎓 "+s.name));
 plan().ses.forEach(s=>{const k=iso(addD(s.d));hr[k]=(hr[k]||0)+s.h});
 let c=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<div class="mut" style="text-align:center;font-size:.75rem">${d}</div>`).join("");
 for(let i=0;i<f;i++)c+="<div></div>";
 for(let d=1;d<=n;d++){const k=y+"-"+pad(m+1)+"-"+pad(d),e=ev[k]||[];c+=`<div class="cc ${k===TODAY?"t":""}"><b>${d}</b>${hr[k]?`<div class="mut">⏱ ${fh(hr[k])}</div>`:""}${e.slice(0,2).map(x=>`<div title="${esc(x)}">${esc(x)}</div>`).join("")}${e.length>2?`<div class="mut">+${e.length-2} more</div>`:""}</div>`}
 return `<h2>Calendar</h2><div class="row sb" style="margin-top:10px"><button class="g" onclick="CM--;render()" aria-label="Previous month">‹</button><h3>${b.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><button class="g" onclick="CM++;render()" aria-label="Next month">›</button></div><div class="cal" style="margin-top:12px">${c}</div><p class="mut" style="margin-top:10px">📌 deadline · 🎓 exam · ⏱ planned study hours for the next 7 days. Use Planner for the week plan.</p>`}
/* insights, weekly review, practice scores */
function addSc(e){e.preventDefault();const f=e.target,p=+f.pct.value;if(!(p>=0&&p<=100))return toast("Enter a score from 0 to 100.");S.scores.push({sub:f.sub.value,pct:p,d:TODAY});save();toast("Score saved.");render()}
function ins(){const days=[...Array(7)].map((_,i)=>iso(addD(i-6))),hrs=days.map(d=>lh(d,d)),mx=Math.max(1,...hrs),wk=hrs.reduce((a,b)=>a+b,0);
 const done=S.tasks.filter(t=>left(t)==0),late=done.filter(t=>t.doneOn&&t.doneOn>t.due).length,ont=done.filter(t=>t.doneOn&&t.doneOn<=t.due).length;
 const sb={};S.logs.forEach(l=>{const k=l.sub||"General";sb[k]=(sb[k]||0)+l.h});const sm=Math.max(1,...Object.values(sb));
 const cat={};done.forEach(t=>{const a=S.logs.filter(l=>l.id==t.id).reduce((x,l)=>x+l.h,0);if(a>0)(cat[t.cat]=cat[t.cat]||[]).push(a/t.hrs)});
 const est=Object.entries(cat).map(([c,r])=>[c,r.reduce((a,b)=>a+b,0)/r.length,r.length]);
 const sc={};S.scores.forEach(s=>(sc[s.sub]=sc[s.sub]||[]).push(s.pct));const avg=Object.entries(sc).map(([s,r])=>[s,r.reduce((a,b)=>a+b,0)/r.length]);
 const open=allT().filter(t=>left(t)>0&&!t.kind),R=risk(),topS=Object.entries(sb).sort((a,b)=>b[1]-a[1])[0];
 const rv=[`This week you logged ${fh(wk)} of focused study and finished ${done.length} task${done.length==1?"":"s"} (${ont} on time, ${late} late).`,
  `${open.length} task${open.length==1?"":"s"} still open, about ${fh(open.reduce((a,t)=>a+left(t),0))} of work left.`];
 if(topS)rv.push(`Most of your time went to ${topS[0]}.`);
 rv.push(R?"Your workload is above your available time. Prioritize the exam work and talk to instructors about extensions where needed.":"Your plan currently fits your available hours.");
 est.filter(e=>e[1]>1.25&&e[2]>=2).forEach(e=>rv.push(`${e[0]} tasks take about ${e[1].toFixed(1)}× your estimate. Plan more time for them.`));
 avg.filter(a=>a[1]<60).forEach(a=>rv.push(`${a[0]} practice scores average ${Math.round(a[1])}%. Schedule extra revision there.`));
 const names=[...new Set([...S.subs.map(s=>s.name),"Other"])];
 return `<h2>Insights</h2><div class="card info"><h3>Weekly review</h3><ul style="margin:8px 0 0;padding-left:20px">${rv.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
 <div class="card"><h3>Focused hours, last 7 days</h3>${days.map((d,i)=>`<div class="row" style="margin-top:6px"><span style="width:56px" class="mut">${new Date(d+"T00:00").toLocaleDateString(undefined,{weekday:"short"})}</span><div class="bar" style="flex:1;margin:0"><i style="width:${hrs[i]/mx*100}%"></i></div><span style="width:44px;text-align:right">${fh(hrs[i])}</span></div>`).join("")}</div>
 <div class="card"><h3>Time by subject</h3>${Object.keys(sb).length?Object.entries(sb).map(([k,v])=>`<div class="row" style="margin-top:6px"><span style="width:110px" class="mut">${esc(k)}</span><div class="bar" style="flex:1;margin:0"><i style="width:${v/sm*100}%"></i></div><span style="width:44px;text-align:right">${fh(v)}</span></div>`).join(""):'<p class="mut" style="margin-top:6px">Log focus sessions to see this.</p>'}</div>
 <div class="card"><h3>Estimate check</h3>${est.length?est.map(e=>`<div class="mut" style="margin-top:6px">${esc(e[0])}: actual time is ${e[1].toFixed(1)}× your estimate (${e[2]} task${e[2]==1?"":"s"})</div>`).join(""):'<p class="mut" style="margin-top:6px">Finish a few tasks with the focus timer and StudyPilot will compare your estimates with real time.</p>'}</div>
 <form class="card" onsubmit="addSc(event)"><h3>Practice test scores</h3><div class="fg"><label>Subject<select name="sub">${names.map(n=>`<option>${esc(n)}</option>`).join("")}</select></label><label>Score (%)<input type="number" name="pct" min="0" max="100" required></label></div><button class="b" style="margin-top:10px">Save score</button>${avg.map(a=>`<div class="mut" style="margin-top:8px">${esc(a[0])}: average ${Math.round(a[1])}% ${a[1]<60?"· needs attention":""}</div>`).join("")}</form>`}
/* settings, backup, calendar export */
function togL(w){const i=S.light.indexOf(w);i<0?S.light.push(w):S.light.splice(i,1);save();toast("Plan updated.")}
function togRem(on){if(!on||!window.Notification){S.rem=false;save();return render()}Notification.requestPermission().then(p=>{S.rem=p==="granted";if(!S.rem)toast("Notifications are blocked in this browser.");save();render()})}
function expJ(){dlf("studypilot-backup-"+TODAY+".json",JSON.stringify(S),"application/json")}
function impJ(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!Array.isArray(o.tasks))throw 0;S=Object.assign(def(),o);save();toast("Backup restored.");render()}catch(e){toast("That file isn't a StudyPilot backup.")}};r.readAsText(f)}
function expI(){const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//StudyPilot AI//EN"],ev=(d,s)=>L.push("BEGIN:VEVENT","UID:"+Math.random().toString(36).slice(2)+"@studypilot","DTSTAMP:"+TODAY.replace(/-/g,"")+"T000000Z","DTSTART;VALUE=DATE:"+d.replace(/-/g,""),"SUMMARY:"+s.replace(/[,;\n]/g," "),"END:VEVENT");
 S.tasks.filter(t=>left(t)>0).forEach(t=>ev(t.due,"Due: "+t.title));S.subs.forEach(s=>s.exam&&ev(s.exam,"Exam: "+s.name));plan().ses.forEach(s=>ev(iso(addD(s.d)),"Study: "+byId(s.id).title+" ("+fh(s.h)+")"));L.push("END:VCALENDAR");dlf("studypilot.ics",L.join("\r\n"),"text/calendar")}
function setupX(){const D=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
 return `<div class="card"><h3>Study load and focus</h3><p class="mut" style="margin:6px 0">Your daily hours above are the maximum. Tick lighter days to plan half the usual hours.</p><div class="row">${D.map((n,i)=>{const w=(i+1)%7;return `<label style="display:flex;flex-direction:row;gap:6px;align-items:center;color:var(--ink)"><input type="checkbox" style="width:auto" ${S.light.includes(w)?"checked":""} onchange="togL(${w})">${n}</label>`}).join("")}</div><div class="fg"><label>Focus minutes<input type="number" min="5" max="120" value="${S.fm}" onchange="S.fm=+this.value||25;save();ftReset()"></label><label>Break minutes<input type="number" min="1" max="30" value="${S.brk}" onchange="S.brk=+this.value||5;save();ftReset()"></label></div><label style="display:flex;flex-direction:row;gap:8px;align-items:center;color:var(--ink);margin-top:10px"><input type="checkbox" style="width:auto" ${S.rem?"checked":""} onchange="togRem(this.checked)">Browser reminders for deadlines and finished sessions</label></div>
 <div class="card"><h3>Backup and export</h3><div class="row" style="margin-top:8px"><button class="g" onclick="expJ()">Download backup</button><label class="g" style="cursor:pointer;display:inline-block;padding:8px 12px;border:1px solid var(--line);border-radius:10px;color:var(--ink)">Restore backup<input type="file" accept=".json" style="display:none" onchange="impJ(this)"></label><button class="g" onclick="expI()">Export calendar (.ics)</button></div></div>`}
