function doneS(id,h){const t=byId(id),r=t.ref;
 if(t.kind==="topic"){r.spent=Math.min(r.hrs,(r.spent||0)+h);if(r.spent>=r.hrs-.01){r.done=true;r.doneOn=TODAY}}
 else if(t.kind==="rev"){r.rs=(r.rs||0)+h;if(r.rs>=.5-.01){r.rev=(r.rev||0)+1;r.rs=0}}
 else if(t.kind==="test"){r.ts=(r.ts||0)+h;if(r.ts>=1.5-.01){r.tests=(r.tests||0)+1;r.ts=0}}
 else{t.spent=Math.min(t.hrs,t.spent+h);if(t.spent>=t.hrs-.01&&!t.doneOn)t.doneOn=TODAY}S.used[TODAY]=(S.used[TODAY]||0)+h;S.changes=[];S.last=null;save();toast("Session logged. Nice work.");render()}
function missS(id,h){const before=plan();S.used[TODAY]=(S.used[TODAY]||0)+h;const after=plan();
 S.changes=diff(before,after);S.last={id,h};save();S.view="plan";toast("Missed session recorded. Plan updated.");render()}
function undo(){if(!S.last)return;S.used[TODAY]=Math.max(0,(S.used[TODAY]||0)-S.last.h);S.last=null;S.changes=[];save();toast("Restored.");render()}
function accept(){S.changes=[];S.last=null;save();render()}
function delT(id){S.tasks=S.tasks.filter(t=>t.id!=id);save();render()}
function finT(id){const t=byId(id);t.spent=t.hrs;t.doneOn=TODAY;save();toast("Task completed.");render()}
function addT(e){e.preventDefault();const f=e.target,v=n=>f[n].value;
 if(!v("title").trim()||!v("due"))return;
 S.tasks.push({id:Date.now(),title:v("title").trim(),subject:v("subject").trim(),cat:v("cat"),due:v("due"),hrs:Math.max(.5,+v("hrs")||1),spent:0,prio:+v("prio"),diff:+v("diff")});
 save();toast(risk()?"Added. Heads up: you now have more work than time. See the dashboard.":"Task added.");render()}
function sample(){const mk=(i,t,s,c,d,h,p,df)=>({id:Date.now()+i,title:t,subject:s,cat:c,due:iso(addD(d)),hrs:h,spent:0,prio:p,diff:df});
 S.tasks.push(mk(1,"Data Structures problem set","DSA","Assignment",2,4,3,4),mk(2,"Physics lab record","Physics","Lab work",3,3,2,2),mk(3,"Internal exam revision","DSA","Exam prep",6,6,4,4),mk(4,"Presentation slides","English","Presentation",5,2,2,2));
 save();render()}
function saveP(e){e.preventDefault();const f=e.target;S.name=f.name.value.trim();S.wk=Math.max(0,+f.wk.value);S.we=Math.max(0,+f.we.value);S.blk=Math.max(.5,+f.blk.value||1);S.view="dash";save();toast("Profile saved.");render()}
function reset(){if(confirm("Delete all StudyPilot data on this device?")){S=def();save();render()}}
