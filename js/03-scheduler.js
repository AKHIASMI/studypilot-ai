/* deterministic scheduler */
function plan(){
 const rem=allT().filter(t=>left(t)>0).map(t=>({t,r:left(t)})).sort((a,b)=>Math.max(0,dl(a.t))-Math.max(0,dl(b.t))||score(b.t)-score(a.t));
 const ses=[];
 for(let d=0;d<7;d++){let cap=capD(d);
  
  for(const x of rem)while(cap>.001&&x.r>.001){const h=Math.min(S.blk,x.r,cap);ses.push({d,id:x.t.id,h});x.r-=h;cap-=h}}
 const un=rem.filter(x=>x.r>.001).map(x=>({t:x.t,r:x.r}));
 const late=[...new Set(ses.filter(s=>s.d>dl(byId(s.id))).map(s=>s.id))];
 return{ses,un,late}}
