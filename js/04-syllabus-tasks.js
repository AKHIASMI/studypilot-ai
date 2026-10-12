const byId=id=>allT().find(t=>t.id==id);
let DR=null,UN=0;const uid=()=>"x"+Date.now().toString(36)+(UN++);
const examDay=s=>s.exam?Math.round((new Date(s.exam+"T00:00")-T0)/864e5):null;
function capD(d){const dt=addD(d);let c=[0,6].includes(dt.getDay())?S.we:S.wk;if(S.light.includes(dt.getDay()))c=c/2;if(d==0)c=Math.max(0,c-(S.used[TODAY]||0));return c}
/* syllabus -> derived tasks: topics spread before the exam, spaced revision, practice tests */
function allT(){const out=[...S.tasks];
 (S.subs||[]).forEach(s=>{const ed=examDay(s);if(ed==null||ed<0)return;
  const pend=[];s.units.forEach(u=>u.topics.forEach(p=>{if(!p.done)pend.push(p)}));
  const span=Math.max(0,ed-2),n=pend.length;
  pend.forEach((p,k)=>out.push({id:"t"+p.id,kind:"topic",ref:p,title:"Study: "+p.t,subject:s.name,cat:"Exam prep",due:iso(addD(Math.min(span,Math.ceil((k+1)*span/n)))),hrs:p.hrs,spent:p.spent||0,prio:3,diff:p.diff||3}));
  s.units.forEach(u=>u.topics.forEach(p=>{const r=p.rev||0;if(p.done&&r<3&&ed>=1){const due=Math.min(Math.round((new Date(p.doneOn+"T00:00")-T0)/864e5)+[1,3,7][r],ed-1);
   out.push({id:"r"+p.id,kind:"rev",ref:p,title:"Revise: "+p.t,subject:s.name,cat:"Exam prep",due:iso(addD(Math.max(0,due))),hrs:.5,spent:0,prio:2,diff:2})}}));
  const N=ed>=10?2:1,need=N-(s.tests||0);
  for(let i=0;i<need;i++){const last=(s.tests||0)+i+1===N;out.push({id:"p"+s.id+i,kind:"test",ref:s,title:"Practice test: "+s.name,subject:s.name,cat:"Exam prep",due:iso(addD(Math.max(0,last?ed-1:ed-5))),hrs:1.5,spent:0,prio:3,diff:3})}
 });return out}
function prog(){let t=0,s=0;S.tasks.forEach(x=>{t+=x.hrs;s+=x.spent});S.subs.forEach(b=>b.units.forEach(u=>u.topics.forEach(p=>{t+=p.hrs;s+=p.done?p.hrs:(p.spent||0)})));return[t,s]}
