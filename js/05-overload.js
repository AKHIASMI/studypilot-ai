/* proactive overload check: for each deadline, work due by then vs hours available by then */
function risk(){const ts=allT().filter(t=>left(t)>0);
 const ds=[...new Set(ts.map(t=>Math.max(0,dl(t))))].sort((a,b)=>a-b);
 for(const D of ds){const grp=ts.filter(t=>Math.max(0,dl(t))<=D),work=grp.reduce((a,t)=>a+left(t),0);let av=0;for(let d=0;d<=D;d++)av+=capD(d);
  if(work>av+.01){const keep=[...grp].sort((a,b)=>score(b)-score(a))[0];
   const drop=[...grp].filter(t=>t!==keep&&t.cat!=="Exam prep").sort((a,b)=>score(a)-score(b))[0];return{work,av,D,keep,drop}}}
 return null}
function riskUI(){const r=risk();return r?`<div class="card warn"><h3>Heads up: more work than time</h3><p style="margin-top:6px">You have about ${fh(r.work)} of planned work due ${r.D==0?"today":"by "+dname(r.D)} but only ${fh(r.av)} of study time before then. Consider prioritizing ${esc(r.keep.title)}${r.drop?` and asking about an extension for ${esc(r.drop.title)}`:`, splitting the work, or adding study hours in Profile`}.</p></div>`:""}
function remUI(){const r=allT().filter(t=>(t.kind==="rev"&&dl(t)<=1)||(t.kind==="test"&&dl(t)<=3));
 return r.length?`<div class="card info"><h3>Reminders</h3>${r.slice(0,5).map(t=>`<div class="mut" style="margin-top:6px">${t.kind==="rev"?"Revise":"Practice test"} · ${esc(t.title.replace(/^(Revise|Practice test): /,""))} · ${dname(Math.max(0,dl(t)))}</div>`).join("")}</div>`:""}
function mapOf(p){const m={};p.ses.forEach(s=>{const k=s.id+"|"+s.d;m[k]=(m[k]||0)+s.h});return m}
function diff(a,b){const ma=mapOf(a),mb=mapOf(b),ids=new Set();
 [...Object.keys(ma),...Object.keys(mb)].forEach(k=>ids.add(k.split("|")[0]));const out=[];
 ids.forEach(id=>{const ch=[];for(let d=0;d<7;d++){const x=(mb[id+"|"+d]||0)-(ma[id+"|"+d]||0);if(Math.abs(x)>.01)ch.push((x>0?"+":"−")+fh(Math.abs(x))+" "+dname(d))}
  if(ch.length){const t=byId(id);out.push((t?t.title:"Task")+": "+ch.join(", "))}});return out}
