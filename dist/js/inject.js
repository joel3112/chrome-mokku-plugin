(()=>{"use strict";var e={4020:e=>{var t="%[a-f0-9]{2}",n=new RegExp(t,"gi"),r=new RegExp("("+t+")+","gi");function o(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var n=e.slice(0,t),r=e.slice(t);return Array.prototype.concat.call([],o(n),o(r))}function s(e){try{return decodeURIComponent(e)}catch(s){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=o(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},n=r.exec(e);n;){try{t[n[0]]=decodeURIComponent(n[0])}catch(e){var o=s(n[0]);o!==n[0]&&(t[n[0]]=o)}n=r.exec(e)}t["%C2"]="�";for(var a=Object.keys(t),i=0;i<a.length;i++){var u=a[i];e=e.replace(new RegExp(u,"g"),t[u])}return e}(e)}}},7563:(e,t,n)=>{const r=n(610),o=n(4020),s=n(500);function a(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function i(e,t){return t.encode?t.strict?r(e):encodeURIComponent(e):e}function u(e,t){return t.decode?o(e):e}function c(e){return Array.isArray(e)?e.sort():"object"==typeof e?c(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function l(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function d(e){const t=(e=l(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function f(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function p(e,t){a((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const n=function(e){let t;switch(e.arrayFormat){case"index":return(e,n,r)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===r[e]&&(r[e]={}),r[e][t[1]]=n):r[e]=n};case"bracket":return(e,n,r)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==r[e]?r[e]=[].concat(r[e],n):r[e]=[n]:r[e]=n};case"comma":case"separator":return(t,n,r)=>{const o="string"==typeof n&&n.split("").indexOf(e.arrayFormatSeparator)>-1?n.split(e.arrayFormatSeparator).map((t=>u(t,e))):null===n?n:u(n,e);r[t]=o};default:return(e,t,n)=>{void 0!==n[e]?n[e]=[].concat(n[e],t):n[e]=t}}}(t),r=Object.create(null);if("string"!=typeof e)return r;if(!(e=e.trim().replace(/^[?#&]/,"")))return r;for(const o of e.split("&")){let[e,a]=s(t.decode?o.replace(/\+/g," "):o,"=");a=void 0===a?null:["comma","separator"].includes(t.arrayFormat)?a:u(a,t),n(u(e,t),a,r)}for(const e of Object.keys(r)){const n=r[e];if("object"==typeof n&&null!==n)for(const e of Object.keys(n))n[e]=f(n[e],t);else r[e]=f(n,t)}return!1===t.sort?r:(!0===t.sort?Object.keys(r).sort():Object.keys(r).sort(t.sort)).reduce(((e,t)=>{const n=r[t];return Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?e[t]=c(n):e[t]=n,e}),Object.create(null))}t.extract=d,t.parse=p,t.stringify=(e,t)=>{if(!e)return"";a((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const n=n=>t.skipNull&&null==e[n]||t.skipEmptyString&&""===e[n],r=function(e){switch(e.arrayFormat){case"index":return t=>(n,r)=>{const o=n.length;return void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[i(t,e),"[",o,"]"].join("")]:[...n,[i(t,e),"[",i(o,e),"]=",i(r,e)].join("")]};case"bracket":return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[i(t,e),"[]"].join("")]:[...n,[i(t,e),"[]=",i(r,e)].join("")];case"comma":case"separator":return t=>(n,r)=>null==r||0===r.length?n:0===n.length?[[i(t,e),"=",i(r,e)].join("")]:[[n,i(r,e)].join(e.arrayFormatSeparator)];default:return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,i(t,e)]:[...n,[i(t,e),"=",i(r,e)].join("")]}}(t),o={};for(const t of Object.keys(e))n(t)||(o[t]=e[t]);const s=Object.keys(o);return!1!==t.sort&&s.sort(t.sort),s.map((n=>{const o=e[n];return void 0===o?"":null===o?i(n,t):Array.isArray(o)?o.reduce(r(n),[]).join("&"):i(n,t)+"="+i(o,t)})).filter((e=>e.length>0)).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[n,r]=s(e,"#");return Object.assign({url:n.split("?")[0]||"",query:p(d(e),t)},t&&t.parseFragmentIdentifier&&r?{fragmentIdentifier:u(r,t)}:{})},t.stringifyUrl=(e,n)=>{n=Object.assign({encode:!0,strict:!0},n);const r=l(e.url).split("?")[0]||"",o=t.extract(e.url),s=t.parse(o,{sort:!1}),a=Object.assign(s,e.query);let u=t.stringify(a,n);u&&(u=`?${u}`);let c=function(e){let t="";const n=e.indexOf("#");return-1!==n&&(t=e.slice(n)),t}(e.url);return e.fragmentIdentifier&&(c=`#${i(e.fragmentIdentifier,n)}`),`${r}${u}${c}`}},500:e=>{e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const n=e.indexOf(t);return-1===n?[e]:[e.slice(0,n),e.slice(n+t.length)]}},610:e=>{e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`))},6624:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(7321)),s=n(7429),a=n(7563),i=r(n(9076)),u=r(n(9338)),c=n(6378),l=r(n(9271)),d=new u.default,f=new i.default;l.default.listen("HOOK",(e=>{d.dispatch(e.id,e.message)}));const p=(e,t,n)=>{const r=n?f.getId():null,o={id:r,message:e,to:"CONTENT",from:"HOOK",extensionName:"MOKKU",type:t};if(l.default.send(o),null!==r)return new Promise((e=>{d.addLister(r,e)}))};o.default.before((function(e,t){e.mokku={id:(0,s.v4)()};const n=y(e);p(n,"LOG",!1),p(n,"NOTIFICATION",!0).then((e=>{if(e&&e.mockResponse){const n=e.mockResponse,r=n.headers?n.headers.reduce(((e,t)=>(e[t.name]=t.value,e)),{}):{"content-type":"application/json; charset=UTF-8"},o={status:n.status,text:n.response?n.response:"",headers:r,type:"json"};n.delay?setTimeout((()=>{t(o)}),n.delay):t(o)}else t()})).catch((()=>{console.log("something went wrong!")}))}));const y=(e,t)=>{var n;const r=e.url.indexOf("?"),o=-1!==r?e.url.substr(0,r):e.url,s=-1!==r?JSON.stringify((0,a.parse)(e.url.substr(r))):void 0;let i=e.body;try{"object"==typeof i&&(i=JSON.stringify(i))}catch(e){i="Unsupported body type!"}return{request:{url:o,body:i,queryParams:s,method:e.method||"GET",headers:(0,c.getHeaders)(e.headers)},response:t,id:null===(n=e.mokku)||void 0===n?void 0:n.id}};o.default.after((function(e,t){try{if("function"==typeof t.clone){const n=t.clone();if("string"==typeof n.text){const t=y(e,{status:n.status,response:n.text,headers:(0,c.getHeaders)(n.headers)});p(t,"LOG",!1)}else n.text().then((t=>{const r=y(e,{status:n.status,response:t,headers:(0,c.getHeaders)(n.headers)});p(r,"LOG",!1)}))}else{const n=y(e,{status:t.status,response:"string"==typeof t.text?t.text:"Cannot parse response, logging libraries can cause this.",headers:(0,c.getHeaders)(t.headers)});p(n,"LOG",!1)}}catch(t){const n=y(e,{status:0,response:void 0,headers:[]});p(n,"LOG",!1),console.log("INJECT_ERROR",t)}}))},6378:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getHeaders=t.getError=t.isValidJSON=void 0,t.isValidJSON=e=>{try{return JSON.parse(e),{error:void 0}}catch(t){let n,r;const o=new RegExp(/(?<=\bposition\s)(\w+)/g),s=t.toString();if("Unexpected end of JSON input"!==s){const t=o.exec(s);if(n=t&&t.length>0?parseInt(t[0],10):void 0,n){r=1;for(let t=0;t<e.length&&t!==n;t++)"\n"===e[t]&&r++}o.lastIndex=0}return{error:`${s}${r?" and at line number "+r:""}`,position:n,lineNumber:r}}},t.getError=e=>{const t=Object.keys(e);return 0===t.length?void 0:e[t[0]]},t.getHeaders=e=>Object.keys(e).map((t=>({name:t,value:e[t]})))},9076:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(){this._id=0}getId(){return this._id++,this._id}}},9271:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});const n={"HOOK:CONTENT":"window","CONTENT:HOOK":"window","CONTENT:PANEL":"tab","PANEL:CONTENT":"runtime"};t.default={send:(e,t)=>{({window:()=>window.postMessage(Object.assign(Object.assign({},e),{extensionName:"MOKKU"}),"*"),runtime:()=>chrome.runtime.sendMessage(Object.assign(Object.assign({},e),{extensionName:"MOKKU"})),tab:()=>{chrome.tabs.sendMessage(t,e)}})[n[`${e.to}:${e.from}`]](e)},listen:(e,t)=>{const n=()=>{chrome.runtime.onMessage.addListener(((n,r,o)=>{n.to===e&&t(n,r,o)}))},r=()=>{window.addEventListener("message",(n=>{if(n.source!==window)return;const r=n.data;r.to===e&&t(r)}))};switch(e){case"HOOK":return void r();case"CONTENT":return r(),void n();case"PANEL":return void n()}}}},9338:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(){this._collector={},this._defaultListner=console.log,this._collector={}}dispatch(e,t){this._collector[e]?this._collector[e](t):this._defaultListner(t)}addLister(e,t){this._collector[e]=t}createDefaultListener(e){this._defaultListner=e}}},7429:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NIL",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return d.default}}),Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"v1",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(t,"v3",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"v4",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"v5",{enumerable:!0,get:function(){return a.default}}),Object.defineProperty(t,"validate",{enumerable:!0,get:function(){return c.default}}),Object.defineProperty(t,"version",{enumerable:!0,get:function(){return u.default}});var r=f(n(3990)),o=f(n(8237)),s=f(n(5355)),a=f(n(3764)),i=f(n(6314)),u=f(n(8464)),c=f(n(6435)),l=f(n(4008)),d=f(n(8222));function f(e){return e&&e.__esModule?e:{default:e}}},4163:(e,t)=>{function n(e){return 14+(e+64>>>9<<4)+1}function r(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function o(e,t,n,o,s,a){return r((i=r(r(t,e),r(o,a)))<<(u=s)|i>>>32-u,n);var i,u}function s(e,t,n,r,s,a,i){return o(t&n|~t&r,e,t,s,a,i)}function a(e,t,n,r,s,a,i){return o(t&r|n&~r,e,t,s,a,i)}function i(e,t,n,r,s,a,i){return o(t^n^r,e,t,s,a,i)}function u(e,t,n,r,s,a,i){return o(n^(t|~r),e,t,s,a,i)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(let n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let o=0;o<n;o+=8){const n=e[o>>5]>>>o%32&255,s=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(s)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[n(t)-1]=t;let o=1732584193,c=-271733879,l=-1732584194,d=271733878;for(let t=0;t<e.length;t+=16){const n=o,f=c,p=l,y=d;o=s(o,c,l,d,e[t],7,-680876936),d=s(d,o,c,l,e[t+1],12,-389564586),l=s(l,d,o,c,e[t+2],17,606105819),c=s(c,l,d,o,e[t+3],22,-1044525330),o=s(o,c,l,d,e[t+4],7,-176418897),d=s(d,o,c,l,e[t+5],12,1200080426),l=s(l,d,o,c,e[t+6],17,-1473231341),c=s(c,l,d,o,e[t+7],22,-45705983),o=s(o,c,l,d,e[t+8],7,1770035416),d=s(d,o,c,l,e[t+9],12,-1958414417),l=s(l,d,o,c,e[t+10],17,-42063),c=s(c,l,d,o,e[t+11],22,-1990404162),o=s(o,c,l,d,e[t+12],7,1804603682),d=s(d,o,c,l,e[t+13],12,-40341101),l=s(l,d,o,c,e[t+14],17,-1502002290),c=s(c,l,d,o,e[t+15],22,1236535329),o=a(o,c,l,d,e[t+1],5,-165796510),d=a(d,o,c,l,e[t+6],9,-1069501632),l=a(l,d,o,c,e[t+11],14,643717713),c=a(c,l,d,o,e[t],20,-373897302),o=a(o,c,l,d,e[t+5],5,-701558691),d=a(d,o,c,l,e[t+10],9,38016083),l=a(l,d,o,c,e[t+15],14,-660478335),c=a(c,l,d,o,e[t+4],20,-405537848),o=a(o,c,l,d,e[t+9],5,568446438),d=a(d,o,c,l,e[t+14],9,-1019803690),l=a(l,d,o,c,e[t+3],14,-187363961),c=a(c,l,d,o,e[t+8],20,1163531501),o=a(o,c,l,d,e[t+13],5,-1444681467),d=a(d,o,c,l,e[t+2],9,-51403784),l=a(l,d,o,c,e[t+7],14,1735328473),c=a(c,l,d,o,e[t+12],20,-1926607734),o=i(o,c,l,d,e[t+5],4,-378558),d=i(d,o,c,l,e[t+8],11,-2022574463),l=i(l,d,o,c,e[t+11],16,1839030562),c=i(c,l,d,o,e[t+14],23,-35309556),o=i(o,c,l,d,e[t+1],4,-1530992060),d=i(d,o,c,l,e[t+4],11,1272893353),l=i(l,d,o,c,e[t+7],16,-155497632),c=i(c,l,d,o,e[t+10],23,-1094730640),o=i(o,c,l,d,e[t+13],4,681279174),d=i(d,o,c,l,e[t],11,-358537222),l=i(l,d,o,c,e[t+3],16,-722521979),c=i(c,l,d,o,e[t+6],23,76029189),o=i(o,c,l,d,e[t+9],4,-640364487),d=i(d,o,c,l,e[t+12],11,-421815835),l=i(l,d,o,c,e[t+15],16,530742520),c=i(c,l,d,o,e[t+2],23,-995338651),o=u(o,c,l,d,e[t],6,-198630844),d=u(d,o,c,l,e[t+7],10,1126891415),l=u(l,d,o,c,e[t+14],15,-1416354905),c=u(c,l,d,o,e[t+5],21,-57434055),o=u(o,c,l,d,e[t+12],6,1700485571),d=u(d,o,c,l,e[t+3],10,-1894986606),l=u(l,d,o,c,e[t+10],15,-1051523),c=u(c,l,d,o,e[t+1],21,-2054922799),o=u(o,c,l,d,e[t+8],6,1873313359),d=u(d,o,c,l,e[t+15],10,-30611744),l=u(l,d,o,c,e[t+6],15,-1560198380),c=u(c,l,d,o,e[t+13],21,1309151649),o=u(o,c,l,d,e[t+4],6,-145523070),d=u(d,o,c,l,e[t+11],10,-1120210379),l=u(l,d,o,c,e[t+2],15,718787259),c=u(c,l,d,o,e[t+9],21,-343485551),o=r(o,n),c=r(c,f),l=r(l,p),d=r(d,y)}return[o,c,l,d]}(function(e){if(0===e.length)return[];const t=8*e.length,r=new Uint32Array(n(t));for(let n=0;n<t;n+=8)r[n>>5]|=(255&e[n/8])<<n%32;return r}(e),8*e.length))}},4790:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};t.default=n},6314:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default="00000000-0000-0000-0000-000000000000"},8222:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(6435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,o.default)(e))throw TypeError("Invalid UUID");let t;const n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n}},5340:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},3319:(e,t)=>{let n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){if(!n&&(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!n))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(r)};const r=new Uint8Array(16)},3757:(e,t)=>{function n(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function r(e,t){return e<<t|e>>>32-t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){const t=[1518500249,1859775393,2400959708,3395469782],o=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);const s=e.length/4+2,a=Math.ceil(s/16),i=new Array(a);for(let t=0;t<a;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];i[t]=n}i[a-1][14]=8*(e.length-1)/Math.pow(2,32),i[a-1][14]=Math.floor(i[a-1][14]),i[a-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<a;++e){const s=new Uint32Array(80);for(let t=0;t<16;++t)s[t]=i[e][t];for(let e=16;e<80;++e)s[e]=r(s[e-3]^s[e-8]^s[e-14]^s[e-16],1);let a=o[0],u=o[1],c=o[2],l=o[3],d=o[4];for(let e=0;e<80;++e){const o=Math.floor(e/20),i=r(a,5)+n(o,u,c,l)+d+t[o]+s[e]>>>0;d=l,l=c,c=r(u,30)>>>0,u=a,a=i}o[0]=o[0]+a>>>0,o[1]=o[1]+u>>>0,o[2]=o[2]+c>>>0,o[3]=o[3]+l>>>0,o[4]=o[4]+d>>>0}return[o[0]>>24&255,o[0]>>16&255,o[0]>>8&255,255&o[0],o[1]>>24&255,o[1]>>16&255,o[1]>>8&255,255&o[1],o[2]>>24&255,o[2]>>16&255,o[2]>>8&255,255&o[2],o[3]>>24&255,o[3]>>16&255,o[3]>>8&255,255&o[3],o[4]>>24&255,o[4]>>16&255,o[4]>>8&255,255&o[4]]}},4008:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.unsafeStringify=a;var r,o=(r=n(6435))&&r.__esModule?r:{default:r};const s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function a(e,t=0){return(s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]).toLowerCase()}t.default=function(e,t=0){const n=a(e,t);if(!(0,o.default)(n))throw TypeError("Stringified UUID is invalid");return n}},3990:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(3319))&&r.__esModule?r:{default:r},s=n(4008);let a,i,u=0,c=0;t.default=function(e,t,n){let r=t&&n||0;const l=t||new Array(16);let d=(e=e||{}).node||a,f=void 0!==e.clockseq?e.clockseq:i;if(null==d||null==f){const t=e.random||(e.rng||o.default)();null==d&&(d=a=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==f&&(f=i=16383&(t[6]<<8|t[7]))}let p=void 0!==e.msecs?e.msecs:Date.now(),y=void 0!==e.nsecs?e.nsecs:c+1;const h=p-u+(y-c)/1e4;if(h<0&&void 0===e.clockseq&&(f=f+1&16383),(h<0||p>u)&&void 0===e.nsecs&&(y=0),y>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");u=p,c=y,i=f,p+=122192928e5;const g=(1e4*(268435455&p)+y)%4294967296;l[r++]=g>>>24&255,l[r++]=g>>>16&255,l[r++]=g>>>8&255,l[r++]=255&g;const v=p/4294967296*1e4&268435455;l[r++]=v>>>8&255,l[r++]=255&v,l[r++]=v>>>24&15|16,l[r++]=v>>>16&255,l[r++]=f>>>8|128,l[r++]=255&f;for(let e=0;e<6;++e)l[r+e]=d[e];return t||(0,s.unsafeStringify)(l)}},8237:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=s(n(7925)),o=s(n(4163));function s(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v3",48,o.default);t.default=a},7925:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=void 0,t.default=function(e,t,n){function r(e,r,a,i){var u;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=(0,s.default)(r)),16!==(null===(u=r)||void 0===u?void 0:u.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+e.length);if(c.set(r),c.set(e,r.length),c=n(c),c[6]=15&c[6]|t,c[8]=63&c[8]|128,a){i=i||0;for(let e=0;e<16;++e)a[i+e]=c[e];return a}return(0,o.unsafeStringify)(c)}try{r.name=e}catch(e){}return r.DNS=a,r.URL=i,r};var r,o=n(4008),s=(r=n(8222))&&r.__esModule?r:{default:r};const a="6ba7b810-9dad-11d1-80b4-00c04fd430c8";t.DNS=a;const i="6ba7b811-9dad-11d1-80b4-00c04fd430c8";t.URL=i},5355:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n(4790)),o=a(n(3319)),s=n(4008);function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t,n){if(r.default.randomUUID&&!t&&!e)return r.default.randomUUID();const a=(e=e||{}).random||(e.rng||o.default)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=a[e];return t}return(0,s.unsafeStringify)(a)}},3764:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=s(n(7925)),o=s(n(3757));function s(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v5",80,o.default);t.default=a},6435:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(5340))&&r.__esModule?r:{default:r};t.default=function(e){return"string"==typeof e&&o.default.test(e)}},8464:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(6435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,o.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}},7321:(e,t,n)=>{n.r(t),n.d(t,{default:()=>E});const r=(e,t)=>Array.prototype.slice.call(e,t);let o=null;"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?o=self:void 0!==n.g?o=n.g:window&&(o=window);const s=o,a=o.document,i=["load","loadend","loadstart"],u=["progress","abort","error","timeout"],c=e=>["returnValue","totalSize","position"].includes(e),l=function(e,t){for(let n in e){if(c(n))continue;const r=e[n];try{t[n]=r}catch(e){}}return t},d=function(e,t,n){const r=e=>function(r){const o={};for(let e in r){if(c(e))continue;const s=r[e];o[e]=s===t?n:s}return n.dispatchEvent(e,o)};for(let o of Array.from(e))n._has(o)&&(t[`on${o}`]=r(o))},f=function(e){let t={};const n=e=>t[e]||[],o={addEventListener:function(e,r,o){t[e]=n(e),t[e].indexOf(r)>=0||(o=void 0===o?t[e].length:o,t[e].splice(o,0,r))},removeEventListener:function(e,r){if(void 0===e)return void(t={});void 0===r&&(t[e]=[]);const o=n(e).indexOf(r);-1!==o&&n(e).splice(o,1)},dispatchEvent:function(){const t=r(arguments),s=t.shift();e||(t[0]=l(t[0],function(e){if(a&&null!=a.createEventObject){const t=a.createEventObject();return t.type=e,t}try{return new Event(e)}catch(t){return{type:e}}}(s)));const i=o[`on${s}`];i&&i.apply(o,t);const u=n(s).concat(n("*"));for(let e=0;e<u.length;e++)u[e].apply(o,t)},_has:e=>!(!t[e]&&!o[`on${e}`])};return e&&(o.listeners=e=>r(n(e)),o.on=o.addEventListener,o.off=o.removeEventListener,o.fire=o.dispatchEvent,o.once=function(e,t){var n=function(){return o.off(e,n),t.apply(null,arguments)};return o.on(e,n)},o.destroy=()=>t={}),o};var p=function(e,t){switch(typeof e){case"object":return n=e,Object.entries(n).map((([e,t])=>`${e.toLowerCase()}: ${t}`)).join("\r\n");case"string":return function(e,t){const n=e.split("\r\n");null==t&&(t={});for(let e of n)if(/([^:]+):\s*(.+)/.test(e)){const e=null!=RegExp.$1?RegExp.$1.toLowerCase():void 0,n=RegExp.$2;null==t[e]&&(t[e]=n)}return t}(e,t)}var n;return[]};const y=f(!0),h=e=>void 0===e?null:e,g=s.XMLHttpRequest,v=function(){const e=new g,t={};let n,r,o,s=null;var a=0;const c=function(){if(o.status=s||e.status,-1!==s&&(o.statusText=e.statusText),-1===s);else{const t=p(e.getAllResponseHeaders());for(let e in t){const n=t[e];if(!o.headers[e]){const t=e.toLowerCase();o.headers[t]=n}}}},v=function(){j.status=o.status,j.statusText=o.statusText},b=function(){n||j.dispatchEvent("load",{}),j.dispatchEvent("loadend",{}),n&&(j.readyState=0)},m=function(e){for(;e>a&&a<4;)j.readyState=++a,1===a&&j.dispatchEvent("loadstart",{}),2===a&&v(),4===a&&(v(),"text"in o&&(j.responseText=o.text),"xml"in o&&(j.responseXML=o.xml),"data"in o&&(j.response=o.data),"finalUrl"in o&&(j.responseURL=o.finalUrl)),j.dispatchEvent("readystatechange",{}),4===a&&(!1===t.async?b():setTimeout(b,0))},O=function(e){if(4!==e)return void m(e);const n=y.listeners("after");var r=function(){if(n.length>0){const e=n.shift();2===e.length?(e(t,o),r()):3===e.length&&t.async?e(t,o,r):r()}else m(4)};r()};var j=f();t.xhr=j,e.onreadystatechange=function(t){try{2===e.readyState&&c()}catch(e){}4===e.readyState&&(r=!1,c(),function(){if(e.responseType&&"text"!==e.responseType)"document"===e.responseType?(o.xml=e.responseXML,o.data=e.responseXML):o.data=e.response;else{o.text=e.responseText,o.data=e.responseText;try{o.xml=e.responseXML}catch(e){}}"responseURL"in e&&(o.finalUrl=e.responseURL)}()),O(e.readyState)};const w=function(){n=!0};j.addEventListener("error",w),j.addEventListener("timeout",w),j.addEventListener("abort",w),j.addEventListener("progress",(function(t){a<3?O(3):e.readyState<=3&&j.dispatchEvent("readystatechange",{})})),"withCredentials"in e&&(j.withCredentials=!1),j.status=0;for(let e of Array.from(u.concat(i)))j[`on${e}`]=null;if(j.open=function(e,s,i,u,c){a=0,n=!1,r=!1,t.headers={},t.headerNames={},t.status=0,t.method=e,t.url=s,t.async=!1!==i,t.user=u,t.pass=c,o={},o.headers={},O(1)},j.send=function(n){let s,a;for(s of["type","timeout","withCredentials"])a="type"===s?"responseType":s,a in j&&(t[s]=j[a]);t.body=n;const c=y.listeners("before");var f=function(){if(!c.length)return function(){for(s of(d(u,e,j),j.upload&&d(u.concat(i),e.upload,j.upload),r=!0,e.open(t.method,t.url,t.async,t.user,t.pass),["type","timeout","withCredentials"]))a="type"===s?"responseType":s,s in t&&(e[a]=t[s]);for(let n in t.headers){const r=t.headers[n];n&&e.setRequestHeader(n,r)}e.send(t.body)}();const n=function(e){if("object"==typeof e&&("number"==typeof e.status||"number"==typeof o.status))return l(e,o),"data"in e||(e.data=e.response||e.text),void O(4);f()};n.head=function(e){l(e,o),O(2)},n.progress=function(e){l(e,o),O(3)};const p=c.shift();1===p.length?n(p(t)):2===p.length&&t.async?p(t,n):n()};f()},j.abort=function(){s=-1,r?e.abort():j.dispatchEvent("abort",{})},j.setRequestHeader=function(e,n){const r=null!=e?e.toLowerCase():void 0,o=t.headerNames[r]=t.headerNames[r]||e;t.headers[o]&&(n=t.headers[o]+", "+n),t.headers[o]=n},j.getResponseHeader=e=>h(o.headers[e?e.toLowerCase():void 0]),j.getAllResponseHeaders=()=>h(p(o.headers)),e.overrideMimeType&&(j.overrideMimeType=function(){e.overrideMimeType.apply(e,arguments)}),e.upload){let e=f();j.upload=e,t.upload=e}return j.UNSENT=0,j.OPENED=1,j.HEADERS_RECEIVED=2,j.LOADING=3,j.DONE=4,j.response="",j.responseText="",j.responseXML=null,j.readyState=0,j.statusText="",j};v.UNSENT=0,v.OPENED=1,v.HEADERS_RECEIVED=2,v.LOADING=3,v.DONE=4;var b={patch(){g&&(s.XMLHttpRequest=v)},unpatch(){g&&(s.XMLHttpRequest=g)},Native:g,Xhook:v};const m=s.fetch;function O(e){return e instanceof Headers?j([...e.entries()]):Array.isArray(e)?j(e):e}function j(e){return e.reduce(((e,[t,n])=>(e[t]=n,e)),{})}const w=function(e,t={headers:{}}){let n=Object.assign(Object.assign({},t),{isFetch:!0});if(e instanceof Request){const r=function(e){let t={};return["method","headers","body","mode","credentials","cache","redirect","referrer","referrerPolicy","integrity","keepalive","signal","url"].forEach((n=>t[n]=e[n])),t}(e),o=Object.assign(Object.assign({},O(r.headers)),O(n.headers));n=Object.assign(Object.assign(Object.assign({},r),t),{headers:o,acceptedRequest:!0})}else n.url=e;const r=y.listeners("before"),o=y.listeners("after");return new Promise((function(e,t){let s=e;const a=function(e){if(!o.length)return s(e);const t=o.shift();return 2===t.length?(t(n,e),a(e)):3===t.length?t(n,e,a):a(e)},i=function(t){if(void 0!==t){const n=new Response(t.body||t.text,t);return e(n),void a(n)}u()},u=function(){if(!r.length)return void c();const e=r.shift();return 1===e.length?i(e(n)):2===e.length?e(n,i):void 0},c=()=>{const{url:e,isFetch:r,acceptedRequest:o}=n,i=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}(n,["url","isFetch","acceptedRequest"]);m(e,i).then((e=>a(e))).catch((function(e){return s=t,a(e),t(e)}))};u()}))};var _={patch(){m&&(s.fetch=w)},unpatch(){m&&(s.fetch=m)},Native:m,Xhook:w};const E=y;E.EventEmitter=f,E.before=function(e,t){if(e.length<1||e.length>2)throw"invalid hook";return E.on("before",e,t)},E.after=function(e,t){if(e.length<2||e.length>3)throw"invalid hook";return E.on("after",e,t)},E.enable=function(){b.patch(),_.patch()},E.disable=function(){b.unpatch(),_.unpatch()},E.XMLHttpRequest=b.Native,E.fetch=_.Native,E.headers=p,E.enable()}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,n),s.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(6624)})();