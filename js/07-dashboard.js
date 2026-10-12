function conflicts(p){let h=riskUI();
 if(p.un.length)h+=`<div class="card warn"><h3>This week doesn't have enough time</h3><p class="mut" style="margin-top:6px">${p.un.map(x=>esc(x.t.title)+" ("+fh(x.r)+" unscheduled)").join("; ")}.</p><p style="margin-top:8px">Options: add study hours in Profile, split or shrink a task, postpone a non-urgent one, or ask your instructor about an extension. Nothing is hidden — the plan will not pretend it all fits.</p></div>`;
 if(p.late.length)h+=`<div class="card warn"><h3>Past deadline</h3><p class="mut" style="margin-top:6px">${p.late.map(i=>esc(byId(i).title)).join(", ")} can only be finished after its due date with your current hours.</p></div>`;
 return h}

function dash(){const p=plan(),tk=allT(),pg=prog(),tot=pg[0],sp=pg[1];
 const pend=tk.filter(t=>left(t)>0),over=pend.filter(t=>dl(t)<0).length;
 const avail=capD(0);
 const today=p.ses.filter(s=>s.d==0),top=[...pend].sort((a,b)=>score(b)-score(a))[0];
 const pct=tot?Math.round(sp/tot*100):0;
 let h=`<h2>Hello${S.name?", "+esc(S.name):""} 👋</h2><p class="mut">${T0.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"})}</p>
 <div class="grid"><div class="stat"><b>${pend.length}</b><span>pending tasks</span></div><div class="stat"><b>${fh(pend.reduce((a,t)=>a+left(t),0))}</b><span>study left</span></div><div class="stat"><b>${fh(avail)}</b><span>free today</span></div><div class="stat"><b>${over}</b><span>overdue</span></div></div>
 <div class="card"><div class="row sb"><h3>Overall progress</h3><span>${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
 if(!S.tasks.length&&!S.subs.length)return h+`<div class="card info"><h3>Nothing planned yet</h3><p class="mut" style="margin:6px 0 12px">Add your first assignment or exam, or load a few sample tasks to see how planning works.</p><div class="row"><button class="b" onclick="go('tasks')">Add a task</button><button class="g" onclick="sample()">Load sample tasks</button></div></div>`;
 h+=remUI();if(top)h+=`<div class="card info"><h3>Study next: ${esc(top.title)}</h3><p class="mut" style="margin-top:6px">${why(top)}</p></div>`;
 h+=conflicts(p);
 h+=`<div class="card"><div class="row sb"><h3>Today's plan</h3><button class="g" onclick="go('plan')">Full week</button></div>`;
 h+=today.length?today.map(s=>{const t=byId(s.id);return`<div class="item"><div><b>${esc(t.title)}</b><div class="mut">${fh(s.h)} · ${esc(t.subject||t.cat)} · take a short break after</div></div><div class="row"><button class="b" onclick="doneS('${t.id}',${s.h})">Done</button><button class="g" onclick="missS('${t.id}',${s.h})">Missed</button></div></div>`}).join(""):`<p class="mut" style="margin-top:8px">No sessions left today. Rest counts too.</p>`;
 return h+`</div>`}
