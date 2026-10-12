/* transparent priority rules */
function score(t){const d=Math.max(0,dl(t));return left(t)/(d+1)*2+t.prio+t.diff*.5+(t.cat==="Exam prep"?1.5:0)+(dl(t)<0?5:0)}
function why(t){const d=dl(t),p=[];
 p.push(d<0?"it is overdue":d==0?"it is due today":d==1?"it is due tomorrow":"it is due in "+d+" days");
 p.push(fh(left(t))+" of work remains");
 if(t.prio>=3)p.push("you marked it "+PR[t.prio].toLowerCase()+" priority");
 if(t.diff>=4)p.push("it is a hard task");
 if(t.cat==="Exam prep")p.push("exam preparation is protected");
 return "Prioritized because "+p.join(", ")+"."}
