function go(v){S.view=v;save();render()}
function render(){document.querySelectorAll("nav [data-v]").forEach(b=>{b.className=b.dataset.v==S.view?"on":"";b.onclick=()=>go(b.dataset.v)});
 $("#m").innerHTML=({dash,tasks,plan:planner,syl,focus:focusV,cal,ins,setup})[S.view]();stat();ftShow()}
$("#th").onclick=()=>{const dk=document.documentElement.dataset.theme==="dark"||(!document.documentElement.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);S.theme=dk?"light":"dark";document.documentElement.dataset.theme=S.theme;save()};
if(S.theme)document.documentElement.dataset.theme=S.theme;
if(S.name&&S.view==="setup")S.view="dash";
