/* cloud sync: private per-user database doc, with the browser copy as offline fallback */
let DBR=null,SYNC="local",ST=null;
function stat(){const t={local:"Saved on this device only",busy:"Saving to your account…",cloud:"Saved to your account",err:"Sync problem. Saved on this device."}[SYNC];document.querySelectorAll(".syncs").forEach(e=>e.textContent=t)}
function push(){if(!DBR)return;clearTimeout(ST);SYNC="busy";stat();ST=setTimeout(async()=>{try{await DBR.set({at:S.at||Date.now(),json:JSON.stringify(S)});SYNC="cloud"}catch(e){SYNC="err"}stat()},800)}
async function cloudInit(){try{if(!window.claude)return;const db=await window.claude.use("db"),us=await window.claude.use("user");if(!db||!us)return;
 const id=await us.id();if(!id)return;DBR=db.collection("data/users/"+id).doc("state");
 const snap=await DBR.get(),r=snap.exists?snap.data():null;
 if(r&&r.json&&r.at>(S.at||0)){S=Object.assign(def(),JSON.parse(r.json));try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}SYNC="cloud";render()}
 else if(S.at||S.tasks.length||S.subs.length||S.name)push();else{SYNC="cloud";stat()}
 }catch(e){SYNC="err";stat()}}
cloudInit();
