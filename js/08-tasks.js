function tasks(){const cats=["Assignment","Exam prep","Lab work","Record writing","Project","Homework","Revision","Reading","Coding practice","Presentation","Group project","Personal goal"];
 let h=`<h2>Tasks</h2><form class="card" onsubmit="addT(event)"><h3>Quick add</h3><div class="fg">
 <label>Title<input name="title" required maxlength="80"></label><label>Subject<input name="subject" maxlength="40"></label>
 <label>Category<select name="cat">${cats.map(c=>`<option>${c}</option>`).join("")}</select></label>
 <label>Deadline<input type="date" name="due" min="${TODAY}" required></label><label>Estimated hours<input type="number" name="hrs" min=".5" step=".5" value="2"></label>
 <label>Priority<select name="prio"><option value="1">Low</option><option value="2" selected>Medium</option><option value="3">High</option><option value="4">Urgent</option></select></label>
 <label>Difficulty (1–5)<select name="diff">${[1,2,3,4,5].map(n=>`<option ${n==3?"selected":""}>${n}</option>`).join("")}</select></label></div>
 <button class="b" style="margin-top:12px">Add task</button></form><div class="card"><h3>All tasks</h3>`;
 const l=[...S.tasks].sort((a,b)=>(left(b)>0)-(left(a)>0)||score(b)-score(a));
 h+=l.length?l.map(t=>{const d=dl(t),dn=left(t)==0;return`<div class="item"><div style="flex:1;min-width:200px"><b${dn?' style="text-decoration:line-through;opacity:.6"':""}>${esc(t.title)}</b> ${d<0&&!dn?'<span class="tag u">Overdue</span>':""}<div class="mut">${esc(t.subject||"")} ${esc(t.cat)} · due ${t.due} · ${fh(t.spent)}/${fh(t.hrs)} · ${PR[t.prio]}</div>${dn?"":`<div class="mut">${why(t)}</div>`}<div class="bar"><i style="width:${Math.round(t.spent/t.hrs*100)}%"></i></div>${det(t)}</div><div class="row">${dn?"":`<button class="g" onclick="finT(${t.id})">Complete</button>`}<button class="g" onclick="delT(${t.id})" aria-label="Delete ${esc(t.title)}">Delete</button></div></div>`}).join(""):`<p class="mut" style="margin-top:8px">No tasks yet. Add one above.</p>`;
 return h+`</div>`}
