var e=Object.defineProperty,t=("undefined"!=typeof require&&require,(t,n,s)=>(((t,n,s)=>{n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[n]=s})(t,"symbol"!=typeof n?n+"":n,s),s));import{r as n,c as s,w as a,m as o,i as r,t as l,u as i,p as c,a as u,o as d,b as p,d as f,e as h,f as v,g as m,h as y,n as g,j as b,k as w,F as k,l as S,q as D,s as j,v as M,x,y as T,z as _,A as P,B as C}from"./vendor.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))processPreload(e);new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&processPreload(e)})).observe(document,{childList:!0,subtree:!0})}function processPreload(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const I=globalThis.setImmediate||function(){const{port1:e,port2:t}=new MessageChannel,n=[];return e.onmessage=function(){n.shift()()},function(e){t.postMessage(null),n.push(e)}}();function sleep(e){return new Promise(void 0===e?e=>I(e):t=>setTimeout(t,e))}const E=["mp4","webm","mkv","avi"];const $=["png","jpg","jpeg","gif","tiff","webp"];function dateToDayDateString(e,t=!0){const n=new Date(e);function pad(e){return e.toString().padStart(2,"0")}const s=t?"UTC":"",a=n[`get${s}FullYear`](),o=n[`get${s}Month`]()+1,r=n[`get${s}Date`]();return 0===Number(n)?(console.warn("date is 1970.01.01"),""):a+"."+pad(o)+"."+pad(r)}async function*iterateAsyncDataSource(e){if(e instanceof Response&&(e=e.body),e instanceof ReadableStream)yield*async function*(e){const t=e.getReader();for(;;){const{done:e,value:n}=await t.read();if(e)break;yield n}}(e);else if(e instanceof Blob)for(const t of function*(e,t=2097152){let n=0;for(;;){const s=e.slice(n,n+t);if(!s.size)break;yield read(s),n+=t}async function read(e){return new Uint8Array(await e.arrayBuffer())}}(e))yield await t}const F=n(!0),{compare:L}=new Intl.Collator(void 0,{numeric:!0,sensitivity:"accent"});function comparator(e,t){return F.value?L(e.name,t.name):0}const R=s((()=>(K.value,[...Q.value.folders.sort(comparator),...Q.value.files.sort(comparator),...Q.value.symlinks.sort(comparator),...Q.value.fifos.sort(comparator),...Q.value.charDevs.sort(comparator),...Q.value.blockDevs.sort(comparator),...Q.value.sockets.sort(comparator)]))),A=s((()=>H.value.length?W.value:R.value)),z=s((()=>A.value.slice(0,1e3))),N=s((()=>W.value.length>1e3?W.value.length:A.value.length)),O=n("");function addMessage(e){O.value=e}function appendMessage(e){O.value+=e}const B=["folder","file","symlink","fifo","charDev","blockDev","socket"];class SimpleEntry{constructor(e,t){this.name=e.name,this.parent=t,this.type=e.type,e.size&&(this._size=e.size),e.mtime&&(this.mtime=e.mtime),e.btime&&(this.btime=e.btime),e.errors&&(this.errors=e.errors),e.pathTo&&(this.pathTo=e.pathTo),e.content&&(this.content=e.content)}addChild(e){this.children||(this.children=[]),this.children.push(e)}addHardlinks(e,t){this.hardlinks=e,this.hardlinksTotal=t}get size(){return"folder"===this.type?-0:this._size||0}get folders(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"folder"===e.type)))||[]}get files(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"file"===e.type)))||[]}get symlinks(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"symlink"===e.type)))||[]}get fifos(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"fifo"===e.type)))||[]}get charDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"charDev"===e.type)))||[]}get blockDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"blockDev"===e.type)))||[]}get sockets(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"socket"===e.type)))||[]}get isEmpty(){var e;return!Boolean(null==(e=this.children)?void 0:e.length)}get hasErrors(){var e;return Boolean(null==(e=this.errors)?void 0:e.length)}get root(){return this.parent?this.parent.root:this}get path(){return this.parent?[...this.parent.path,this]:[this]}}class EntryStreamParser{constructor(){this.rootId=0,this.map=new Map,this.hidMap=new Map}parse(e){var t;let n=!1;for(const s of e){const e=null!=(t=this.map.get(s.pid))?t:null,a=new SimpleEntry(s,e);if("folder"===s.type&&this.map.set(s.id,a),null==e||e.addChild(a),s.hid){const e=this.hidMap.get(s.hid)||[];this.hidMap.set(s.hid,[...e,a])}s.pid===this.rootId&&(n=!0)}return{root:this.map.get(this.rootId),rootUpdated:n}}processHIDMapAsync(){this.hidMap.size&&(console.log("[hidMap]:",this.hidMap),console.time("hidMap"),async function(e){let t=0,n=0;for(const[s,a]of e.entries()){if(!(t++%1e3)){const e=Date.now();e-n>15&&(n=e,await sleep())}const e=Number(s.split(":")[1]);a.forEach((t=>{t.addHardlinks(a,e)}))}}(this.hidMap).then((()=>console.timeEnd("hidMap"))))}}const U=new SimpleEntry({type:"folder",name:"",pid:null},null),H=n("");function clearSearch(){H.value=""}const W=n([]);function setSearchResult(e){W.value=o(e),console.log("globalThis.search:",globalThis.search=e),Object.defineProperty(globalThis.search,"download",{get(){console.log("download")}})}const q=function(e,t=50){let n;return function(){n&&clearTimeout(n),n=setTimeout((()=>{e.apply(this,arguments),n=null}),t)}}(performSearch,300);async function performSearch(){const e=Q.value,t=H.value,n=r(e)?l(e):e,s=performance.now(),a=await async function(e,t){var n;if(!t.startsWith("/"))return findAll(e,(e=>e.name.includes(t)));{const{type:s,word:a}=(null==(n=t.match(/\/type:(?<type>[^\/]+)\/?(?<word>[^\/]*)/))?void 0:n.groups)||{};if(s&&(console.log({type:s,word:a}),B.includes(s)))return findAll(e,(e=>e.type===s&&e.name.includes(a)))}return!1}(n,t);if(!a)return;addMessage(`Search time: ${(performance.now()-s).toFixed(2)} ms; `),await sleep();const o=performance.now(),i=a.sort(comparator);appendMessage(`Sort time: ${(performance.now()-o).toFixed(2)} ms; `),await sleep(),setSearchResult(i),appendMessage(`${a.length} items; search: ${t}`)}async function findAll(e,t){let n=[],s=Date.now();for(const a of function*(e){const t=1e3;let n=[];function*takePart(e){for(const s of e.children||[])"folder"===s.type&&(yield*takePart(s)),n.push(s),n.length===t&&(yield n,n=[])}yield*takePart(e),yield n}(e)){const e=Date.now();e-s>15&&(s=e,await sleep());for(const s of a)t(s)&&n.push(s)}return n}async function*parseScan(e){const t=new EntryStreamParser;let n,s;if(e instanceof Response?n=e.headers.get("content-type"):e instanceof Blob&&(n=e.type),function(e){return Boolean(e.match(/^application\/.*?gzip/))}(n)){console.log("parseGZippedJSONScan");for await(const n of async function*(e){await async function(){if(!J){const e="https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako_inflate.min.js",t="sha256-ZIKs3+RZEULSy0dR6c/mke8V9unZm9vuh05TqvtMdGU=";await function(e,t){return new Promise(((n,s)=>{const a=document.createElement("script");a.onload=n,a.onerror=n=>s({message:"Failed to load script",src:e,integrity:t,event:n}),a.src=e,a.async=!0,t&&(a.integrity=t,a.crossOrigin="anonymous"),document.body.append(a)}))}(e,t),J=!0,console.log("pako is loaded")}}();const t=new TextDecoder,n=new TextParser;let s=0,a=0;for await(const o of async function*(e){let t=[];const n=new pako.Inflate;pako.Inflate.prototype.onData=function(e){t.push(e)};for await(const s of iterateAsyncDataSource(e)){n.push(s);for(const e of t)yield e;t=[]}yield n.result,n.err&&console.error(n.msg)}(e)){if(!(s++%20)){const e=Date.now();e-a>15&&(a=e,await sleep())}const e=t.decode(o,{stream:!0}),r=n.parsePart(e);r.length&&(yield r)}}(e))s||(s=n.shift()),yield{meta:s,...t.parse(n)}}else if(function(e){return Boolean(e.match(/^application\/.*?json/))}(n)){console.log("streamParseJSONScan");for await(const n of async function*(e){const t=new TextDecoder,n=new TextParser;let s=0,a=0;for await(const o of iterateAsyncDataSource(e)){if(!(s++%10)){const e=Date.now();e-a>15&&(a=e,await sleep())}const e=t.decode(o,{stream:!0}),r=n.parsePart(e);r.length&&(yield r)}}(e))s||(s=n.shift()),yield{meta:s,...t.parse(n)}}t.processHIDMapAsync()}a(H,(async(e,t)=>{e?e.length-t.length>1?await performSearch():await q():setSearchResult([])}));class TextParser{constructor(){t(this,"buffer",""),t(this,"startHandled",!1),t(this,"metaLines",[]),t(this,"objects",[])}trimComma(e){return e.endsWith(",")?e.slice(0,-1):e}handleStart(e){if("["!==e)return""===e?(this.objects.push(this.metaLines.join("")),void(this.startHandled=!0)):void this.metaLines.push(e)}handleLine(e,t){t?this.buffer+=e:this.buffer?(this.objects.push(this.buffer+e),this.buffer=""):this.objects.push(e)}parsePart(e){const t=e.endsWith("\n]"),n=e.split("\n");for(let a=0;a<n.length;a++){const e=n[a],s=a===n.length-1;s&&t||(this.startHandled?this.handleLine(e,s):this.handleStart(e,s))}try{const e=JSON.parse(`[${this.trimComma(this.objects.join(""))}]`);return this.objects=[],e}catch(s){throw console.log(`[${this.trimComma(this.objects.join(""))}]`),console.log(this.objects),console.log(this,{isLastPart:t,textPart:e}),s}}}let J=!1;const Z=n(null),G=n(null),K=n(0);async function setScan(e){let t=!1,n=!1;console.time("setScan");for await(const{meta:s,root:a,rootUpdated:r}of parseScan(e))!t&&s&&(Z.value=o(s),t=!0),!n&&a&&(G.value=o(a),globalThis.json=a,openFolder(a),n=!0),r&&(K.value=K.value+1);console.timeEnd("setScan"),clearSearch()}const V=s((()=>{var e;return(null==(e=Z.value)?void 0:e.separator)||"/"})),Y=s((()=>{var e;return(null==(e=Z.value)?void 0:e.path)||[]})),Q=n(U),X=s((()=>Q.value.path));function openFolder(e){clearSearch(),Q.value=o(i(e))}const ee=s((()=>G.value&&Q.value.isEmpty));a(Z,(async(e,t)=>{console.log("[meta]:",Z.value);const{files:n,folders:s,symlinks:a,errors:o,total:r,scanDate:l}=Z.value;Z.value.scanDate&&addMessage(`files: "${n}" folders: "${s}", symlinks: "${a}", errors: "${o}", total: "${r}", scanDate: "${dateToDayDateString(l)}"`)}));c("data-v-48cc0cd2");const te={class:"scanPath"},ne=["title"],se={class:"part"},ae={class:"part spaced"},oe={key:0,class:"spaced separator"};u();const re={setup(e){const t=s((()=>{if(!Z.value)return;const{files:e,folders:t,symlinks:n,charDevs:s,blockDevs:a,fifos:o,sockets:r,total:l,platform:i,scanDate:c}=Z.value;function doString(e){return Object.entries(e).map((([e,t])=>function(e){const t=3-Math.trunc(e.length/4);return e+"\t".repeat(t)}(e)+": "+t)).join("\n")}const u=doString({files:e,folders:t,symlinks:n}),d=doString({charDevs:s,blockDevs:a,fifos:o,sockets:r}),p=doString({total:l,platform:i,scanDate:dateToDayDateString(c)});let f;return f="win32"!==i?[u,d,p].join("\n"):[u,p].join("\n"),console.log(f),f})),n=s((()=>{const e=[...Y.value,Q.value.root.name].join(V.value);return e.startsWith("//")?e.slice(1):e})),a=s((()=>[...n.value].slice(0,-1).join(""))),o=s((()=>[...n.value].slice(-1).join(""))),r=s((()=>X.value.length-1&&"/"!==n.value));function goToRoot(){openFolder(Q.value.root)}return(e,n)=>(d(),p("span",te,[f("span",{class:"parts",onClick:goToRoot,title:i(t)},[f("span",se,h(i(a)),1),f("span",ae,h(i(o)),1)],8,ne),i(r)?(d(),p("span",oe,h(i(V)),1)):v("",!0)]))},__scopeId:"data-v-48cc0cd2"};c("data-v-44b3de2e");const le={class:"opened-folder"},ie={class:"part"},ce={class:"part spaced"},ue={key:0,class:"separator spaced"};u();const de={props:["index","count","entry"],setup(e){const t=e,{index:n,count:a,entry:o}=m(t),r=s((()=>n.value+1===a.value)),l=s((()=>[...o.value.name].slice(0,-1).join(""))),c=s((()=>[...o.value.name].slice(-1).join("")));function onClick(){openFolder(o.value)}return(e,t)=>(d(),p("span",le,[f("span",{class:"parts",onClick:onClick},[f("span",ie,h(i(l)),1),f("span",ce,h(i(c)),1)]),i(r)?v("",!0):(d(),p("span",ue,h(i(V)),1))]))},__scopeId:"data-v-44b3de2e"};c("data-v-f8be0ec4");const pe={class:"box"};u();const fe={props:{maxWidth:{default:"max-content",type:String}},setup:e=>(t,n)=>(d(),p("div",pe,[f("div",{class:"sub",style:g({maxWidth:e.maxWidth})},[y(t.$slots,"default",{},void 0,!0)],4)])),__scopeId:"data-v-f8be0ec4"};c("data-v-55c28eea");const he={class:"address"};u();const ve={setup:e=>(e,t)=>(d(),p("div",he,[b(fe,null,{default:w((()=>[b(re)])),_:1}),(d(!0),p(k,null,S(i(X).slice(1),((e,t)=>(d(),D(fe,null,{default:w((()=>[b(de,{entry:e,index:t,count:i(X).slice(1).length},null,8,["entry","index","count"])])),_:2},1024)))),256))])),__scopeId:"data-v-55c28eea"};c("data-v-25e26c47");const me={style:{display:"contents"}},ye={class:"search"},ge=f("label",{for:"json-scan-search-input",class:"fuck-off-lighthouse"},".",-1);u();const be={setup:e=>(e,t)=>(d(),p("div",me,[f("div",ye,[j(f("input",{id:"json-scan-search-input",type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>x(H)?H.value=e:null)},null,512),[[M,i(H)]]),f("button",{onClick:t[1]||(t[1]=(...e)=>i(clearSearch)&&i(clearSearch)(...e))},"Clear")]),ge])),__scopeId:"data-v-25e26c47"};c("data-v-23a29b76");const we={class:"file-select"},ke=T(" Select file "),Se=f("hr",null,null,-1);u();const De={setup(e){function onChange(e){return setScan(e.target.files[0])}return(e,t)=>(d(),p("div",we,[f("label",null,[ke,f("input",{type:"file",accept:"application/json,application/gzip",onChange:onChange},null,32)]),Se]))},__scopeId:"data-v-23a29b76"};c("data-v-4cf83322");const je={class:"tabs"},Me=f("div",{class:"tab"},null,-1);u();const xe={setup:e=>(e,t)=>(d(),p("div",je,[b(De,{class:"tab"}),Me])),__scopeId:"data-v-4cf83322"};c("data-v-e9f0ab3e");const Te=["title"],_e={class:"icon"},Pe={class:"name"};u();const Ce={props:["entry"],setup(e){const t=m(e).entry,n=s((()=>t.value.hasErrors)),a=s((()=>t.value.hasErrors?JSON.stringify(t.value.errors[0],null," "):"symlink"===t.value.type?t.value.pathTo:void 0)),o=s((()=>"folder"===t.value.type?"📁":"file"===t.value.type?function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return E.includes(t)}(t.value.name)?"🎦":function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return $.includes(t)}(t.value.name)?"🖼":"📄":"symlink"===t.value.type?"🔗":"👾"));function onClick(e){"folder"===t.value.type?(console.log("openFolder",t.value),openFolder(t.value)):console.log(t.value)}function onMousedown(e){1===e.button&&(e.preventDefault(),console.log(t.value,[...Z.value.path,...t.value.path.map((e=>e.name))].join(V.value).replace("//","/")))}return(e,s)=>(d(),p("tr",{class:_(["row",{error:i(n)}]),onClick:onClick,onMousedown:onMousedown,title:i(a)},[f("td",_e,h(i(o)),1),f("td",Pe,h(i(t).name),1)],42,Te))},__scopeId:"data-v-e9f0ab3e"};c("data-v-47520d98");const Ie={key:0,class:"rows"},Ee={key:1,class:"empty-message"},$e=[f("span",null,"The folder is empty.",-1)],Fe={key:2,class:"error-message"},Le=f("h2",null,"Error",-1),Re=f("td",null,"syscall",-1),Ae=f("td",null,"code",-1),ze=f("td",null,"errno",-1);u();const Ne={setup(e){const t=s((()=>!!Q.value.hasErrors&&Q.value.errors[0]));function onContextMenu(e){e.preventDefault(),Q.value.parent&&openFolder(Q.value.parent)}return(e,n)=>(d(),p("div",{class:"content",onContextmenu:onContextMenu},[i(z).length?(d(),p("table",Ie,[(d(!0),p(k,null,S(i(z),(e=>(d(),D(Ce,{entry:e},null,8,["entry"])))),256))])):v("",!0),i(ee)&&!i(t)?(d(),p("div",Ee,$e)):v("",!0),i(t)?(d(),p("div",Fe,[f("div",null,[Le,f("table",null,[f("tr",null,[Re,f("td",null,[f("pre",null,h(i(t).syscall),1)])]),f("tr",null,[Ae,f("td",null,[f("pre",null,h(i(t).code),1)])]),f("tr",null,[ze,f("td",null,[f("pre",null,h(i(t).errno),1)])])])])])):v("",!0)],32))},__scopeId:"data-v-47520d98"},Oe={setup:e=>(e,t)=>(d(),p("div",null,"Item count: "+h(i(N)),1))},Be={key:0},Ue={key:1},He={setup:e=>(e,t)=>i(O)?(d(),p("span",Be,h(i(O)),1)):(d(),p("span",Ue,"_"))};c("data-v-602ec060");const We={class:"main"},qe=f("div",{style:{"grid-area":"switch"}},null,-1);u();const Je={setup:e=>(P((async()=>{const e=new URL(location.href).searchParams.get("filepath");if(e){return setScan(await fetch(e))}})),(e,t)=>(d(),p("div",We,[qe,b(ve,{style:{"grid-area":"address"}}),b(be,{style:{"grid-area":"search"}}),b(xe,{style:{"grid-area":"tabs"}}),b(Ne,{style:{"grid-area":"content"}}),b(Oe,{style:{"grid-area":"status"}}),b(He,{style:{"grid-area":"debug"}})]))),__scopeId:"data-v-602ec060"};C({setup:e=>(e,t)=>(d(),D(Je))}).mount("#app");
//# sourceMappingURL=index.js.map
