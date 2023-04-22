!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=86)}({13:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isValidJSON=e=>{try{return JSON.parse(e),{error:void 0}}catch(t){let n=void 0,r=void 0;const o=new RegExp(/(?<=\bposition\s)(\w+)/g),s=t.toString();if("Unexpected end of JSON input"!==s){const t=o.exec(s);if(n=t&&t.length>0?parseInt(t[0],10):void 0,n){r=1;for(let t=0;t<e.length&&t!==n;t++)"\n"===e[t]&&r++}o.lastIndex=0}return{error:`${s}${r?" and at line number "+r:""}`,position:n,lineNumber:r}}},t.getError=e=>{const t=Object.keys(e);return 0===t.length?void 0:e[t[0]]},t.getHeaders=e=>Object.keys(e).map(t=>({name:t,value:e[t]}))},3:function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},86:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(87)),s=n(88),a=r(n(92)),i=r(n(93)),c=n(13),u=r(n(9)),l=new i.default,d=new a.default,f=new a.default;u.default.listen("HOOK",e=>{l.dispatch(e.id,e.message)});const p=(e,t,n)=>{const r=n?d.getId():null,o={id:r,message:e,to:"CONTENT",from:"HOOK",extensionName:"MOKKU",type:t};if(u.default.send(o),null!==r)return new Promise(e=>{l.addLister(r,e)})};o.default.before((function(e,t){const n=e.url.indexOf("?");-1!==n?e.url.substr(0,n):e.url,-1!==n&&JSON.stringify(s.parse(e.url.substr(n)));e.mokku={id:f.getId()};const r=h(e);p(r,"LOG",!1),p(r,"NOTIFICATION",!0).then(e=>{if(e&&e.mockResponse){const n=e.mockResponse,r=n.headers?n.headers.reduce((e,t)=>(e[t.name]=t.value,e),{}):{"content-type":"application/json; charset=UTF-8"},o={status:n.status,text:n.response?n.response:"",headers:r,type:"json"};n.delay?setTimeout(()=>{t(o)},n.delay):t(o)}else t()}).catch(()=>{console.log("something went wrong!")})}));const h=(e,t)=>{var n;const r=e.url.indexOf("?"),o=-1!==r?e.url.substr(0,r):e.url,a=-1!==r?JSON.stringify(s.parse(e.url.substr(r))):void 0;let i=e.body;try{if("object"==typeof i){i=JSON.stringify(i)}}catch(e){i="Unsupported body type!"}return{request:{url:o,body:i,queryParams:a,method:e.method,headers:c.getHeaders(e.headers)},response:t,id:null===(n=e.mokku)||void 0===n?void 0:n.id}};o.default.after((function(e,t){try{if("function"==typeof t.clone){const n=t.clone();if("string"==typeof n.text){const t=h(e,{status:n.status,response:n.text,headers:c.getHeaders(n.headers)});p(t,"LOG",!1)}else n.text().then(t=>{const r=h(e,{status:n.status,response:t,headers:c.getHeaders(n.headers)});p(r,"LOG",!1)})}else{const n=h(e,{status:t.status,response:"string"==typeof t.text?t.text:"Cannot parse response, logging libraries can cause this.",headers:c.getHeaders(t.headers)});p(n,"LOG",!1)}}catch(t){const n=h(e,{status:0,response:void 0,headers:[]});p(n,"LOG",!1),console.log("INJECT_ERROR",t)}}))},87:function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"default",(function(){return j})),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){for(let t=0;t<this.length;t++){if(this[t]===e)return t}return-1});const r=(e,t)=>Array.prototype.slice.call(e,t);let o=null;"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?o=self:void 0!==e?o=e:window&&(o=window);const s="undefined"!=typeof navigator&&navigator.useragent?navigator.userAgent:"";let a=null;(/msie (\d+)/.test(s.toLowerCase())||/trident\/.*; rv:(\d+)/.test(s.toLowerCase()))&&(a=parseInt(RegExp.$1,10));const i=o,c=o.document,u=["load","loadend","loadstart"],l=["progress","abort","error","timeout"],d=e=>["returnValue","totalSize","position"].includes(e),f=function(e,t){for(let n in e){if(d(n))continue;const r=e[n];try{t[n]=r}catch(e){}}return t},p=function(e,t,n){const r=e=>function(r){const o={};for(let e in r){if(d(e))continue;const s=r[e];o[e]=s===t?n:s}return n.dispatchEvent(e,o)};for(let o of Array.from(e))n._has(o)&&(t["on"+o]=r(o))},h=function(e){if(c&&null!=c.createEventObject){const t=c.createEventObject();return t.type=e,t}try{return new Event(e)}catch(t){return{type:e}}},y=function(e){let t={};const n=e=>t[e]||[],o={addEventListener:function(e,r,o){t[e]=n(e),t[e].indexOf(r)>=0||(o=void 0===o?t[e].length:o,t[e].splice(o,0,r))},removeEventListener:function(e,r){if(void 0===e)return void(t={});void 0===r&&(t[e]=[]);const o=n(e).indexOf(r);-1!==o&&n(e).splice(o,1)},dispatchEvent:function(){const t=r(arguments),s=t.shift();e||(t[0]=f(t[0],h(s)));const a=o["on"+s];a&&a.apply(o,t);const i=n(s).concat(n("*"));for(let e=0;e<i.length;e++){i[e].apply(o,t)}},_has:e=>!(!t[e]&&!o["on"+e])};return e&&(o.listeners=e=>r(n(e)),o.on=o.addEventListener,o.off=o.removeEventListener,o.fire=o.dispatchEvent,o.once=function(e,t){var n=function(){return o.off(e,n),t.apply(null,arguments)};return o.on(e,n)},o.destroy=()=>t={}),o};var g=function(e,t){let n;switch(null==t&&(t={}),typeof e){case"object":var r=[];for(let t in e){const o=e[t];n=t.toLowerCase(),r.push(`${n}:\t${o}`)}return r.join("\n")+"\n";case"string":r=e.split("\n");for(let e of Array.from(r))if(/([^:]+):\s*(.+)/.test(e)){n=null!=RegExp.$1?RegExp.$1.toLowerCase():void 0;const e=RegExp.$2;null==t[n]&&(t[n]=e)}return t}return[]};const m=y(!0),v=e=>void 0===e?null:e,b=i.XMLHttpRequest,O=function(){const e=new b,t={};let n=null,r=void 0,o=void 0,s=void 0;var i=0;const c=function(){if(s.status=n||e.status,-1===n&&a<10||(s.statusText=e.statusText),-1===n);else{const t=g(e.getAllResponseHeaders());for(let e in t){const n=t[e];if(!s.headers[e]){const t=e.toLowerCase();s.headers[t]=n}}}},d=function(){x.status=s.status,x.statusText=s.statusText},h=function(){r||x.dispatchEvent("load",{}),x.dispatchEvent("loadend",{}),r&&(x.readyState=0)},O=function(e){for(;e>i&&i<4;)x.readyState=++i,1===i&&x.dispatchEvent("loadstart",{}),2===i&&d(),4===i&&(d(),"text"in s&&(x.responseText=s.text),"xml"in s&&(x.responseXML=s.xml),"data"in s&&(x.response=s.data),"finalUrl"in s&&(x.responseURL=s.finalUrl)),x.dispatchEvent("readystatechange",{}),4===i&&(!1===t.async?h():setTimeout(h,0))},E=function(e){if(4!==e)return void O(e);const n=m.listeners("after");var r=function(){if(n.length>0){const e=n.shift();2===e.length?(e(t,s),r()):3===e.length&&t.async?e(t,s,r):r()}else O(4)};r()};var x=y();t.xhr=x,e.onreadystatechange=function(t){try{2===e.readyState&&c()}catch(e){}4===e.readyState&&(o=!1,c(),function(){if(e.responseType&&"text"!==e.responseType)"document"===e.responseType?(s.xml=e.responseXML,s.data=e.responseXML):s.data=e.response;else{s.text=e.responseText,s.data=e.responseText;try{s.xml=e.responseXML}catch(e){}}"responseURL"in e&&(s.finalUrl=e.responseURL)}()),E(e.readyState)};const w=function(){r=!0};x.addEventListener("error",w),x.addEventListener("timeout",w),x.addEventListener("abort",w),x.addEventListener("progress",(function(t){i<3?E(3):e.readyState<=3&&x.dispatchEvent("readystatechange",{})})),"withCredentials"in e&&(x.withCredentials=!1),x.status=0;for(let e of Array.from(l.concat(u)))x["on"+e]=null;if(x.open=function(e,n,a,c,u){i=0,r=!1,o=!1,t.headers={},t.headerNames={},t.status=0,t.method=e,t.url=n,t.async=!1!==a,t.user=c,t.pass=u,s={},s.headers={},E(1)},x.send=function(n){let r,a;for(r of["type","timeout","withCredentials"])a="type"===r?"responseType":r,a in x&&(t[r]=x[a]);t.body=n;const i=m.listeners("before");var c=function(){if(!i.length)return function(){for(r of(p(l,e,x),x.upload&&p(l.concat(u),e.upload,x.upload),o=!0,e.open(t.method,t.url,t.async,t.user,t.pass),["type","timeout","withCredentials"]))a="type"===r?"responseType":r,r in t&&(e[a]=t[r]);for(let n in t.headers){const r=t.headers[n];n&&e.setRequestHeader(n,r)}e.send(t.body)}();const n=function(e){if("object"==typeof e&&("number"==typeof e.status||"number"==typeof s.status))return f(e,s),"data"in e||(e.data=e.response||e.text),void E(4);c()};n.head=function(e){f(e,s),E(2)},n.progress=function(e){f(e,s),E(3)};const d=i.shift();1===d.length?n(d(t)):2===d.length&&t.async?d(t,n):n()};c()},x.abort=function(){n=-1,o?e.abort():x.dispatchEvent("abort",{})},x.setRequestHeader=function(e,n){const r=null!=e?e.toLowerCase():void 0,o=t.headerNames[r]=t.headerNames[r]||e;t.headers[o]&&(n=t.headers[o]+", "+n),t.headers[o]=n},x.getResponseHeader=e=>v(s.headers[e?e.toLowerCase():void 0]),x.getAllResponseHeaders=()=>v(g(s.headers)),e.overrideMimeType&&(x.overrideMimeType=function(){e.overrideMimeType.apply(e,arguments)}),e.upload){let e=y();x.upload=e,t.upload=e}return x.UNSENT=0,x.OPENED=1,x.HEADERS_RECEIVED=2,x.LOADING=3,x.DONE=4,x.response="",x.responseText="",x.responseXML=null,x.readyState=0,x.statusText="",x};O.UNSENT=0,O.OPENED=1,O.HEADERS_RECEIVED=2,O.LOADING=3,O.DONE=4;var E={patch(){b&&(i.XMLHttpRequest=O)},unpatch(){b&&(i.XMLHttpRequest=b)},Native:b,Xhook:O};const x=i.fetch,w=function(e,t){null==t&&(t={headers:{}});let n=null;e instanceof Request?n=e:t.url=e;const r=m.listeners("before"),o=m.listeners("after");return new Promise((function(e,s){let a=e;const i=function(){return t.headers&&(t.headers=new Headers(t.headers)),n||(n=new Request(t.url,t)),f(t,n)};var c=function(e){if(!o.length)return a(e);const t=o.shift();return 2===t.length?(t(i(),e),c(e)):3===t.length?t(i(),e,c):c(e)};const u=function(t){if(void 0!==t){const n=new Response(t.body||t.text,t);return e(n),void c(n)}l()};var l=function(){if(!r.length)return void d();const e=r.shift();return 1===e.length?u(e(t)):2===e.length?e(i(),u):void 0},d=()=>x(i()).then(e=>c(e)).catch((function(e){return a=s,c(e),s(e)}));l()}))};var N={patch(){x&&(i.fetch=w)},unpatch(){x&&(i.fetch=x)},Native:x,Xhook:w};const j=m;j.EventEmitter=y,j.before=function(e,t){if(e.length<1||e.length>2)throw"invalid hook";return j.on("before",e,t)},j.after=function(e,t){if(e.length<2||e.length>3)throw"invalid hook";return j.on("after",e,t)},j.enable=function(){E.patch(),N.patch()},j.disable=function(){E.unpatch(),N.unpatch()},j.XMLHttpRequest=E.Native,j.fetch=N.Native,j.headers=g,j.enable()}.call(this,n(3))},88:function(e,t,n){"use strict";const r=n(89),o=n(90),s=n(91);function a(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function i(e,t){return t.encode?t.strict?r(e):encodeURIComponent(e):e}function c(e,t){return t.decode?o(e):e}function u(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function l(e){const t=(e=u(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function d(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function f(e,t){a((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const n=function(e){let t;switch(e.arrayFormat){case"index":return(e,n,r)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===r[e]&&(r[e]={}),r[e][t[1]]=n):r[e]=n};case"bracket":return(e,n,r)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==r[e]?r[e]=[].concat(r[e],n):r[e]=[n]:r[e]=n};case"comma":case"separator":return(t,n,r)=>{const o="string"==typeof n&&n.split("").indexOf(e.arrayFormatSeparator)>-1?n.split(e.arrayFormatSeparator).map(t=>c(t,e)):null===n?n:c(n,e);r[t]=o};default:return(e,t,n)=>{void 0!==n[e]?n[e]=[].concat(n[e],t):n[e]=t}}}(t),r=Object.create(null);if("string"!=typeof e)return r;if(!(e=e.trim().replace(/^[?#&]/,"")))return r;for(const o of e.split("&")){let[e,a]=s(t.decode?o.replace(/\+/g," "):o,"=");a=void 0===a?null:["comma","separator"].includes(t.arrayFormat)?a:c(a,t),n(c(e,t),a,r)}for(const e of Object.keys(r)){const n=r[e];if("object"==typeof n&&null!==n)for(const e of Object.keys(n))n[e]=d(n[e],t);else r[e]=d(n,t)}return!1===t.sort?r:(!0===t.sort?Object.keys(r).sort():Object.keys(r).sort(t.sort)).reduce((e,t)=>{const n=r[t];return Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(n):e[t]=n,e},Object.create(null))}t.extract=l,t.parse=f,t.stringify=(e,t)=>{if(!e)return"";a((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const n=n=>t.skipNull&&null==e[n]||t.skipEmptyString&&""===e[n],r=function(e){switch(e.arrayFormat){case"index":return t=>(n,r)=>{const o=n.length;return void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[i(t,e),"[",o,"]"].join("")]:[...n,[i(t,e),"[",i(o,e),"]=",i(r,e)].join("")]};case"bracket":return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[i(t,e),"[]"].join("")]:[...n,[i(t,e),"[]=",i(r,e)].join("")];case"comma":case"separator":return t=>(n,r)=>null==r||0===r.length?n:0===n.length?[[i(t,e),"=",i(r,e)].join("")]:[[n,i(r,e)].join(e.arrayFormatSeparator)];default:return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,i(t,e)]:[...n,[i(t,e),"=",i(r,e)].join("")]}}(t),o={};for(const t of Object.keys(e))n(t)||(o[t]=e[t]);const s=Object.keys(o);return!1!==t.sort&&s.sort(t.sort),s.map(n=>{const o=e[n];return void 0===o?"":null===o?i(n,t):Array.isArray(o)?o.reduce(r(n),[]).join("&"):i(n,t)+"="+i(o,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[n,r]=s(e,"#");return Object.assign({url:n.split("?")[0]||"",query:f(l(e),t)},t&&t.parseFragmentIdentifier&&r?{fragmentIdentifier:c(r,t)}:{})},t.stringifyUrl=(e,n)=>{n=Object.assign({encode:!0,strict:!0},n);const r=u(e.url).split("?")[0]||"",o=t.extract(e.url),s=t.parse(o,{sort:!1}),a=Object.assign(s,e.query);let c=t.stringify(a,n);c&&(c="?"+c);let l=function(e){let t="";const n=e.indexOf("#");return-1!==n&&(t=e.slice(n)),t}(e.url);return e.fragmentIdentifier&&(l="#"+i(e.fragmentIdentifier,n)),`${r}${c}${l}`}},89:function(e,t,n){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase())},9:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r={"HOOK:CONTENT":"window","CONTENT:HOOK":"window","CONTENT:PANEL":"tab","PANEL:CONTENT":"runtime"};t.default={send:(e,t)=>{({window:()=>window.postMessage(Object.assign(Object.assign({},e),{extensionName:"MOKKU"}),"*"),runtime:()=>chrome.runtime.sendMessage(Object.assign(Object.assign({},e),{extensionName:"MOKKU"})),tab:()=>{chrome.tabs.sendMessage(t,e)}})[r[`${e.to}:${e.from}`]](e)},listen:(e,t)=>{const n=()=>{chrome.runtime.onMessage.addListener((n,r,o)=>{n.to===e&&t(n,r,o)})},r=()=>{window.addEventListener("message",n=>{if(n.source!==window)return;const r=n.data;r.to===e&&t(r)})};switch(e){case"HOOK":return void r();case"CONTENT":return r(),void n();case"PANEL":return void n()}}}},90:function(e,t,n){"use strict";var r=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function s(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var n=e.slice(0,t),r=e.slice(t);return Array.prototype.concat.call([],s(n),s(r))}function a(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(r),n=1;n<t.length;n++)t=(e=s(t,n).join("")).match(r);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},n=o.exec(e);n;){try{t[n[0]]=decodeURIComponent(n[0])}catch(e){var r=a(n[0]);r!==n[0]&&(t[n[0]]=r)}n=o.exec(e)}t["%C2"]="�";for(var s=Object.keys(t),i=0;i<s.length;i++){var c=s[i];e=e.replace(new RegExp(c,"g"),t[c])}return e}(e)}}},91:function(e,t,n){"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const n=e.indexOf(t);return-1===n?[e]:[e.slice(0,n),e.slice(n+t.length)]}},92:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this._id=0}getId(){return this._id++,this._id}}},93:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this._collector={},this._defaultListner=console.log,this._collector={}}dispatch(e,t){this._collector[e]?this._collector[e](t):this._defaultListner(t)}addLister(e,t){this._collector[e]=t}createDefaultListener(e){this._defaultListner=e}}}});