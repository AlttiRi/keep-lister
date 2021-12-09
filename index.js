var e=Object.defineProperty,t=("undefined"!=typeof require&&require,(t,a,n)=>(((t,a,n)=>{a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[a]=n})(t,"symbol"!=typeof a?a+"":a,n),n));import{r as a,c as n,i as s,t as o,w as r,a as i,m as l,u as c,p as u,b as d,o as p,d as h,e as f,f as v,g as m,h as g,j as y,n as b,k as S,l as w,F as k,q as z,s as D,v as T,x as M,y as j,z as x,A as _,B as C,C as $,D as P,E as I,G as E,H as L}from"./vendor.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))processPreload(e);new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&processPreload(e)})).observe(document,{childList:!0,subtree:!0})}function processPreload(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const W=globalThis.setImmediate||function(){const{port1:e,port2:t}=new MessageChannel,a=[];return e.onmessage=function(){a.shift()()},function(e){t.postMessage(null),a.push(e)}}();function sleep(e){return new Promise(void 0===e?e=>W(e):t=>setTimeout(t,e))}const R=["mp4","webm","mkv","avi"];const O=["png","jpg","jpeg","gif","tiff","webp"];function dateToDayDateString(e,t=!0){const a=new Date(e);function pad2(e){return e.toString().padStart(2,"0")}"Invalid Date"===a.toString()&&console.warn("Invalid Date value: ",e);const n=t?"UTC":"",s=a[`get${n}FullYear`](),o=a[`get${n}Month`]()+1,r=a[`get${n}Date`]();return s+"."+pad2(o)+"."+pad2(r)}function dateToDayDateTimeString(e,t=!0){const a=new Date(e);function pad2(e){return e.toString().padStart(2,"0")}const n=t?"UTC":"",s=a[`get${n}Hours`](),o=a[`get${n}Minutes`](),r=a[`get${n}Seconds`](),i=pad2(s)+":"+pad2(o)+":"+pad2(r);return dateToDayDateString(a,t)+" "+i+(t?"Z":"")}async function*iterateAsyncDataSource(e){if(e instanceof Response&&(e=e.body),e instanceof ReadableStream)yield*async function*(e){const t=e.getReader();for(;;){const{done:e,value:a}=await t.read();if(e)break;yield a}}(e);else if(e instanceof Blob)for(const t of function*(e,t=2097152){let a=0;for(;;){const n=e.slice(a,a+t);if(!n.size)break;yield read(n),a+=t}async function read(e){return new Uint8Array(await e.arrayBuffer())}}(e))yield await t}function bytesToSizeWinLike(e){if(e<1024)return e+" B";let t=Math.floor(Math.log(e)/Math.log(1024)),a=e/Math.pow(1024,t);return a>=1e3&&(t++,a/=1024),function(e){let t;e<10?t=Math.trunc(100*e)/100:e<100?t=Math.trunc(10*e)/10:e<1e3&&(t=Math.trunc(e));if(e<.1)return t.toPrecision(1);if(e<1)return t.toPrecision(2);return t.toPrecision(3)}(a)+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][t]}const B=a(!0),A=a("name"),N=a({name:!1,size:!1,mtime:!1}),F=n((()=>N.value[A.value]));function toggleOrder(){N.value[A.value]=!N.value[A.value]}const{compare:U}=new Intl.Collator(void 0,{numeric:!0,sensitivity:"accent"});function comparator(e,t){const a=F.value?-1:1;if(B.value){if("name"===A.value)return U(e.name,t.name)*a;if("size"===A.value)return(e.size-t.size)*a;if("mtime"===A.value)return(e.mtime-t.mtime)*a}return 0}const H=n((()=>(oe.value,[...le.value.folders.sort(comparator),...le.value.files.sort(comparator),...le.value.symlinks.sort(comparator),...le.value.fifos.sort(comparator),...le.value.charDevs.sort(comparator),...le.value.blockDevs.sort(comparator),...le.value.sockets.sort(comparator)]))),Z=a(50),q=n((()=>X.value.length?ee.value:H.value)),G=n((()=>q.value.slice(0,Z.value))),J=n((()=>ee.value.length>Z.value?ee.value.length:q.value.length)),K=a(null),V=a("");function addMessage(e){V.value=e}function appendMessage(e){V.value+=e}function debugMessageFromEntry(e){var t;if(console.log(s(e)?"Proxy:":"Raw:",o(e)),e.hasErrors)V.value="";else{const a='"'+e.name.slice(0,20)+(e.name.length<20?"":"...")+'"';let n="";n+=`mtime "${dateToDayDateTimeString(e.mtime,!1)}"`,n+=` —  btime "${dateToDayDateTimeString(null!=(t=e.btime)?t:0,!1)}"`,n+=` — ${a} — ${e.size} (${bytesToSizeWinLike(e.size)})`,V.value=n}}const Y=["folder","file","symlink","fifo","charDev","blockDev","socket"];class SimpleEntry{constructor(e,t,a){this.name=e.name,this.parent=t,this.type=e.type,e.size&&(this._size=e.size),e.mtime&&(this.mtime=e.mtime),e.btime&&(this.btime=e.btime),e.errors&&(this.errors=e.errors.map((e=>a.get(e)))),e.pathTo&&(this.pathTo=e.pathTo),e.content&&(this.content=e.content)}addChild(e){this.children||(this.children=[]),this.children.push(e),this.increaseContentSize(e.size)}addHardlinks(e,t){this.hardlinks=e,this.hardlinksTotal=t}increaseContentSize(e){e&&(this._contentSize||(this._contentSize=0),this._contentSize+=e,this.parent&&e&&this.parent.increaseContentSize(e))}get size(){return"folder"===this.type?this._contentSize||0:this._size||0}get folders(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"folder"===e.type)))||[]}get files(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"file"===e.type)))||[]}get symlinks(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"symlink"===e.type)))||[]}get fifos(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"fifo"===e.type)))||[]}get charDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"charDev"===e.type)))||[]}get blockDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"blockDev"===e.type)))||[]}get sockets(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"socket"===e.type)))||[]}get isEmpty(){var e;return!Boolean(null==(e=this.children)?void 0:e.length)}get hasErrors(){var e;return Boolean(null==(e=this.errors)?void 0:e.length)}get root(){return this.parent?this.parent.root:this}get path(){return this.parent?[...this.parent.path,this]:[this]}}class EntryStreamParser{constructor(){this.rootId=0,this.map=new Map,this.hidMap=new Map}setMeta(e){this.meta=e;const t=e.errorsMap;t&&(this.errorsIDMap=new Map(Object.entries(t).map((([e,t])=>{const[a,n,s]=e.split(":");return[t,{code:a,syscall:n,errno:Number(s)}]}))))}parse(e){var t;let a=!1;for(const n of e){const e=null!=(t=this.map.get(n.pid))?t:null,s=new SimpleEntry(n,e,this.errorsIDMap);if("folder"===n.type&&this.map.set(n.id,s),null==e||e.addChild(s),n.hid){const e=this.hidMap.get(n.hid)||[];this.hidMap.set(n.hid,[...e,s])}n.pid===this.rootId&&(a=!0)}return{root:this.map.get(this.rootId),rootUpdated:a}}processHIDMapAsync(){this.hidMap.size&&(console.log("[hidMap]:",this.hidMap),console.time("hidMap"),async function(e){let t=0,a=0;for(const[n,s]of e.entries()){if(!(t++%1e3)){const e=Date.now();e-a>15&&(a=e,await sleep())}const e=Number(n.split(":")[1]);s.forEach((t=>{t.addHardlinks(s,e)}))}}(this.hidMap).then((()=>console.timeEnd("hidMap"))))}}const Q=new SimpleEntry({type:"folder",name:"",pid:null},null),X=a("");function clearSearch(){X.value=""}const ee=a([]);function setSearchResult(e){const t=o(e);ee.value=t,Z.value=50,function(e){globalThis.search=e,console.log("globalThis.search:",e),Object.defineProperty(globalThis.search,"download",{get(){console.log("download")}}),Object.defineProperty(globalThis.search,"names",{get:()=>globalThis.search.map((e=>e.name))}),Object.defineProperty(globalThis.search,"namelist",{get:()=>globalThis.search.map((e=>e.name)).join("\n")})}(t)}r([A,F],(()=>{ee.value.length&&(console.time("sort searchResult"),ee.value=ee.value.sort(comparator),console.timeEnd("sort searchResult"))}));const te=function(e,t=50){let a;return function(){a&&clearTimeout(a),a=setTimeout((()=>{e.apply(this,arguments),a=null}),t)}}(performSearch,300);async function performSearch(){const e=le.value,t=X.value,a=i(e)?o(e):e,n=performance.now(),s=await async function(e,t){var a,n,s,o;if(t.startsWith("//"))return justSearch(t.slice(2));if(["https://","http://"].some((e=>t.startsWith(e)))){const e=new URL(t),s=e.pathname.length>1&&e.pathname.endsWith("/"),o=null==(a=(s?e.pathname.slice(0,-1):e.pathname).match(/[^\/]+$/))?void 0:a[0];if(!o)return[];const{name:r,ext:i}=(null==(n=o.match(/(?<name>.+)(\.(?<ext>.+))$/))?void 0:n.groups)||{name:o},l=r+(s&&i?`.${i}`:""),c=await justSearch(l);return Object.defineProperty(c,"customSearchText",{value:l}),c}if(t.startsWith("/size")){const{size:a,plus:n,plusRange:o,range:r}=(null==(s=t.match(/\/size[:\/](?<size>\d+)(\+(?<plus>(\d+)|(-\d+))|~(?<plusRange>\d+)|-(?<range>\d+))?/))?void 0:s.groups)||{};if(a){let t,s;console.log({size:a,plus:n,plusRange:o,range:r});const i=Number(a);if(n){const a=i+Number(n),{min:o,max:r}=i<a?{min:i,max:a}:{min:a,max:i};t=`Size search from ${bytesToSizeWinLike(o)} to ${bytesToSizeWinLike(r)}`,s=await findAll(e,(e=>e.size>=o&&e.size<=r))}else if(r){const a=Number(r),{min:n,max:o}=i<a?{min:i,max:a}:{min:a,max:i};t=`Size search from ${bytesToSizeWinLike(n)} to ${bytesToSizeWinLike(o)}`,s=await findAll(e,(e=>e.size>=n&&e.size<=o))}else if(o){const a=i-Number(o),n=i+Number(o);t=`Size search from ${bytesToSizeWinLike(a)} to ${bytesToSizeWinLike(n)}`,s=await findAll(e,(e=>e.size>=a&&e.size<=n))}else t=`Size search ${bytesToSizeWinLike(i)}`,s=await findAll(e,(e=>e.size===i));return console.log(...function(e){return[`%c${e}`,"color: #2196f3; font-weight: bold;"]}(t)),Object.defineProperty(s,"customSearchText",{value:t}),s}console.log("no size to search")}if(t.startsWith("/")){const{type:a,word:n}=(null==(o=t.match(/\/type:(?<type>[^\/]+)\/?(?<word>[^\/]*)/))?void 0:o.groups)||{};if(a&&(console.log({type:a,word:n}),Y.includes(a)))return findAll(e,(e=>e.type===a&&e.name.includes(n)))}else if(t.includes(" ")){const e=t.split(" ").filter((e=>e));if(e.length>1){let t,a=await justSearch(e.shift());for(;t=e.shift();)a=a.filter((e=>e.name.includes(t)));return a}}return justSearch(t);function justSearch(t){return findAll(e,(e=>e.name.includes(t)))}}(a,t);if(!s)return;addMessage(`Search time: ${(performance.now()-n).toFixed(2)} ms; `),await sleep();const r=performance.now(),l=s.sort(comparator);appendMessage(`Sort time: ${(performance.now()-r).toFixed(2)} ms; `),await sleep(),console.time("search result size computing");const c=new Set(s),u=s.reduce(((e,t)=>computeEntrySize(t,c)+e),0),d=s.filter((e=>"folder"!==e.type)).reduce(((e,t)=>t.size+e),0);console.timeEnd("search result size computing"),console.log(u,d),setSearchResult(l);const p=s.customSearchText||t;appendMessage(`${s.length} items; size: ${bytesToSizeWinLike(d)} (${bytesToSizeWinLike(u)});  search: ${p}`)}function computeEntrySize(e,t){if("folder"!==e.type)return e.size;let a=0;for(const n of e.children||[])t.has(n)||("folder"===n.type?a+=computeEntrySize(n,t):a+=n.size);return a}async function findAll(e,t){let a=[],n=Date.now();for(const s of function*(e){const t=1e3;let a=[];function*takePart(e){for(const n of e.children||[])"folder"===n.type&&(yield*takePart(n)),a.push(n),a.length===t&&(yield a,a=[])}yield*takePart(e),yield a}(e)){const e=Date.now();e-n>15&&(n=e,await sleep());for(const n of s)t(n)&&a.push(n)}return a}async function*parseScan(e){const t=new EntryStreamParser;let a,n;if(e instanceof Response?a=e.headers.get("content-type"):e instanceof Blob&&(a=e.type),function(e){return Boolean(e.match(/^application\/.*?gzip/))}(a)){console.log("parseGZippedJSONScan");for await(const a of async function*(e){const t=new TextDecoder,a=new TextParser;let n=0,s=0;for await(const o of async function*(e){ae||await async function(){if(!ae){const e="https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako_inflate.min.js",t="sha256-ZIKs3+RZEULSy0dR6c/mke8V9unZm9vuh05TqvtMdGU=";await function(e,t){return new Promise(((a,n)=>{const s=document.createElement("script");s.onload=a,s.onerror=a=>n({message:"Failed to load script",src:e,integrity:t,event:a}),s.src=e,s.async=!0,t&&(s.integrity=t,s.crossOrigin="anonymous"),document.body.append(s)}))}(e,t),ae=!0,console.log("pako is loaded")}}();let t=[];const a=new pako.Inflate;pako.Inflate.prototype.onData=function(e){t.push(e)};for await(const n of iterateAsyncDataSource(e)){a.push(n);for(const e of t)yield e;t=[]}yield a.result,a.err&&console.error(a.msg)}(e)){if(!(n++%20)){const e=Date.now();e-s>15&&(s=e,await sleep())}const e=t.decode(o,{stream:!0}),r=a.parsePart(e);r.length&&(yield r)}}(e))n||(n=a.shift(),t.setMeta(n)),yield{meta:n,...t.parse(a)}}else if(function(e){return Boolean(e.match(/^application\/.*?json/))}(a)){console.log("streamParseJSONScan");for await(const a of async function*(e){const t=new TextDecoder,a=new TextParser;let n=0,s=0;for await(const o of iterateAsyncDataSource(e)){if(!(n++%10)){const e=Date.now();e-s>15&&(s=e,await sleep())}const e=t.decode(o,{stream:!0}),r=a.parsePart(e);r.length&&(yield r)}}(e))n||(n=a.shift(),t.setMeta(n)),yield{meta:n,...t.parse(a)}}t.processHIDMapAsync()}r(X,(async(e,t)=>{e?e.length-t.length>1?await performSearch():await te():setSearchResult([])}));class TextParser{constructor(){t(this,"buffer",""),t(this,"startHandled",!1),t(this,"metaLines",[]),t(this,"objects",[])}trimComma(e){return e.endsWith(",")?e.slice(0,-1):e}handleStart(e){if("["!==e)return""===e?(this.objects.push(this.metaLines.join("")),void(this.startHandled=!0)):void this.metaLines.push(e)}handleLine(e,t){t?this.buffer+=e:this.buffer?(this.objects.push(this.buffer+e),this.buffer=""):this.objects.push(e)}parsePart(e){const t=e.endsWith("\n]"),a=e.split("\n");for(let s=0;s<a.length;s++){const e=a[s],n=s===a.length-1;n&&t||(this.startHandled?this.handleLine(e,n):this.handleStart(e,n))}try{const e=JSON.parse(`[${this.trimComma(this.objects.join(""))}]`);return this.objects=[],e}catch(n){throw console.log(`[${this.trimComma(this.objects.join(""))}]`),console.log(this.objects),console.log(this,{isLastPart:t,textPart:e}),n}}}let ae=!1;const ne=a(null),se=a(null),oe=a(0);async function setScan(e){let t=!1,a=!1;console.time("setScan");let n=Date.now();for await(const{meta:s,root:o,rootUpdated:r}of parseScan(e)){!t&&s&&(ne.value=l(s),t=!0),!a&&o&&(se.value=l(o),globalThis.json=o,openFolder(o),a=!0);const e=Date.now();(r||e-n>50)&&(n=e,oe.value++,await sleep())}oe.value++,console.timeEnd("setScan"),clearSearch()}const re=n((()=>{var e;return(null==(e=ne.value)?void 0:e.separator)||"/"})),ie=n((()=>{var e;return(null==(e=ne.value)?void 0:e.path)||[]})),le=a(Q),ce=n((()=>le.value.path));function openFolder(e){clearSearch(),le.value=l(c(e)),Z.value=50,globalThis.folder=e,console.log("globalThis.folder:",e)}const ue=n((()=>se.value&&le.value.isEmpty));r(ne,(async(e,t)=>{console.log("[meta]:",ne.value);const{files:a,folders:n,symlinks:s,errors:o,total:r,scanDate:i}=ne.value;ne.value.scanDate&&addMessage(`files: "${a}" folders: "${n}", symlinks: "${s}", errors: "${o}", total: "${r}", scanDate: "${dateToDayDateString(i)}"`)}));u("data-v-7487a6bd");const de={class:"scanPath"},pe=["title"],he={class:"part"},fe={class:"part spaced"},ve={key:0,class:"spaced separator"};d();const me={setup(e){const t=n((()=>{if(!ne.value)return;const{files:e,folders:t,symlinks:a,charDevs:n,blockDevs:s,fifos:o,sockets:r,total:i,platform:l,scanDate:c}=ne.value;function doString(e){return Object.entries(e).map((([e,t])=>function(e){const t=3-Math.trunc(e.length/4);return e+"\t".repeat(t)}(e)+": "+t)).join("\n")}const u=doString({files:e,folders:t,symlinks:a}),d=doString({charDevs:n,blockDevs:s,fifos:o,sockets:r}),p=doString({total:i,platform:l,scanDate:dateToDayDateString(c)});let h;return h="win32"!==l?[u,d,p].join("\n"):[u,p].join("\n"),console.log(h),h})),a=n((()=>{var e;const t=[...ie.value,le.value.root.name].join(re.value);return t.startsWith("//")?t.slice(1):"win32"===(null==(e=ne.value)?void 0:e.platform)?t[0].toUpperCase()+t.slice(1):t})),s=n((()=>[...a.value].slice(0,-1).join(""))),o=n((()=>[...a.value].slice(-1).join(""))),r=n((()=>ce.value.length-1&&"/"!==a.value));function goToRoot(){const e=le.value.root;debugMessageFromEntry(e),openFolder(e)}return(e,a)=>(p(),h("span",de,[f("span",{class:"parts",onClick:goToRoot,title:c(t)},[f("span",he,v(c(s)),1),f("span",fe,v(c(o)),1)],8,pe),c(r)?(p(),h("span",ve,v(c(re)),1)):m("",!0)]))},__scopeId:"data-v-7487a6bd"};u("data-v-3c8242f7");const ge={class:"opened-folder"},ye={class:"part"},be={class:"part spaced"},Se={key:0,class:"separator spaced"};d();const we={props:["index","count","entry"],setup(e){const t=e,{index:a,count:s,entry:o}=g(t),r=n((()=>a.value+1===s.value)),i=n((()=>[...o.value.name].slice(0,-1).join(""))),l=n((()=>[...o.value.name].slice(-1).join("")));function onClick(){debugMessageFromEntry(o.value),openFolder(o.value)}return(e,t)=>(p(),h("span",ge,[f("span",{class:"parts",onClick:onClick},[f("span",ye,v(c(i)),1),f("span",be,v(c(l)),1)]),c(r)?m("",!0):(p(),h("span",Se,v(c(re)),1))]))},__scopeId:"data-v-3c8242f7"};u("data-v-f8be0ec4");const ke={class:"box"};d();const ze={props:{maxWidth:{default:"max-content",type:String}},setup:e=>(t,a)=>(p(),h("div",ke,[f("div",{class:"sub",style:b({maxWidth:e.maxWidth})},[y(t.$slots,"default",{},void 0,!0)],4)])),__scopeId:"data-v-f8be0ec4"};const De={setup(e){async function onContextmenu(e){e.preventDefault();const t=[...ne.value.path,...le.value.path.map((e=>e.name))].join(re.value);console.log("Copy to clipboard:",t),await navigator.clipboard.writeText(t)}return(e,t)=>(p(),h("div",{class:"address",onContextmenu:onContextmenu},[S(ze,null,{default:w((()=>[S(me)])),_:1}),(p(!0),h(k,null,z(c(ce).slice(1),((e,t)=>(p(),D(ze,null,{default:w((()=>[S(we,{entry:e,index:t,count:c(ce).slice(1).length},null,8,["entry","index","count"])])),_:2},1024)))),256))],32))},__scopeId:"data-v-304c3618"};u("data-v-7cf12500");const Te={class:"search-wrapper"},Me={class:"search"},je=f("label",{for:"json-scan-search-input",class:"fuck-off-lighthouse"},".",-1);d();const xe={setup(e){const t=a();function onClearClick(){clearSearch(),t.value.focus()}return(e,a)=>(p(),h("div",Te,[f("div",Me,[T(f("input",{id:"json-scan-search-input",type:"text","onUpdate:modelValue":a[0]||(a[0]=e=>j(X)?X.value=e:null),ref:(e,a)=>{a.inputRef=e,t.value=e}},null,512),[[M,c(X)]]),f("button",{onClick:onClearClick},"Clear")]),je]))},__scopeId:"data-v-7cf12500"};u("data-v-23a29b76");const _e={class:"file-select"},Ce=x(" Select file "),$e=f("hr",null,null,-1);d();const Pe={setup(e){function onChange(e){return setScan(e.target.files[0])}return(e,t)=>(p(),h("div",_e,[f("label",null,[Ce,f("input",{type:"file",accept:"application/json,application/gzip",onChange:onChange},null,32)]),$e]))},__scopeId:"data-v-23a29b76"};u("data-v-4cf83322");const Ie={class:"tabs"},Ee=f("div",{class:"tab"},null,-1);d();const Le={setup:e=>(e,t)=>(p(),h("div",Ie,[S(Pe,{class:"tab"}),Ee])),__scopeId:"data-v-4cf83322"};u("data-v-f3203ed6");const We=["title"],Re={class:"icon"},Oe={class:"name"},Be={class:"mtime"};d();const Ae={props:["entry"],setup(e){const t=e,a=n((()=>(oe.value,o.value.hasErrors?"":bytesToSizeWinLike(o.value.size)))),s=n((()=>"0 B"===a.value?"Z":a.value.split(" ")[1])),o=g(t).entry,r=n((()=>o.value.hasErrors)),i=n((()=>{if(void 0===o.value.mtime)return"";return dateToDayDateTimeString(o.value.mtime,!1).slice(0,-3)})),l=n((()=>o.value.hasErrors?JSON.stringify(o.value.errors[0],null," "):"symlink"===o.value.type?o.value.pathTo:void 0)),u=n((()=>"folder"===o.value.type?"📁":"file"===o.value.type?function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return R.includes(t)}(o.value.name)?"🎦":function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return O.includes(t)}(o.value.name)?"🖼":"📄":"symlink"===o.value.type?"🔗":"👾"));function onClick(e){debugMessageFromEntry(o.value),"folder"===o.value.type&&openFolder(o.value)}function onMousedown(e){1===e.button&&(e.preventDefault(),console.log(o.value,[...ne.value.path,...o.value.path.map((e=>e.name))].join(re.value).replace("//","/")),le.value!==o.value.parent&&openFolder(o.value.parent))}function onMouseover(e){K.value=o.value}function onMouseleave(e){K.value=null}return(e,t)=>(p(),h("tr",{class:_(["row",{error:c(r)}]),onClick:onClick,onMousedown:onMousedown,onMouseover:onMouseover,onMouseleave:onMouseleave,title:c(l)},[f("td",Re,v(c(u)),1),f("td",Oe,v(c(o).name),1),f("td",{class:_(["size",c(s)])},v(c(a)),3),f("td",Be,v(c(i)),1)],42,We))},__scopeId:"data-v-f3203ed6"};const Ne={setup(e){const t=new IntersectionObserver((e=>{const[t]=e;t.isIntersecting&&J.value>Z.value&&(Z.value=Z.value+50)})),n=a(null);return C((()=>{t.observe(n.value)})),$((()=>{t.disconnect()})),(e,t)=>(p(),h("div",{class:"intersection",ref:(e,t)=>{t.intersection=e,n.value=e}},null,512))},__scopeId:"data-v-5baedc86"};u("data-v-d2171e22");const Fe={key:0,class:"rows"},Ue={key:1,class:"empty-message"},He=[f("span",null,"The folder is empty.",-1)],Ze={key:2,class:"error-message"},qe=f("h2",null,"Error",-1),Ge=f("td",null,"syscall",-1),Je=f("td",null,"code",-1),Ke=f("td",null,"errno",-1);d();const Ve={setup(e){P((e=>({"78b3c76e":s.value})));const t=n((()=>!!le.value.hasErrors&&le.value.errors[0]));function onContextMenu(e){e.preventDefault(),le.value.parent&&openFolder(le.value.parent)}const s=a("880px");return C((()=>{const e=document.body.offsetWidth;if(e<1280){let t=880-(1280-e);t=t<140?140:t,s.value=`${t}px`}})),(e,a)=>(p(),h("div",{class:"content",onContextmenu:onContextMenu},[c(G).length?(p(),h("table",Fe,[f("tbody",null,[(p(!0),h(k,null,z(c(G),(e=>(p(),D(Ae,{entry:e},null,8,["entry"])))),256)),S(Ne)])])):m("",!0),c(ue)&&!c(t)?(p(),h("div",Ue,He)):m("",!0),c(t)?(p(),h("div",Ze,[f("div",null,[qe,f("table",null,[f("tr",null,[Ge,f("td",null,[f("pre",null,v(c(t).syscall),1)])]),f("tr",null,[Je,f("td",null,[f("pre",null,v(c(t).code),1)])]),f("tr",null,[Ke,f("td",null,[f("pre",null,v(c(t).errno),1)])])])])])):m("",!0)],32))},__scopeId:"data-v-d2171e22"};u("data-v-08ca63fc");const Ye={class:"status"};d();const Qe={setup(e){const t=n((()=>{var e;return(null==(e=K.value)?void 0:e.size)&&bytesToSizeWinLike(K.value.size)}));return(e,a)=>(p(),h("div",Ye,[f("span",null,"Items count: "+v(c(J)),1),T(f("span",null,". Hover item's size: "+v(c(t)),513),[[I,c(K)]])]))},__scopeId:"data-v-08ca63fc"};u("data-v-148ea483");const Xe={class:"switch"};d();const et={setup(e){function onN(){"name"===A.value&&toggleOrder(),A.value="name"}function onS(){"size"===A.value&&toggleOrder(),A.value="size"}function onD(){"mtime"===A.value&&toggleOrder(),A.value="mtime"}return(e,t)=>(p(),h("div",Xe,[f("button",{class:_(["order-by-name",{active:"name"===c(A)}]),title:"Order by name",onClick:onN},v(c(N).name?"N":"n"),3),f("button",{class:_(["order-by-size",{active:"size"===c(A)}]),title:"Order by size",onClick:onS},v(c(N).size?"S":"s"),3),f("button",{class:_(["order-by-date",{active:"mtime"===c(A)}]),title:"Order by date",onClick:onD},v(c(N).mtime?"D":"d"),3)]))},__scopeId:"data-v-148ea483"};u("data-v-16910406");const tt={class:"debug"},at={key:0},nt={key:1};d();const st={setup:e=>(e,t)=>(p(),h("div",tt,[c(V)?(p(),h("span",at,v(c(V)),1)):(p(),h("span",nt,"_"))])),__scopeId:"data-v-16910406"};const ot={};u("data-v-3edb4d5c");const rt={class:"guide"},it=[E('<div class="text-wrapper" data-v-3edb4d5c><h2 data-v-3edb4d5c>No scan selected</h2><div data-v-3edb4d5c>Use you own directory scan file (created with <a href="https://github.com/AlttiRi/directory-snapshot-explorer#how-to-use" target="_blank" data-v-3edb4d5c>the scanner</a>). </div><div class="" data-v-3edb4d5c>Or use the demo scans to take a look at the program work: <ul data-v-3edb4d5c><li data-v-3edb4d5c><a href="./?filepath=https://alttiri.github.io/json-flat-scans/windows-admin.json.gz" data-v-3edb4d5c>Win 10 scan (as Admin)</a></li><li data-v-3edb4d5c><a href="./?filepath=https://alttiri.github.io/json-flat-scans/ubuntu-admin.json.gz" data-v-3edb4d5c>Ubuntu scan (as Root)</a></li><li data-v-3edb4d5c><a href="./?filepath=https://alttiri.github.io/json-flat-scans/linux-master.json.gz" data-v-3edb4d5c>Linux Source Code scan</a></li></ul></div><div data-v-3edb4d5c>For more info see the <a href="https://github.com/AlttiRi/directory-snapshot-explorer#directory-snapshot-explorer" target="_blank" data-v-3edb4d5c>Readme</a>.</div></div>',1)];d(),ot.render=function(e,t){return p(),h("div",rt,it)},ot.__scopeId="data-v-3edb4d5c";u("data-v-54f6b6b8");const lt={class:"main"};d();const ct={setup(e){const t=n((()=>!ne.value&&!new URL(location.href).searchParams.get("filepath")));return C((async()=>{const e=new URL(location.href),t=e.searchParams.get("filepath");if(t){const e=await fetch(t);await setScan(e)}const a=e.searchParams.get("search");a&&(X.value=a)})),(e,a)=>(p(),h("div",lt,[S(et,{style:{"grid-area":"switch"}}),S(De,{style:{"grid-area":"address"}}),S(xe,{style:{"grid-area":"search"}}),S(Le,{style:{"grid-area":"tabs"}}),c(t)?(p(),D(ot,{key:0,style:{"grid-area":"content"}})):(p(),D(Ve,{key:1,style:{"grid-area":"content"}})),S(Qe,{style:{"grid-area":"status"}}),S(st,{style:{"grid-area":"debug"}})]))},__scopeId:"data-v-54f6b6b8"};L({setup:e=>(e,t)=>(p(),D(ct))}).mount("#app");
//# sourceMappingURL=index.js.map
