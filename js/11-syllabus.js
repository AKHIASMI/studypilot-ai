/* syllabus import */
function toISO(s){let m;if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;if(m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/))return m[3]+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0");const t=Date.parse(s.replace(/\./g,""));return isNaN(t)?"":iso(new Date(t))}
function parse(txt){const subs=[];let cur=null,u=null;
 const mk=n=>{cur={id:uid(),name:(n||"My subject").slice(0,60),exam:"",units:[]};u=null;subs.push(cur)};
 const un=n=>{if(!cur)mk();u={name:n.slice(0,80),topics:[]};cur.units.push(u)};
 txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(l=>{let m;
  if(m=l.match(/^(?:subject|course)\s*[:\-]\s*(.+)/i))return mk(m[1]);
  if(/exam/i.test(l)&&(m=l.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}|[A-Za-z]{3,9}\.? \d{1,2},? \d{4}|\d{1,2} [A-Za-z]{3,9}\.? \d{4})/))){if(!cur)mk();const d=toISO(m[1]);if(d)cur.exam=d;return}
  if(/^(unit|module|chapter)\b/i.test(l))return un(l);
  if(!cur)mk();if(!u)un("Topics");
  l.replace(/^[\-*•\d.)\s]+/,"").split(/[;,]/).map(x=>x.trim()).filter(Boolean).forEach(x=>u.topics.push({id:uid(),t:x.slice(0,80),hrs:1,diff:3,spent:0,done:false,rev:0}))});
 return subs}
function extract(){const v=$("#sy").value;if(!v.trim())return toast("Paste your syllabus text first.");const d=parse(v);
 if(!d.some(s=>s.units.some(u=>u.topics.length)))return toast("No topics found. Try one topic per line or comma-separated.");DR=d;render()}
