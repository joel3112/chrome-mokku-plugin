!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=111)}({111:function(e,t,r){"use strict";var n=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=n(r(112)),a=r(113),i=o(r(117)),u=o(r(118)),c=r(51),l=new u.default,f=new i.default,d=new i.default;window.addEventListener("message",(function(e){if(e.source!=window)return;const t=e.data;"HOOK_SCRIPT"===t.to&&l.dispatch(t.id,t.message)}));const p=(e,t,r)=>{const n=r?f.getId():null,o={id:n,message:e,to:"CONTENT_SCRIPT",from:"HOOK_SCRIPT",extensionName:"MOKKU",type:t};if(window.postMessage(o,"*"),null!==n)return new Promise(e=>{l.addLister(n,e)})};s.before((function(e,t){const r=e.url.indexOf("?");-1!==r?e.url.substr(0,r):e.url,-1!==r&&JSON.stringify(a.parse(e.url.substr(r)));e.mokku={id:d.getId()};const n=h(e);p(n,"LOG",!1),p(n,"QUERY",!0).then(e=>{if(e&&e.mockResponse){const r=e.mockResponse,n=r.headers?r.headers.reduce((e,t)=>(e[t.name]=t.value,e),{}):{"content-type":"application/json; charset=UTF-8"},o={status:r.status,text:r.response?r.response:"",headers:n,type:"json"};r.delay?setTimeout(()=>{t(o)},r.delay):t(o)}else t()}).catch(()=>{console.log("something went wrong!")})}));const h=(e,t)=>{var r;const n=e.url.indexOf("?"),o=-1!==n?e.url.substr(0,n):e.url,s=-1!==n?JSON.stringify(a.parse(e.url.substr(n))):void 0;return{request:{url:o,body:"object"==typeof e.body?JSON.stringify(e.body):e.body,queryParams:s,method:e.method,headers:c.getHeaders(e.headers)},response:t,id:null===(r=e.mokku)||void 0===r?void 0:r.id}};s.after((function(e,t){try{if("function"==typeof t.clone){const r=t.clone();if("string"==typeof r.text){const t=h(e,{status:r.status,response:r.text,headers:c.getHeaders(r.headers)});p(t,"LOG",!1)}else r.text().then(t=>{const n=h(e,{status:r.status,response:t,headers:c.getHeaders(r.headers)});p(n,"LOG",!1)})}else{const r=h(e,{status:t.status,response:"string"==typeof t.text?t.text:"Cannot parse response, logging libraries can cause this.",headers:c.getHeaders(t.headers)});p(r,"LOG",!1)}}catch(t){const r=h(e,{status:0,response:void 0,headers:[]});p(r,"LOG",!1),console.log("INJECT_ERROR",t)}}))},112:function(e,t,r){(function(r){var n;(function(o){var s,a,i,u,c,l,f,d,p,h,y,g,m,v,b,x,O,w,j,E,S,N,_,R,L,T,k=[].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1};h=null,h="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:void 0!==r?r:window,O=h.document,d="addEventListener",f="removeEventListener",i="dispatchEvent",v="XMLHttpRequest",p=["load","loadend","loadstart"],s=["progress","abort","error","timeout"],R="undefined"!=typeof navigator&&navigator.useragent?navigator.userAgent:"",E=parseInt((/msie (\d+)/.exec(R.toLowerCase())||[])[1]),isNaN(E)&&(E=parseInt((/trident\/.*; rv:(\d+)/.exec(R.toLowerCase())||[])[1])),(T=Array.prototype).indexOf||(T.indexOf=function(e){var t,r,n;for(t=r=0,n=this.length;r<n;t=++r)if(this[t]===e)return t;return-1}),_=function(e,t){return Array.prototype.slice.call(e,t)},x=function(e){return"returnValue"===e||"totalSize"===e||"position"===e},j=function(e,t){var r;for(r in e)if(e[r],!x(r))try{t[r]=e[r]}catch(e){}return t},S=function(e){return void 0===e?null:e},N=function(e,t,r){var n,o,s,a;for(o=function(e){return function(n){var o,s,a;for(s in o={},n)x(s)||(a=n[s],o[s]=a===t?r:a);return r[i](e,o)}},s=0,a=e.length;s<a;s++)n=e[s],r._has(n)&&(t["on"+n]=o(n))},w=function(e){var t;if(O&&null!=O.createEventObject)return(t=O.createEventObject()).type=e,t;try{return new Event(e)}catch(t){return{type:e}}},(L=(a=function(e){var t,r,n;return r={},n=function(e){return r[e]||[]},(t={})[d]=function(e,t,s){r[e]=n(e),r[e].indexOf(t)>=0||(s=s===o?r[e].length:s,r[e].splice(s,0,t))},t[f]=function(e,t){var s;e!==o?(t===o&&(r[e]=[]),-1!==(s=n(e).indexOf(t))&&n(e).splice(s,1)):r={}},t[i]=function(){var r,o,s,a,i,u,c;for(o=(r=_(arguments)).shift(),e||(r[0]=j(r[0],w(o))),(a=t["on"+o])&&a.apply(t,r),s=i=0,u=(c=n(o).concat(n("*"))).length;i<u;s=++i)c[s].apply(t,r)},t._has=function(e){return!(!r[e]&&!t["on"+e])},e&&(t.listeners=function(e){return _(n(e))},t.on=t[d],t.off=t[f],t.fire=t[i],t.once=function(e,r){var n;return n=function(){return t.off(e,n),r.apply(null,arguments)},t.on(e,n)},t.destroy=function(){return r={}}),t})(!0)).EventEmitter=a,L.before=function(e,t){if(e.length<1||e.length>2)throw"invalid hook";return L[d]("before",e,t)},L.after=function(e,t){if(e.length<2||e.length>3)throw"invalid hook";return L[d]("after",e,t)},L.enable=function(){h[v]=m,"function"==typeof y&&(h.fetch=y),c&&(h.FormData=g)},L.disable=function(){h[v]=L[v],h.fetch=L.fetch,c&&(h.FormData=c)},b=L.headers=function(e,t){var r,n,o,s,a,i,u,c,l;switch(null==t&&(t={}),typeof e){case"object":for(o in n=[],e)a=e[o],s=o.toLowerCase(),n.push(s+":\t"+a);return n.join("\n")+"\n";case"string":for(u=0,c=(n=e.split("\n")).length;u<c;u++)r=n[u],/([^:]+):\s*(.+)/.test(r)&&(s=null!=(l=RegExp.$1)?l.toLowerCase():void 0,i=RegExp.$2,null==t[s]&&(t[s]=i));return t}},c=h.FormData,g=function(e){var t,r;this.fd=e?new c(e):new c,this.form=e,t=[],Object.defineProperty(this,"entries",{get:function(){return(e?_(e.querySelectorAll("input,select")).filter((function(e){var t;return"checkbox"!==(t=e.type)&&"radio"!==t||e.checked})).map((function(e){return[e.name,"file"===e.type?e.files:e.value]})):[]).concat(t)}}),this.append=(r=this,function(){var e;return e=_(arguments),t.push(e),r.fd.append.apply(r.fd,e)})},c&&(L.FormData=c,h.FormData=g),l=h[v],L[v]=l,m=h[v]=function(){var e,t,r,n,o,u,c,l,f,h,y,m,x,O,w,_,R,T,C,F;R=new L[v],x=null,u=void 0,O=void 0,y=void 0,f=function(){var e,t,r,n;if(y.status=x||R.status,-1===x&&E<10||(y.statusText=R.statusText),-1!==x)for(e in n=b(R.getAllResponseHeaders()))r=n[e],y.headers[e]||(t=e.toLowerCase(),y.headers[t]=r)},l=function(){if(R.responseType&&"text"!==R.responseType)"document"===R.responseType?(y.xml=R.responseXML,y.data=R.responseXML):y.data=R.response;else{y.text=R.responseText,y.data=R.responseText;try{y.xml=R.responseXML}catch(e){}}"responseURL"in R&&(y.finalUrl=R.responseURL)},_=function(){o.status=y.status,o.statusText=y.statusText},w=function(){"text"in y&&(o.responseText=y.text),"xml"in y&&(o.responseXML=y.xml),"data"in y&&(o.response=y.data),"finalUrl"in y&&(o.responseURL=y.finalUrl)},r=function(r){for(;r>e&&e<4;)o.readyState=++e,1===e&&o[i]("loadstart",{}),2===e&&_(),4===e&&(_(),w()),o[i]("readystatechange",{}),4===e&&(!1===h.async?t():setTimeout(t,0))},t=function(){u||o[i]("load",{}),o[i]("loadend",{}),u&&(o.readyState=0)},e=0,m=function(e){var t,n;4===e?(t=L.listeners("after"),(n=function(){var e;return t.length?2===(e=t.shift()).length?(e(h,y),n()):3===e.length&&h.async?e(h,y,n):n():r(4)})()):r(e)},o=(h={}).xhr=a(),R.onreadystatechange=function(e){try{2===R.readyState&&f()}catch(e){}4===R.readyState&&(O=!1,f(),l()),m(R.readyState)},c=function(){u=!0},o[d]("error",c),o[d]("timeout",c),o[d]("abort",c),o[d]("progress",(function(){e<3?m(3):o[i]("readystatechange",{})})),("withCredentials"in R||L.addWithCredentials)&&(o.withCredentials=!1),o.status=0;for(T=0,C=(F=s.concat(p)).length;T<C;T++)n=F[T],o["on"+n]=null;return o.open=function(t,r,n,o,s){e=0,u=!1,O=!1,h.headers={},h.headerNames={},h.status=0,(y={}).headers={},h.method=t,h.url=r,h.async=!1!==n,h.user=o,h.pass=s,m(1)},o.send=function(e){var t,r,n,a,i,u,c,l;for(u=0,c=(l=["type","timeout","withCredentials"]).length;u<c;u++)(n="type"===(r=l[u])?"responseType":r)in o&&(h[r]=o[n]);h.body=e,i=function(){var e,t,a,i,u,c;for(N(s,R,o),o.upload&&N(s.concat(p),R.upload,o.upload),O=!0,R.open(h.method,h.url,h.async,h.user,h.pass),a=0,i=(u=["type","timeout","withCredentials"]).length;a<i;a++)n="type"===(r=u[a])?"responseType":r,r in h&&(R[n]=h[r]);for(e in c=h.headers)t=c[e],e&&R.setRequestHeader(e,t);h.body instanceof g&&(h.body=h.body.fd),R.send(h.body)},t=L.listeners("before"),(a=function(){var e,r;return t.length?((e=function(e){if("object"==typeof e&&("number"==typeof e.status||"number"==typeof y.status))return j(e,y),k.call(e,"data")<0&&(e.data=e.response||e.text),void m(4);a()}).head=function(e){return j(e,y),m(2)},e.progress=function(e){return j(e,y),m(3)},1===(r=t.shift()).length?e(r(h)):2===r.length&&h.async?r(h,e):e()):i()})()},o.abort=function(){x=-1,O?R.abort():o[i]("abort",{})},o.setRequestHeader=function(e,t){var r,n;r=null!=e?e.toLowerCase():void 0,n=h.headerNames[r]=h.headerNames[r]||e,h.headers[n]&&(t=h.headers[n]+", "+t),h.headers[n]=t},o.getResponseHeader=function(e){var t;return t=null!=e?e.toLowerCase():void 0,S(y.headers[t])},o.getAllResponseHeaders=function(){return S(b(y.headers))},R.overrideMimeType&&(o.overrideMimeType=function(){return R.overrideMimeType.apply(R,arguments)}),R.upload&&(o.upload=h.upload=a()),o.UNSENT=0,o.OPENED=1,o.HEADERS_RECEIVED=2,o.LOADING=3,o.DONE=4,o.response="",o.responseText="",o.responseXML=null,o.readyState=0,o.statusText="",o},"function"==typeof h.fetch&&(u=h.fetch,L.fetch=u,y=h.fetch=function(e,t){var r,n,o;return null==t&&(t={headers:{}}),t.url=e,o=null,n=L.listeners("before"),r=L.listeners("after"),new Promise((function(e,s){var a,i,c,l,f;i=function(){return t.body instanceof g&&(t.body=t.body.fd),t.headers&&(t.headers=new Headers(t.headers)),o||(o=new Request(t.url,t)),j(t,o)},c=function(t){var n;return r.length?2===(n=r.shift()).length?(n(i(),t),c(t)):3===n.length?n(i(),t,c):c(t):e(t)},a=function(t){var r;if(void 0!==t)return r=new Response(t.body||t.text,t),e(r),void c(r);l()},l=function(){var e;if(n.length)return 1===(e=n.shift()).length?a(e(t)):2===e.length?e(i(),a):void 0;f()},f=function(){return u(i()).then((function(e){return c(e)})).catch((function(e){return c(e),s(e)}))},l()}))}),m.UNSENT=0,m.OPENED=1,m.HEADERS_RECEIVED=2,m.LOADING=3,m.DONE=4,(n=function(){return L}.apply(t,[]))===o||(e.exports=n)}).call(this)}).call(this,r(13))},113:function(e,t,r){"use strict";const n=r(114),o=r(115),s=r(116);function a(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function i(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function u(e,t){return t.decode?o(e):e}function c(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function l(e){const t=(e=c(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function f(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function d(e,t){a((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const o="string"==typeof r&&r.split("").indexOf(e.arrayFormatSeparator)>-1?r.split(e.arrayFormatSeparator).map(t=>u(t,e)):null===r?r:u(r,e);n[t]=o};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const o of e.split("&")){let[e,a]=s(t.decode?o.replace(/\+/g," "):o,"=");a=void 0===a?null:["comma","separator"].includes(t.arrayFormat)?a:u(a,t),r(u(e,t),a,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=f(r[e],t);else n[e]=f(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(r):e[t]=r,e},Object.create(null))}t.extract=l,t.parse=d,t.stringify=(e,t)=>{if(!e)return"";a((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const o=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[i(t,e),"[",o,"]"].join("")]:[...r,[i(t,e),"[",i(o,e),"]=",i(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[i(t,e),"[]"].join("")]:[...r,[i(t,e),"[]=",i(n,e)].join("")];case"comma":case"separator":return t=>(r,n)=>null==n||0===n.length?r:0===r.length?[[i(t,e),"=",i(n,e)].join("")]:[[r,i(n,e)].join(e.arrayFormatSeparator)];default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,i(t,e)]:[...r,[i(t,e),"=",i(n,e)].join("")]}}(t),o={};for(const t of Object.keys(e))r(t)||(o[t]=e[t]);const s=Object.keys(o);return!1!==t.sort&&s.sort(t.sort),s.map(r=>{const o=e[r];return void 0===o?"":null===o?i(r,t):Array.isArray(o)?o.reduce(n(r),[]).join("&"):i(r,t)+"="+i(o,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=s(e,"#");return Object.assign({url:r.split("?")[0]||"",query:d(l(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:u(n,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0},r);const n=c(e.url).split("?")[0]||"",o=t.extract(e.url),s=t.parse(o,{sort:!1}),a=Object.assign(s,e.query);let u=t.stringify(a,r);u&&(u="?"+u);let l=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(l="#"+i(e.fragmentIdentifier,r)),`${n}${u}${l}`}},114:function(e,t,r){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase())},115:function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function s(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],s(r),s(n))}function a(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=s(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=o.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=a(r[0]);n!==r[0]&&(t[r[0]]=n)}r=o.exec(e)}t["%C2"]="�";for(var s=Object.keys(t),i=0;i<s.length;i++){var u=s[i];e=e.replace(new RegExp(u,"g"),t[u])}return e}(e)}}},116:function(e,t,r){"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},117:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this._id=0}getId(){return this._id++,this._id}}},118:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this._collector={}}dispatch(e,t){this._collector[e]?this._collector[e](t):this._defaultListner(t)}addLister(e,t){this._collector[e]=t}createDefaultListener(e){this._defaultListner=e}}},13:function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},51:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isValidJSON=e=>{try{return JSON.parse(e),{error:void 0}}catch(t){let r=void 0,n=void 0;const o=new RegExp(/(?<=\bposition\s)(\w+)/g),s=t.toString();if("Unexpected end of JSON input"!==s){const t=o.exec(s);if(r=t&&t.length>0?parseInt(t[0],10):void 0,r){n=1;for(let t=0;t<e.length&&t!==r;t++)"\n"===e[t]&&n++}o.lastIndex=0}return{error:`${s}${n?" and at line number "+n:""}`,position:r,lineNumber:n}}},t.getError=e=>{const t=Object.keys(e);return 0===t.length?void 0:e[t[0]]},t.getHeaders=e=>Object.keys(e).map(t=>({name:t,value:e[t]}))}});