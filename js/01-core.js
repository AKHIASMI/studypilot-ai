const K="studypilot_v1";
const def=()=>({name:"",wk:3,we:2,blk:1,tasks:[],subs:[],logs:[],scores:[],light:[],fm:25,brk:5,rem:false,used:{},view:"setup",changes:[],last:null,theme:null});
let S;try{S=Object.assign(def(),JSON.parse(localStorage.getItem(K)||"{}"))}catch(e){S=def()}
const save=()=>{S.at=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}push()};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const T0=new Date();T0.setHours(0,0,0,0);
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const addD=n=>{const d=new Date(T0);d.setDate(d.getDate()+n);return d};
const TODAY=iso(T0);
const dl=t=>Math.round((new Date(t.due+"T00:00")-T0)/864e5);
const left=t=>Math.max(0,t.hrs-t.spent);
const fh=h=>(Math.round(h*10)/10)+"h";
const dname=d=>d==0?"Today":d==1?"Tomorrow":addD(d).toLocaleDateString(undefined,{weekday:"short",day:"numeric"});
const PR=["","Low","Medium","High","Urgent"];
function toast(m){const t=$("#toast");t.textContent=m;t.className="s";clearTimeout(toast.x);toast.x=setTimeout(()=>t.className="",2400)}