function ex(){$("#sy").value="Subject: Data Structures\nExam: "+iso(addD(14))+"\nUnit 1: Linear structures\nArrays, Linked lists, Stacks, Queues\nUnit 2: Trees\nBinary trees, BST, AVL trees, Heaps\nUnit 3: Graphs\nBFS and DFS, Shortest paths, Spanning trees"}
function rdf(i){const f=i.files[0];if(!f)return;if(/^text\//.test(f.type)||/\.(txt|md)$/i.test(f.name)){const r=new FileReader();r.onload=()=>{$("#sy").value=String(r.result).slice(0,60000)};r.readAsText(f)}else toast("PDF and image reading isn't available yet. Copy the text and paste it here.")}
function confirmD(){DR.forEach(s=>{s.units.forEach(u=>{u.topics=u.topics.filter(t=>t.inc!==false&&t.t.trim());u.topics.forEach(t=>{if(t.done){t.spent=t.hrs;t.doneOn=TODAY}})});s.units=s.units.filter(u=>u.topics.length);if(s.units.length)S.subs.push(Object.assign(s,{tests:0}))});DR=null;S.view="plan";save();toast("Added. Here's your draft plan.");render()}
function togTp(i,id){const p=S.subs[i].units.flatMap(u=>u.topics).find(t=>t.id==id);p.done=!p.done;if(p.done){p.spent=p.hrs;p.doneOn=TODAY}else{p.spent=0;p.rev=0;p.doneOn=null}save();toast("Plan updated.");render()}
function delSub(i){S.subs.splice(i,1);save();render()}
function draftUI(){const P=(i,j,k)=>`DR[${i}].units[${j}].topics[${k}]`;
 return `<div class="card info"><h3>Check what we found</h3><p class="mut" style="margin-top:6px">Fix names, dates and hours. Untick anything that isn't a topic. Tick Done for topics you've already finished. Dates like 05/06/2026 are read as day/month.</p></div>`+DR.map((s,i)=>`<div class="card"><div class="fg"><label>Subject<input value="${esc(s.name)}" onchange="DR[${i}].name=this.value"></label><label>Exam date<input type="date" value="${s.exam}" onchange="DR[${i}].exam=this.value"></label></div>`+s.units.map((u,j)=>`<h3 style="margin-top:14px">${esc(u.name)}</h3>`+u.topics.map((t,k)=>`<div class="item"><label style="display:flex;flex-direction:row;gap:8px;align-items:center;flex:1;min-width:190px"><input type="checkbox" style="width:auto" checked onchange="${P(i,j,k)}.inc=this.checked" aria-label="Include"><input value="${esc(t.t)}" onchange="${P(i,j,k)}.t=this.value"></label><label style="display:flex;flex-direction:row;gap:6px;align-items:center">Done<input type="checkbox" style="width:auto" onchange="${P(i,j,k)}.done=this.checked"></label><label style="width:84px">Hours<input type="number" min=".5" step=".5" value="${t.hrs}" onchange="${P(i,j,k)}.hrs=+this.value||1"></label></div>`).join("")).join("")+`</div>`).join("")+`<div class="row" style="margin-top:14px"><button class="b" onclick="confirmD()">Add to my plan</button><button class="g" onclick="DR=null;render()">Discard</button></div>`}
function subUI(s,i){const tp=s.units.flatMap(u=>u.topics),dn=tp.filter(t=>t.done).length,un=tp.length-dn,pc=tp.length?Math.round(dn/tp.length*100):0,ed=examDay(s),ok=ed!=null&&ed>=0,rv=tp.reduce((a,t)=>a+3-(t.rev||0),0);
 const need=allT().filter(t=>t.subject===s.name&&t.kind).reduce((a,t)=>a+left(t),0);let av=0;if(ok)for(let d=0;d<=ed;d++)av+=capD(d);
 const ck=[["Exam date set",ok],["All topics covered",tp.length>0&&un==0],["Every topic revised at least once",tp.length>0&&tp.every(t=>(t.rev||0)>=1)],["Practice test done",(s.tests||0)>=1],["Enough study time before the exam",ok&&need<=av+.01]];
 const rd=Math.round(ck.filter(c=>c[1]).length/5*100);
 let w="";if(ok&&ed<=3&&un>0)w+=`Exam ${ed==0?"is today":"in "+ed+" day"+(ed==1?"":"s")} with ${un} topic${un==1?"":"s"} unfinished. Focus on the most important topics first, and keep your sleep.`;
 if(ok&&need>av+.01)w+=` About ${fh(need)} of work is left but only ${fh(av)} of study time before the exam.`;
 return `<div class="card ${w?"warn":""}"><div class="row sb"><h3>${esc(s.name)}</h3><button class="g" onclick="delSub(${i})">Remove</button></div>
 <div class="fg"><label>Exam date<input type="date" value="${s.exam||""}" onchange="S.subs[${i}].exam=this.value;save();toast('Plan updated for the new date.');render()"></label></div>
 <div class="row sb" style="margin-top:10px"><span>Syllabus ${pc}% (${dn}/${tp.length})</span><span class="mut">${un} unfinished · about ${rv} revision sessions left</span></div><div class="bar"><i style="width:${pc}%"></i></div>
 ${w?`<p style="margin-top:10px"><b>Warning:</b> ${w}</p>`:""}
 <h3 style="margin-top:14px">Readiness ${rd}%</h3>${ck.map(c=>`<div class="mut">${c[1]?"✔":"○"} ${c[0]}</div>`).join("")}
 <details style="margin-top:12px"><summary>Topics</summary>${s.units.map(u=>`<h3 style="margin-top:10px">${esc(u.name)}</h3>`+u.topics.map(t=>`<label style="display:flex;flex-direction:row;gap:8px;align-items:center;color:var(--ink);margin-top:6px"><input type="checkbox" style="width:auto" ${t.done?"checked":""} onchange="togTp(${i},'${t.id}')">${esc(t.t)}${t.rev?` <span class="tag">revised ×${t.rev}</span>`:""}</label>`).join("")).join("")}</details></div>`}
function syl(){let h=`<h2>Syllabus &amp; exams</h2><p class="mut">Paste your syllabus. StudyPilot drafts subjects, units, topics and exam dates for you to check, then spreads the topics across your remaining days with spaced revision and practice tests.</p>`;
 if(DR)return h+draftUI();
 h+=`<div class="card"><h3>Import a syllabus</h3><textarea id="sy" rows="7" aria-label="Syllabus text" placeholder="Subject: Physics&#10;Exam: 2026-11-20&#10;Unit 1: Mechanics&#10;Kinematics, Newton's laws, Work and energy"></textarea>
 <div class="row" style="margin-top:10px"><button class="b" onclick="extract()">Extract draft</button><button class="g" onclick="ex()">Try an example</button><label style="display:inline-block"><input type="file" accept=".txt,.md,.pdf,image/*" onchange="rdf(this)" aria-label="Upload syllabus file"></label></div>
 <p class="mut" style="margin-top:8px">Text works today (paste it or upload a .txt file). Reading PDFs and photos needs text extraction this version doesn't have yet, so copy the text out of them for now.</p></div>`;
 if(!S.subs.length)return h+`<div class="card info"><p class="mut">No syllabus yet. Import one above and your exam plan will appear here.</p></div>`;
 return h+S.subs.map(subUI).join("")}
