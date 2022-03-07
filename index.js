var e=Object.defineProperty,__publicField=(t,a,n)=>(((t,a,n)=>{a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[a]=n})(t,"symbol"!=typeof a?a+"":a,n),n);import{r as t,c as a,i as n,t as s,w as o,a as r,m as i,u as l,o as c,b as u,d,e as p,f as h,g as f,h as m,n as v,j as g,k as y,F as b,l as S,p as w,q as k,v as z,s as x,x as M,y as T,z as D,A as j,B as _,C,D as $,E as P,G as E,H as I}from"./vendor.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))processPreload(e);new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&processPreload(e)})).observe(document,{childList:!0,subtree:!0})}function processPreload(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const B=globalThis.setImmediate||function(){const{port1:e,port2:t}=new MessageChannel,a=[];return e.onmessage=function(){a.shift()()},function(e){t.postMessage(null),a.push(e)}}();function sleep(e){return new Promise(void 0===e?e=>B(e):t=>setTimeout(t,e))}const L=["mp4","webm","mkv","avi"];const W=["png","jpg","jpeg","gif","tiff","webp"];function dateToDayDateString(e,t=!0){const a=new Date(e);function pad2(e){return e.toString().padStart(2,"0")}"Invalid Date"===a.toString()&&console.warn("Invalid Date value: ",e);const n=t?"UTC":"",s=a[`get${n}FullYear`](),o=a[`get${n}Month`]()+1,r=a[`get${n}Date`]();return s+"."+pad2(o)+"."+pad2(r)}function dateToDayDateTimeString(e,t=!0){const a=new Date(e);function pad2(e){return e.toString().padStart(2,"0")}const n=t?"UTC":"",s=a[`get${n}Hours`](),o=a[`get${n}Minutes`](),r=a[`get${n}Seconds`](),i=pad2(s)+":"+pad2(o)+":"+pad2(r);return dateToDayDateString(a,t)+" "+i+(t?"Z":"")}async function*iterateAsyncDataSource(e){if(e instanceof Response&&(e=e.body),e instanceof ReadableStream)yield*async function*(e){const t=e.getReader();for(;;){const{done:e,value:a}=await t.read();if(e)break;yield a}}(e);else if(e instanceof Blob)for(const t of function*(e,t=2097152){let a=0;for(;;){const n=e.slice(a,a+t);if(!n.size)break;yield read(n),a+=t}async function read(e){return new Uint8Array(await e.arrayBuffer())}}(e))yield await t}function bytesToSize(e,t=2){if(0===e)return"0 B";t=t<0?0:t;const a=Math.floor(Math.log(e)/Math.log(1024));return Number.parseFloat((e/Math.pow(1024,a)).toFixed(t))+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][a]}function bytesToSizeWinLike(e){if(e<1024)return e+" B";let t=Math.floor(Math.log(e)/Math.log(1024)),a=e/Math.pow(1024,t);return a>=1e3&&(t++,a/=1024),function(e){let t;e<10?t=Math.trunc(100*e)/100:e<100?t=Math.trunc(10*e)/10:e<1e3&&(t=Math.trunc(e));if(e<.1)return t.toPrecision(1);if(e<1)return t.toPrecision(2);return t.toPrecision(3)}(a)+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][t]}const R=t(!0),A=t("name"),O=t({name:!1,size:!1,mtime:!1}),F=a((()=>O.value[A.value]));const{compare:N}=new Intl.Collator(void 0,{numeric:!0,sensitivity:"accent"});function comparator(e,t){const a=F.value?-1:1;if(R.value){if("name"===A.value)return N(e.name,t.name)*a;if("size"===A.value)return(e.size-t.size)*a;if("mtime"===A.value)return(e.mtime-t.mtime)*a}return 0}const U=a((()=>(se.value,[...ie.value.folders.sort(comparator),...ie.value.files.sort(comparator),...ie.value.symlinks.sort(comparator),...ie.value.fifos.sort(comparator),...ie.value.charDevs.sort(comparator),...ie.value.blockDevs.sort(comparator),...ie.value.sockets.sort(comparator)]))),H=t(50),Z=a((()=>Q.value.length?X.value:U.value)),G=a((()=>Z.value.slice(0,H.value))),J=a((()=>X.value.length>H.value?X.value.length:Z.value.length)),K=t(null),q=t("");function addMessage(e){q.value=e}function appendMessage(e){q.value+=e}function debugMessageFromEntry(e){var t;if(console.log(n(e)?"Proxy:":"Raw:",s(e)),e.hasErrors)q.value="";else{const a='"'+e.name.slice(0,20)+(e.name.length<20?"":"...")+'"';let n="";n+=`mtime "${dateToDayDateTimeString(e.mtime,!1)}"`,n+=` —  btime "${dateToDayDateTimeString(null!=(t=e.btime)?t:0,!1)}"`,n+=` — ${a} — ${e.size} (${bytesToSizeWinLike(e.size)})`,q.value=n}}const Y=["folder","file","symlink","fifo","charDev","blockDev","socket"];class SimpleEntry{constructor(e,t,a){this.name=e.name,this.parent=t,this.type=e.type,e.size&&(this._size=e.size),e.mtime&&(this.mtime=e.mtime),e.btime&&(this.btime=e.btime),e.errors&&(this.errors=e.errors.map((e=>a.get(e)))),e.pathTo&&(this.pathTo=e.pathTo),e.content&&(this.content=e.content)}addChild(e){this.children||(this.children=[]),this.children.push(e),this.increaseContentSize(e.size)}addHardlinks(e,t){this.hardlinks=e,this.hardlinksTotal=t}increaseContentSize(e){e&&(this._contentSize||(this._contentSize=0),this._contentSize+=e,this.parent&&e&&this.parent.increaseContentSize(e))}get size(){return"folder"===this.type?this._contentSize||0:this._size||0}get folders(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"folder"===e.type)))||[]}get files(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"file"===e.type)))||[]}get symlinks(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"symlink"===e.type)))||[]}get fifos(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"fifo"===e.type)))||[]}get charDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"charDev"===e.type)))||[]}get blockDevs(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"blockDev"===e.type)))||[]}get sockets(){var e;return(null==(e=this.children)?void 0:e.filter((e=>"socket"===e.type)))||[]}get isEmpty(){var e;return!Boolean(null==(e=this.children)?void 0:e.length)}get hasErrors(){var e;return Boolean(null==(e=this.errors)?void 0:e.length)}get root(){return this.parent?this.parent.root:this}get path(){return this.parent?[...this.parent.path,this]:[this]}}class EntryStreamParser{constructor(){this.rootId=0,this.map=new Map,this.hidMap=new Map}setMeta(e){this.meta=e;const t=e.errorsMap;t&&(this.errorsIDMap=new Map(Object.entries(t).map((([e,t])=>{const[a,n,s]=e.split(":");return[t,{code:a,syscall:n,errno:Number(s)}]}))))}parse(e){var t;let a=!1;for(const n of e){const e=null!=(t=this.map.get(n.pid))?t:null,s=new SimpleEntry(n,e,this.errorsIDMap);if("folder"===n.type&&this.map.set(n.id,s),null==e||e.addChild(s),n.hid){const e=this.hidMap.get(n.hid)||[];this.hidMap.set(n.hid,[...e,s])}n.pid===this.rootId&&(a=!0)}return{root:this.map.get(this.rootId),rootUpdated:a}}processHIDMapAsync(){this.hidMap.size&&(console.log("[hidMap]:",this.hidMap),console.time("hidMap"),async function(e){let t=0,a=0;for(const[n,s]of e.entries()){if(!(t++%1e3)){const e=Date.now();e-a>15&&(a=e,await sleep())}const e=Number(n.split(":")[1]);s.forEach((t=>{t.addHardlinks(s,e)}))}}(this.hidMap).then((()=>console.timeEnd("hidMap"))))}}const V=new SimpleEntry({type:"folder",name:"",pid:null},null),Q=t("");function clearSearch(){Q.value=""}const X=t([]);function setSearchResult(e){const t=s(e);X.value=t,H.value=50,function(e){globalThis.search=e,console.log("globalThis.search:",e),Object.defineProperty(globalThis.search,"download",{get(){console.log("download")}}),Object.defineProperty(globalThis.search,"names",{get:()=>globalThis.search.map((e=>e.name))}),Object.defineProperty(globalThis.search,"namelist",{get:()=>globalThis.search.map((e=>e.name)).join("\n")})}(t)}o([A,F],(()=>{X.value.length&&(console.time("sort searchResult"),X.value=X.value.sort(comparator),console.timeEnd("sort searchResult"))}));const ee=function(e,t=50){let a;return function(){a&&clearTimeout(a),a=setTimeout((()=>{e.apply(this,arguments),a=null}),t)}}(performSearch,300);async function performSearch(){const e=ie.value,t=Q.value,a=r(e)?s(e):e,n=performance.now(),o=await async function(e,t){var a,n,s,o;if(t.startsWith("//"))return justSearch(t.slice(2));if(["https://","http://"].some((e=>t.startsWith(e)))){const e=new URL(t);let s;if("www.youtube.com"===e.hostname&&"/watch"===e.pathname)s=e.searchParams.get("v");else{const t=e.pathname.length>1&&e.pathname.endsWith("/"),o=null==(a=(t?e.pathname.slice(0,-1):e.pathname).match(/[^\/]+$/))?void 0:a[0];if(!o)return[];const{name:r,ext:i}=(null==(n=o.match(/(?<name>.+)(\.(?<ext>.+))$/))?void 0:n.groups)||{name:o};s=r+(t&&i?`.${i}`:"")}const o=await justSearch(s);return Object.defineProperty(o,"customSearchText",{value:s}),o}const r="\\/s(ize)?(?<defaultPrefix>b|k|m|g|t)?[:\\/]";if(t.match(new RegExp(r))){const a=new RegExp(r+"(?<extra1>(?<caret>\\^)|(?<dollar>\\$)|(?<percent>%))?"+"((?<sizeString1>\\s*\\d[\\d\\s\\,]*)((?<dotDecimal1>\\.(?<decimal1>\\d+)?))?(?<prefix1>b|k|m|g|t)?(?<exclamations>!+)?)"+`(?<range>${"(?<extra2>(?<plus>\\+)|(?<minus>\\-)|(?<tildes>\\~+))"}${"((?<sizeString2>\\s*-?\\s*\\d[\\d\\s\\,]*)((?<dotDecimal2>\\.(?<decimal2>\\d+)?))?(?<prefix2>b|k|m|g|t)?)?"})?`),{defaultPrefix:n,caret:o,dollar:i,percent:l,sizeString1:c,decimal1:u,prefix1:d,exclamations:p,plus:h,minus:f,tildes:m,sizeString2:v,decimal2:g,prefix2:y}=(null==(s=t.match(a))?void 0:s.groups)||{};if(c){let t,a,multiplyByPrefix=function(e,t="b"){if(void 0===e)return;const a=["b","k","m","g","t"];return Math.trunc(e*1024**a.indexOf(t))};console.log({defaultPrefix:n,extra1:{caret:o,dollar:i,percent:l},sizeString1:c,decimal1:u,prefix1:d,exclamations:p,extra2:{plus:h,minus:f,tildes:m,sizeString2:v,decimal2:g,prefix2:y}});let s=Number(c.replaceAll(/[\s,]/g,""));const r=s.toString();let b=v&&Number(v.replaceAll(/[\s,]/g,""));const S=null==b?void 0:b.toString(),w=u?Number("0."+u):0,k=g?Number("0."+g):0;async function rangeSearch(n,s){const{_min:o,max:r}=n<s?{_min:n,max:s}:{_min:s,max:n},i=Math.max(0,o);t=`Size search from ${bytesToSizeWinLike(i)} to ${bytesToSizeWinLike(r)}`,a=await findAll(e,(e=>e.size>=i&&e.size<=r))}if(s=multiplyByPrefix(s+w,d||n),b=multiplyByPrefix(b+k,y||n),o)t=`Size search starts with "${r}"`,a=await findAll(e,(e=>e.size.toString().startsWith(r)));else if(i)t=`Size search ends with "${r}"`,a=await findAll(e,(e=>e.size.toString().endsWith(r)));else if(l)t=`Size search includes "${r}"`,a=await findAll(e,(e=>e.size.toString().includes(r)));else if(h&&S)await rangeSearch(s,s+b);else if(f&&S)await rangeSearch(s,b);else if(m)if(S)await rangeSearch(s-b,s+b);else{const e=m.length,t=Math.trunc(5*s*e/100);await rangeSearch(s-t,s+t)}else{const o=d||n;if(o&&"b"!==o){let e=Math.trunc(.99*s),t=Math.trunc(1.01*s);p&&(e=s,p.length>1&&(t=Math.trunc(1.001*s))),await rangeSearch(e,t)}else t=`Size search ${bytesToSizeWinLike(s)}`,a=await findAll(e,(e=>e.size===s))}return console.log(...function(e){return[`%c${e}`,"color: #2196f3; font-weight: bold;"]}(t)),Object.defineProperty(a,"customSearchText",{value:t}),a}console.log("no size to search")}if(t.startsWith("/")){const{type:a,word:n}=(null==(o=t.match(/\/type:(?<type>[^\/]+)\/?(?<word>[^\/]*)/))?void 0:o.groups)||{};if(a&&(console.log({type:a,word:n}),Y.includes(a)))return findAll(e,(e=>e.type===a&&e.name.includes(n)))}else if(t.includes(" ")){const e=t.split(" ").filter((e=>e));if(e.length>1){let t,a=await justSearch(e.shift());for(;t=e.shift();)a=a.filter((e=>e.name.includes(t)));return a}}return justSearch(t);function justSearch(t){return findAll(e,(e=>e.name.includes(t)))}}(a,t);if(!o)return;addMessage(`Search time: ${(performance.now()-n).toFixed(2)} ms; `),await sleep();const i=performance.now(),l=o.sort(comparator);appendMessage(`Sort time: ${(performance.now()-i).toFixed(2)} ms; `),await sleep(),console.time("search result size computing");const c=new Set(o),u=o.reduce(((e,t)=>computeEntrySize(t,c)+e),0),d=o.filter((e=>"folder"!==e.type)).reduce(((e,t)=>t.size+e),0);console.timeEnd("search result size computing"),console.log(u,d),setSearchResult(l);const p=o.customSearchText||t;appendMessage(`${o.length} items; size: ${bytesToSizeWinLike(d)} (${bytesToSizeWinLike(u)});  search: ${p}`)}function computeEntrySize(e,t){if("folder"!==e.type)return e.size;let a=0;for(const n of e.children||[])t.has(n)||("folder"===n.type?a+=computeEntrySize(n,t):a+=n.size);return a}async function findAll(e,t){let a=[],n=Date.now();for(const s of function*(e){const t=1e3;let a=[];function*takePart(e){for(const n of e.children||[])"folder"===n.type&&(yield*takePart(n)),a.push(n),a.length===t&&(yield a,a=[])}yield*takePart(e),yield a}(e)){const e=Date.now();e-n>15&&(n=e,await sleep());for(const n of s)t(n)&&a.push(n)}return a}async function*parseScan(e){const t=new EntryStreamParser;let a,n;if(e instanceof Response?a=e.headers.get("content-type"):e instanceof Blob&&(a=e.type),function(e){return Boolean(e.match(/^application\/.*?gzip/))}(a)){console.log("parseGZippedJSONScan");for await(const a of async function*(e){const t=new TextDecoder,a=new TextParser;let n=0,s=0;for await(const o of async function*(e){te||await async function(){if(!te){const e="https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako_inflate.min.js",t="sha256-ZIKs3+RZEULSy0dR6c/mke8V9unZm9vuh05TqvtMdGU=";await function(e,t){return new Promise(((a,n)=>{const s=document.createElement("script");s.onload=a,s.onerror=a=>n({message:"Failed to load script",src:e,integrity:t,event:a}),s.src=e,s.async=!0,t&&(s.integrity=t,s.crossOrigin="anonymous"),document.body.append(s)}))}(e,t),te=!0,console.log("pako is loaded")}}();let t=[];const a=new pako.Inflate;pako.Inflate.prototype.onData=function(e){t.push(e)};for await(const n of iterateAsyncDataSource(e)){a.push(n);for(const e of t)yield e;t=[]}yield a.result,a.err&&console.error(a.msg)}(e)){if(!(n++%20)){const e=Date.now();e-s>15&&(s=e,await sleep())}const e=t.decode(o,{stream:!0}),r=a.parsePart(e);r.length&&(yield r)}}(e))n||(n=a.shift(),t.setMeta(n)),yield{meta:n,...t.parse(a)}}else if(function(e){return Boolean(e.match(/^application\/.*?json/))}(a)){console.log("streamParseJSONScan");for await(const a of async function*(e){const t=new TextDecoder,a=new TextParser;let n=0,s=0;for await(const o of iterateAsyncDataSource(e)){if(!(n++%10)){const e=Date.now();e-s>15&&(s=e,await sleep())}const e=t.decode(o,{stream:!0}),r=a.parsePart(e);r.length&&(yield r)}}(e))n||(n=a.shift(),t.setMeta(n)),yield{meta:n,...t.parse(a)}}t.processHIDMapAsync()}o(Q,(async(e,t)=>{e?e.length-t.length>1?await performSearch():await ee():setSearchResult([])}));class TextParser{constructor(){__publicField(this,"buffer",""),__publicField(this,"startHandled",!1),__publicField(this,"metaLines",[]),__publicField(this,"objects",[])}trimComma(e){return e.endsWith(",")?e.slice(0,-1):e}handleStart(e){if("["!==e)return""===e?(this.objects.push(this.metaLines.join("")),void(this.startHandled=!0)):void this.metaLines.push(e)}handleLine(e,t){t?this.buffer+=e:this.buffer?(this.objects.push(this.buffer+e),this.buffer=""):this.objects.push(e)}parsePart(e){const t=e.endsWith("\n]"),a=e.split("\n");for(let s=0;s<a.length;s++){const e=a[s],n=s===a.length-1;n&&t||(this.startHandled?this.handleLine(e,n):this.handleStart(e,n))}try{const e=JSON.parse(`[${this.trimComma(this.objects.join(""))}]`);return this.objects=[],e}catch(n){throw console.log(`[${this.trimComma(this.objects.join(""))}]`),console.log(this.objects),console.log(this,{isLastPart:t,textPart:e}),n}}}let te=!1;const ae=t(null),ne=t(null),se=t(0);async function setScan(e){let t=!1,a=!1;console.time("setScan");let n=Date.now();for await(const{meta:s,root:o,rootUpdated:r}of parseScan(e)){!t&&s&&(ae.value=i(s),t=!0),!a&&o&&(ne.value=i(o),globalThis.json=o,openFolder(o),a=!0);const e=Date.now();(r||e-n>50)&&(n=e,se.value++,await sleep())}se.value++,console.timeEnd("setScan"),clearSearch()}const oe=a((()=>{var e;return(null==(e=ae.value)?void 0:e.separator)||"/"})),re=a((()=>{var e;return(null==(e=ae.value)?void 0:e.path)||[]})),ie=t(V),le=a((()=>ie.value.path));function openFolder(e){clearSearch(),ie.value=i(l(e)),H.value=50,globalThis.folder=e,console.log("globalThis.folder:",e)}const ce=a((()=>ne.value&&ie.value.isEmpty));o(ae,(async(e,t)=>{console.log("[meta]:",ae.value);const{files:a,folders:n,symlinks:s,errors:o,total:r,scanDate:i}=ae.value;ae.value.scanDate&&addMessage(`files: "${a}" folders: "${n}", symlinks: "${s}", errors: "${o}", total: "${r}", scanDate: "${dateToDayDateString(i)}"`)}));const ue={class:"scanPath"},de=["title"],pe={class:"part"},he={class:"part spaced"},fe={key:0,class:"spaced separator"},me={setup(e){const t=a((()=>{if(!ae.value)return;const{files:e,folders:t,symlinks:a,charDevs:n,blockDevs:s,fifos:o,sockets:r,total:i,platform:l,scanDate:c}=ae.value;function doString(e){return Object.entries(e).map((([e,t])=>function(e){const t=3-Math.trunc(e.length/4);return e+"\t".repeat(t)}(e)+": "+t)).join("\n")}const u=doString({files:e,folders:t,symlinks:a}),d=doString({charDevs:n,blockDevs:s,fifos:o,sockets:r}),p=doString({total:i,platform:l,scanDate:dateToDayDateString(c)});let h;return h="win32"!==l?[u,d,p].join("\n"):[u,p].join("\n"),console.log(h),h})),n=a((()=>{var e;const t=[...re.value,ie.value.root.name].join(oe.value);return t.startsWith("//")?t.slice(1):"win32"===(null==(e=ae.value)?void 0:e.platform)?t[0].toUpperCase()+t.slice(1):t})),s=a((()=>[...n.value].slice(0,-1).join(""))),o=a((()=>[...n.value].slice(-1).join(""))),r=a((()=>le.value.length-1&&"/"!==n.value));function goToRoot(){const e=ie.value.root;debugMessageFromEntry(e),openFolder(e)}return(e,a)=>(c(),u("span",ue,[d("span",{class:"parts",onClick:goToRoot,title:l(t)},[d("span",pe,p(l(s)),1),d("span",he,p(l(o)),1)],8,de),l(r)?(c(),u("span",fe,p(l(oe)),1)):h("",!0)]))},__scopeId:"data-v-7487a6bd"};const ve={class:"opened-folder"},ge={class:"part"},ye={class:"part spaced"},be={key:0,class:"separator spaced"},Se={props:["index","count","entry"],setup(e){const t=e,{index:n,count:s,entry:o}=f(t),r=a((()=>n.value+1===s.value)),i=a((()=>[...o.value.name].slice(0,-1).join(""))),m=a((()=>[...o.value.name].slice(-1).join("")));function onClick(){debugMessageFromEntry(o.value),openFolder(o.value)}return(e,t)=>(c(),u("span",ve,[d("span",{class:"parts",onClick:onClick},[d("span",ge,p(l(i)),1),d("span",ye,p(l(m)),1)]),l(r)?h("",!0):(c(),u("span",be,p(l(oe)),1))]))},__scopeId:"data-v-3c8242f7"};const we={class:"box"},ke={props:{maxWidth:{default:"max-content",type:String}},setup:e=>(t,a)=>(c(),u("div",we,[d("div",{class:"sub",style:v({maxWidth:e.maxWidth})},[m(t.$slots,"default",{},void 0,!0)],4)])),__scopeId:"data-v-f8be0ec4"};const ze={setup(e){async function onContextmenu(e){e.preventDefault();const t=[...ae.value.path,...ie.value.path.map((e=>e.name))].join(oe.value);console.log("Copy to clipboard:",t),await navigator.clipboard.writeText(t)}return(e,t)=>(c(),u("div",{class:"address",onContextmenu:onContextmenu},[g(ke,null,{default:y((()=>[g(me)])),_:1}),(c(!0),u(b,null,S(l(le).slice(1),((e,t)=>(c(),w(ke,null,{default:y((()=>[g(Se,{entry:e,index:t,count:l(le).slice(1).length},null,8,["entry","index","count"])])),_:2},1024)))),256))],32))},__scopeId:"data-v-304c3618"};const xe={class:"search-wrapper"},Me={class:"search"},Te=(e=>(M("data-v-7cf12500"),e=e(),T(),e))((()=>d("label",{for:"json-scan-search-input",class:"fuck-off-lighthouse"},".",-1))),De={setup(e){const a=t();function onClearClick(){clearSearch(),a.value.focus()}return(e,t)=>(c(),u("div",xe,[d("div",Me,[k(d("input",{id:"json-scan-search-input",type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>x(Q)?Q.value=e:null),ref_key:"inputRef",ref:a},null,512),[[z,l(Q)]]),d("button",{onClick:onClearClick},"Clear")]),Te]))},__scopeId:"data-v-7cf12500"};const _withScopeId$2=e=>(M("data-v-23a29b76"),e=e(),T(),e),je={class:"file-select"},_e=D(" Select file "),Ce=_withScopeId$2((()=>d("hr",null,null,-1))),$e={setup(e){function onChange(e){return setScan(e.target.files[0])}return(e,t)=>(c(),u("div",je,[d("label",null,[_e,d("input",{type:"file",accept:"application/json,application/gzip",onChange:onChange},null,32)]),Ce]))},__scopeId:"data-v-23a29b76"};const Pe={class:"tabs"},Ee=(e=>(M("data-v-4cf83322"),e=e(),T(),e))((()=>d("div",{class:"tab"},null,-1))),Ie={setup:e=>(e,t)=>(c(),u("div",Pe,[g($e,{class:"tab"}),Ee])),__scopeId:"data-v-4cf83322"};const Be=["title"],Le={class:"icon"},We={class:"name"},Re={class:"mtime"},Ae={props:["entry"],setup(e){const t=e,n=a((()=>(se.value,o.value.hasErrors?"":bytesToSizeWinLike(o.value.size)))),s=a((()=>"0 B"===n.value?"Z":n.value.split(" ")[1])),o=f(t).entry,r=a((()=>o.value.hasErrors)),i=a((()=>{if(void 0===o.value.mtime)return"";return dateToDayDateTimeString(o.value.mtime,!1).slice(0,-3)})),h=a((()=>o.value.hasErrors?JSON.stringify(o.value.errors[0],null," "):"symlink"===o.value.type?o.value.pathTo:void 0)),m=a((()=>"folder"===o.value.type?"📁":"file"===o.value.type?function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return L.includes(t)}(o.value.name)?"🎦":function(e){const{ext:t}=e.match(/(?<ext>[^.]+)$/).groups;return W.includes(t)}(o.value.name)?"🖼":"📄":"symlink"===o.value.type?"🔗":"👾"));function onClick(e){debugMessageFromEntry(o.value),"folder"===o.value.type&&openFolder(o.value)}function onMousedown(e){1===e.button&&(e.preventDefault(),console.log(o.value,[...ae.value.path,...o.value.path.map((e=>e.name))].join(oe.value).replace("//","/")),ie.value!==o.value.parent&&openFolder(o.value.parent))}function onMouseover(e){K.value=o.value}function onMouseleave(e){K.value=null}return(e,t)=>(c(),u("tr",{class:j(["row",{error:l(r)}]),onClick:onClick,onMousedown:onMousedown,onMouseover:onMouseover,onMouseleave:onMouseleave,title:l(h)},[d("td",Le,p(l(m)),1),d("td",We,p(l(o).name),1),d("td",{class:j(["size",l(s)])},p(l(n)),3),d("td",Re,p(l(i)),1)],42,Be))},__scopeId:"data-v-f71509d6"};const Oe={setup(e){const a=new IntersectionObserver((e=>{const[t]=e;t.isIntersecting&&J.value>H.value&&(H.value=H.value+50)})),n=t(null);return _((()=>{a.observe(n.value)})),C((()=>{a.disconnect()})),(e,t)=>(c(),u("div",{class:"intersection",ref_key:"intersection",ref:n},null,512))},__scopeId:"data-v-5baedc86"};const _withScopeId=e=>(M("data-v-d2171e22"),e=e(),T(),e),Fe={key:0,class:"rows"},Ne={key:1,class:"empty-message"},Ue=[_withScopeId((()=>d("span",null,"The folder is empty.",-1)))],He={key:2,class:"error-message"},Ze=_withScopeId((()=>d("h2",null,"Error",-1))),Ge=_withScopeId((()=>d("td",null,"syscall",-1))),Je=_withScopeId((()=>d("td",null,"code",-1))),Ke=_withScopeId((()=>d("td",null,"errno",-1))),qe={setup(e){$((e=>({"78b3c76e":s.value})));const n=a((()=>!!ie.value.hasErrors&&ie.value.errors[0]));function onContextMenu(e){e.preventDefault(),ie.value.parent&&openFolder(ie.value.parent)}const s=t("880px");return _((()=>{const e=document.body.offsetWidth;if(e<1280){let t=880-(1280-e);t=t<140?140:t,s.value=`${t}px`}})),(e,t)=>(c(),u("div",{class:"content",onContextmenu:onContextMenu},[l(G).length?(c(),u("table",Fe,[d("tbody",null,[(c(!0),u(b,null,S(l(G),(e=>(c(),w(Ae,{entry:e},null,8,["entry"])))),256)),g(Oe)])])):h("",!0),l(ce)&&!l(n)?(c(),u("div",Ne,Ue)):h("",!0),l(n)?(c(),u("div",He,[d("div",null,[Ze,d("table",null,[d("tr",null,[Ge,d("td",null,[d("pre",null,p(l(n).syscall),1)])]),d("tr",null,[Je,d("td",null,[d("pre",null,p(l(n).code),1)])]),d("tr",null,[Ke,d("td",null,[d("pre",null,p(l(n).errno),1)])])])])])):h("",!0)],32))},__scopeId:"data-v-d2171e22"};const Ye={class:"status"},Ve={setup(e){const t=a((()=>{var e;return(null==(e=K.value)?void 0:e.size)&&bytesToSizeWinLike(K.value.size)}));return(e,a)=>(c(),u("div",Ye,[d("span",null,"Items count: "+p(l(J)),1),k(d("span",null,". Hover item's size: "+p(l(t)),513),[[P,l(K)]])]))},__scopeId:"data-v-08ca63fc"};const Qe={class:"switch"},Xe={setup(e){function onClick(e){A.value===e&&(O.value[A.value]=!O.value[A.value]),A.value=e}return(e,t)=>(c(),u("div",Qe,[d("button",{class:j(["order-by-name",{active:"name"===l(A)}]),title:"Order by name",onClick:t[0]||(t[0]=e=>onClick("name"))},p(l(O).name?"N":"n"),3),d("button",{class:j(["order-by-size",{active:"size"===l(A)}]),title:"Order by size",onClick:t[1]||(t[1]=e=>onClick("size"))},p(l(O).size?"S":"s"),3),d("button",{class:j(["order-by-date",{active:"mtime"===l(A)}]),title:"Order by date",onClick:t[2]||(t[2]=e=>onClick("mtime"))},p(l(O).mtime?"D":"d"),3)]))},__scopeId:"data-v-68f2d0ba"};const et={class:"debug"},tt={key:0},at={key:1},nt={setup:e=>(e,t)=>(c(),u("div",et,[l(q)?(c(),u("span",tt,p(l(q)),1)):(c(),u("span",at,"_"))])),__scopeId:"data-v-16910406"};const st={},ot={class:"guide"},rt=[E('<div class="text-wrapper" data-v-e2e7dfd4><h2 data-v-e2e7dfd4>No scan selected</h2><div data-v-e2e7dfd4>Use your own directory scan file (created with <a href="https://github.com/AlttiRi/directory-snapshot-explorer#how-to-use" target="_blank" data-v-e2e7dfd4>the scanner</a>). </div><div class="" data-v-e2e7dfd4>Or use the demo scans to take a look at the program work: <ul data-v-e2e7dfd4><li data-v-e2e7dfd4><a href="./?filepath=https://alttiri.github.io/json-flat-scans/windows-admin.json.gz" data-v-e2e7dfd4>Win 10 scan (as Admin)</a></li><li data-v-e2e7dfd4><a href="./?filepath=https://alttiri.github.io/json-flat-scans/ubuntu-admin.json.gz" data-v-e2e7dfd4>Ubuntu scan (as Root)</a></li><li data-v-e2e7dfd4><a href="./?filepath=https://alttiri.github.io/json-flat-scans/linux-master.json.gz" data-v-e2e7dfd4>Linux Source Code scan</a></li></ul></div><div data-v-e2e7dfd4>For more info see the <a href="https://github.com/AlttiRi/directory-snapshot-explorer#directory-snapshot-explorer" target="_blank" data-v-e2e7dfd4>Readme</a>.</div></div>',1)];st.render=function(e,t){return c(),u("div",ot,rt)},st.__scopeId="data-v-e2e7dfd4";const it={class:"main"},lt={setup(e){globalThis.bytesToSize=bytesToSize,globalThis.bytesToSizeWinLike=bytesToSizeWinLike;const t=a((()=>!ae.value&&!new URL(location.href).searchParams.get("filepath")));return _((async()=>{const e=new URL(location.href),t=e.searchParams.get("filepath");if(t){const e=await fetch(t);await setScan(e)}const a=e.searchParams.get("search");a&&(Q.value=a)})),(e,a)=>(c(),u("div",it,[g(Xe,{style:{"grid-area":"switch"}}),g(ze,{style:{"grid-area":"address"}}),g(De,{style:{"grid-area":"search"}}),g(Ie,{style:{"grid-area":"tabs"}}),l(t)?(c(),w(st,{key:0,style:{"grid-area":"content"}})):(c(),w(qe,{key:1,style:{"grid-area":"content"}})),g(Ve,{style:{"grid-area":"status"}}),g(nt,{style:{"grid-area":"debug"}})]))},__scopeId:"data-v-c54b287a"};I({setup:e=>(e,t)=>(c(),w(lt))}).mount("#app");
//# sourceMappingURL=index.js.map
