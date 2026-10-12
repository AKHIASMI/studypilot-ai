function planner(){const p=plan();let h=`<h2>Adaptive planner</h2><p class="mut">Built from your deadlines, hours and priorities. Missed a session? Mark it on the dashboard and the rest moves.</p>`;
 if(S.changes.length)h+=`<div class="card good"><h3>Plan updated after your missed session</h3><p class="mut" style="margin:6px 0">Remaining work was re-fitted around deadlines. Today's lost time was not squeezed back in.</p><ul style="margin:6px 0 12px">${S.changes.map(c=>`<li>${esc(c)}</li>`).join("")}</ul><div class="row"><button class="b" onclick="accept()">Accept plan</button><button class="g" onclick="undo()">Undo missed session</button></div></div>`;
 else if(S.last==null&&S.changes.length==0&&Object.keys(S.used).length&&false)h+="";
 h+=conflicts(p);
 if(!allT().length)return h+`<div class="card info"><p class="mut">Add tasks or a syllabus to generate a plan.</p></div>`;
 h+=`<div class="card">`;
 for(let d=0;d<7;d++){const s=p.ses.filter(x=>x.d==d),hrs=s.reduce((a,x)=>a+x.h,0);
  h+=`<div class="day"><div><b>${dname(d)}</b><div class="mut">${fh(hrs)}</div></div><div>${s.length?s.map(x=>{const t=byId(x.id);return`<span class="chip ${d>dl(t)?"late":""}" title="${esc(why(t))}">${esc(t.title)} · ${fh(x.h)}</span>`}).join(""):'<span class="mut">Free</span>'}</div></div>`}
 return h+`</div><p class="mut" style="margin-top:10px">Hover a session to see why it was chosen. A pink dashed chip is scheduled after its deadline.</p>`}
