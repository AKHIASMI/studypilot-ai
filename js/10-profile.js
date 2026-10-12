function setup(){return`<h2>${S.name?"Your profile":"Welcome aboard ✈"}</h2><p class="mut">Tell StudyPilot how much time you really have.</p>
 <form class="card" onsubmit="saveP(event)"><div class="fg"><label>Your name<input name="name" value="${esc(S.name)}" maxlength="40"></label>
 <label>Study hours on weekdays<input type="number" name="wk" min="0" max="10" step=".5" value="${S.wk}"></label>
 <label>Study hours on weekends<input type="number" name="we" min="0" max="10" step=".5" value="${S.we}"></label>
 <label>Session length (hours)<input type="number" name="blk" min=".5" max="3" step=".5" value="${S.blk}"></label></div>
 <button class="b" style="margin-top:12px">Save profile</button></form>
 <div class="card"><h3>Your data</h3><p class="mut" style="margin:6px 0 10px">Storage: <b class="syncs"></b>. When you're signed in to Claude, your plan syncs privately to your account so it follows you across devices, and only you can read it. Deleting removes it from both places.</p><button class="g" onclick="reset()">Delete all data</button></div>${setupX()}`}
