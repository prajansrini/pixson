/* Pixson v8 — Universal File Encoder with Pixen Ultra */
(function(){
'use strict';
/**
 * Minified by jsDelivr using Terser v5.37.0.
 * Original file: /npm/qrcode-generator@1.4.4/qrcode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,(function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1}))},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}((function(){return qrcode}));

const $=s=>document.querySelector(s);

const tabI=$('#tabImg2Json'),tabJ=$('#tabJson2Img'),tabInd=$('#tabIndicator');
const panelI=$('#panelImg2Json'),panelJ=$('#panelJson2Img');
const imgDrop=$('#imgDropZone'),imgInput=$('#imgFileInput'),imgQueue=$('#imageQueue');
const jsonDrop=$('#jsonDropZone'),jsonInput=$('#jsonFileInput'),jsonText=$('#jsonTextInput');
const addPastedBtn=$('#addPastedJson'),jsonQueue=$('#jsonQueue'),pasteOverlay=$('#pasteOverlay');
const toasts=$('#toastContainer'),themeBtn=$('#themeToggle');

const imgModal = $('#imageModal');
const imgModalImg = $('#imageModalImg');
if(imgModal) {
  imgModal.onclick = (e) => { if (e.target !== imgModalImg) imgModal.classList.remove('active'); };
  imgModal.querySelector('.image-modal-close').onclick = () => imgModal.classList.remove('active');
}
function openImagePreview(src) {
  if(!imgModal || !src) return;
  imgModalImg.src = src;
  imgModal.classList.add('active');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imgModal && imgModal.classList.contains('active')) {
    imgModal.classList.remove('active');
  }
});

function customPrompt(title, btnText = 'OK') {
  return new Promise((resolve) => {
    const modal = document.getElementById('promptModal');
    if(!modal) return resolve(null);
    const titleEl = document.getElementById('promptTitle');
    const inputEl = document.getElementById('promptInput');
    const btnCancel = document.getElementById('promptCancel');
    const btnOk = document.getElementById('promptOk');
    
    titleEl.textContent = title;
    btnOk.textContent = btnText;
    inputEl.value = '';
    
    modal.classList.add('active');
    setTimeout(()=>inputEl.focus(), 100);
    
    const cleanup = () => {
      modal.classList.remove('active');
      btnCancel.onclick = null;
      btnOk.onclick = null;
      inputEl.onkeydown = null;
    };
    
    btnCancel.onclick = () => { cleanup(); resolve(null); };
    btnOk.onclick = () => { cleanup(); resolve(inputEl.value); };
    inputEl.onkeydown = (e) => {
      if (e.key === 'Enter') { cleanup(); resolve(inputEl.value); }
      if (e.key === 'Escape') { cleanup(); resolve(null); }
    };
  });
}

function getImgRowState(r){
  if(!r)return'';
  return JSON.stringify({
    o:r.querySelector('.js-orig').checked,
    m:r.querySelector('.js-maxdim').value,
    e:r.querySelector('.js-enc').value,
    f:r.querySelector('.js-fmt').value,
    et:r.querySelector('.js-enc-tog').checked,
    ep:r.querySelector('.js-enc-pass').value
  });
}
function getGenericRowState(r){
  if(!r)return'';
  return JSON.stringify({
    e:r.querySelector('.js-enc').value,
    f:r.querySelector('.js-fmt').value,
    et:r.querySelector('.js-enc-tog').checked,
    ep:r.querySelector('.js-enc-pass').value
  });
}

let imgCtr=0, jsonCtr=0;

// ─── IndexedDB Workspace Auto-Save ──────────────────────────
let db;
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PixsonWorkspaceDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { db = request.result; resolve(db); };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('encodeFiles')) db.createObjectStore('encodeFiles', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('decodeFiles')) db.createObjectStore('decodeFiles', { keyPath: 'id' });
    };
  });
}
function saveFileToDB(storeName, id, file) { if (db) db.transaction(storeName, 'readwrite').objectStore(storeName).put({ id: Number(id), file, name: file.name, type: file.type, size: file.size }); }
function removeFileFromDB(storeName, id) { if (db) { try { db.transaction(storeName, 'readwrite').objectStore(storeName).delete(Number(id)); } catch(e){ console.error(e); } } }
function clearDBStore(storeName) { if (db) db.transaction(storeName, 'readwrite').objectStore(storeName).clear(); }
function loadWorkspace() {
  if (!db) return;
  const txEnc = db.transaction('encodeFiles', 'readonly');
  txEnc.objectStore('encodeFiles').getAll().onsuccess = (e) => {
    for (const rec of e.target.result) { imgCtr = Math.max(imgCtr, rec.id); if (rec.type.startsWith('image/')) addImg(rec.file, true, rec.id); else addGenericFile(rec.file, true, rec.id); }
  };
  const txDec = db.transaction('decodeFiles', 'readonly');
  txDec.objectStore('decodeFiles').getAll().onsuccess = (e) => {
    for (const rec of e.target.result) { jsonCtr = Math.max(jsonCtr, rec.id); addDataFile(rec.file, true, rec.id); }
  };
}
initDB().then(loadWorkspace).catch(e => console.warn('Workspace auto-save unavailable:', e));

// ─── Particles ──────────────────────────────────────────────
(function(){
  const c=$('#bgParticles'),cols=['#3b82f6','#2563eb','#1d4ed8','#60a5fa','#38bdf8'];
  for(let i=0;i<20;i++){const p=document.createElement('div');p.className='bg-particle';
    p.style.left=Math.random()*100+'%';p.style.animationDelay=Math.random()*12+'s';
    p.style.animationDuration=(8+Math.random()*8)+'s';
    p.style.background=cols[Math.floor(Math.random()*cols.length)];
    const s=2+Math.random()*3;p.style.width=p.style.height=s+'px';c.appendChild(p);}
})();

// ─── Toast ──────────────────────────────────────────────────
function toast(m,t='info',ms=2500){
  const d=document.createElement('div');d.className='toast toast-'+t;d.textContent=m;
  toasts.appendChild(d);setTimeout(()=>{d.classList.add('toast-exit');d.onanimationend=()=>d.remove();},ms);
}

// ─── Theme ──────────────────────────────────────────────────
function setTheme(t) {
  document.body.setAttribute('data-theme', t);
  localStorage.setItem('pixson-theme', t);
  const logo = document.getElementById('mainLogoImg');
  if (logo) logo.src = (t === 'light') ? 'logol.png' : 'logop.png';
}
const sv=localStorage.getItem('pixson-theme');if(sv)setTheme(sv);
themeBtn.onclick=()=>setTheme(document.body.getAttribute('data-theme')==='dark'?'light':'dark');

// ─── Tabs ───────────────────────────────────────────────────
function switchTab(m){
  const isI=m==='img';
  tabI.classList.toggle('active',isI);tabJ.classList.toggle('active',!isI);
  panelI.classList.toggle('active',isI);panelJ.classList.toggle('active',!isI);
  tabInd.classList.toggle('right',!isI);
}
tabI.onclick=()=>switchTab('img');tabJ.onclick=()=>switchTab('json');
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
  const k = e.key.toLowerCase();
  if (k === 'e') switchTab('img');
  else if (k === 'd') switchTab('json');
});

// ─── Helpers ────────────────────────────────────────────────
function fmtSz(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(2)+' MB';}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function dlBlob(b,n){const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5e3);}
function c2h(c){return c.toString(16).padStart(2,'0');}
function rgbHex(r,g,b){return c2h(r)+c2h(g)+c2h(b);}
function rgbInt(r,g,b){return(r<<16)|(g<<8)|b;}
function showProgress(row){const p=row.querySelector('.row-progress');if(p)p.classList.add('active');}
function hideProgress(row){const p=row.querySelector('.row-progress');if(p)p.classList.remove('active');}

// ─── Cryptography (AES-256-GCM) ─────────────────────────────
async function deriveKey(password, salt) {
  const enc=new TextEncoder();
  const keyMaterial=await crypto.subtle.importKey('raw', enc.encode(password), {name: 'PBKDF2'}, false, ['deriveBits', 'deriveKey']);
  return crypto.subtle.deriveKey({name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256'}, keyMaterial, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
}
async function encryptData(u8, password) {
  const salt=crypto.getRandomValues(new Uint8Array(16)), iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await deriveKey(password, salt);
  const enc=await crypto.subtle.encrypt({name: 'AES-GCM', iv: iv}, key, u8);
  return { salt: u8ToB64(salt), iv: u8ToB64(iv), data: u8ToB64(new Uint8Array(enc)) };
}
async function decryptData(obj, password) {
  const salt=b64ToU8(obj.salt), iv=b64ToU8(obj.iv), data=b64ToU8(obj.data);
  const key=await deriveKey(password, salt);
  try { return new Uint8Array(await crypto.subtle.decrypt({name: 'AES-GCM', iv: iv}, key, data)); }
  catch(e) { throw new Error('Incorrect password or corrupted data'); }
}

// ─── Encoding ───────────────────────────────────────────────
const ENCS=[
  {id:'hex',label:'Hex string',size:'Medium'},
  {id:'int',label:'24-bit integer',size:'Small'},
  {id:'packed',label:'Packed array',size:'Small'},
  {id:'base64',label:'Base64 binary',size:'Smaller'},
  {id:'pixen',label:'Pixen',size:'Smallest'},
  {id:'pixenultra',label:'Pixen Ultra',size:'Ultra'},
  {id:'webp',label:'WebP Lossless',size:'Ultimate'}
];

function encOptHTML(){
  return ENCS.map(e=>'<option value="'+e.id+'">'+e.label+' ('+e.size+')</option>').join('');
}

async function readStreamFully(readable){
  const chunks=[];const reader=readable.getReader();
  while(true){const{done,value}=await reader.read();if(done)break;chunks.push(value);}
  const total=chunks.reduce((a,c)=>a+c.length,0);
  const result=new Uint8Array(total);let off=0;
  for(const c of chunks){result.set(c,off);off+=c.length;}
  return result;
}

async function compressBytes(bytes){
  const cs=new CompressionStream('deflate');
  const writer=cs.writable.getWriter();
  writer.write(bytes);writer.close();
  return await readStreamFully(cs.readable);
}
async function decompressBytes(bytes){
  const ds=new DecompressionStream('deflate');
  const writer=ds.writable.getWriter();
  writer.write(bytes);writer.close();
  return await readStreamFully(ds.readable);
}

// GZIP JSON Helpers
async function gzipJSON(jsonStr){
  const enc=new TextEncoder().encode(jsonStr);
  const cs=new CompressionStream('gzip');
  const writer=cs.writable.getWriter();
  writer.write(enc);writer.close();
  return await readStreamFully(cs.readable);
}
async function ungzipJSON(u8){
  const ds=new DecompressionStream('gzip');
  const writer=ds.writable.getWriter();
  writer.write(u8);writer.close();
  const res=await readStreamFully(ds.readable);
  return new TextDecoder().decode(res);
}

// PXN Binary Format Helpers
function createPxnBinary(w, h, deflatedBytes, encType) {
  const buf = new ArrayBuffer(13 + deflatedBytes.length);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  u8[0]=80; u8[1]=88; u8[2]=69; u8[3]=78; // PXEN
  view.setUint32(4, w, true);
  view.setUint32(8, h, true);
  u8[12]=encType||1; // 1 = Pixen, 2 = Pixen Ultra
  u8.set(deflatedBytes, 13);
  return u8;
}
function createGenericPxnBinary(filename, mimeType, originalSize, deflatedBytes) {
  const enc = new TextEncoder();
  const nameBytes = enc.encode(filename);
  const mimeBytes = enc.encode(mimeType);
  const buf = new ArrayBuffer(13 + 4 + 1 + nameBytes.length + 1 + mimeBytes.length + deflatedBytes.length);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  u8[0]=80; u8[1]=88; u8[2]=69; u8[3]=78; // PXEN
  view.setUint32(4, 0, true);
  view.setUint32(8, 0, true);
  u8[12] = 3; // Generic File
  view.setUint32(13, originalSize, true);
  let off = 17;
  u8[off++] = nameBytes.length; u8.set(nameBytes, off); off += nameBytes.length;
  u8[off++] = mimeBytes.length; u8.set(mimeBytes, off); off += mimeBytes.length;
  u8.set(deflatedBytes, off);
  return u8;
}
function parsePxnBinary(u8) {
  if (u8.length < 13 || u8[0]!==80 || u8[1]!==88 || u8[2]!==69 || u8[3]!==78) throw new Error("Invalid PXN file");
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const type = u8[12];
  if (type === 3) {
    const originalSize = view.getUint32(13, true);
    let off = 17;
    const nameLen = u8[off++]; const filename = new TextDecoder().decode(u8.slice(off, off + nameLen)); off += nameLen;
    const mimeLen = u8[off++]; const mimeType = new TextDecoder().decode(u8.slice(off, off + mimeLen)); off += mimeLen;
    return { type, originalSize, filename, mimeType, data: u8.slice(off) };
  }
  return { w: view.getUint32(4, true), h: view.getUint32(8, true), type, data: u8.slice(13) };
}

function u8ToB64(u8){
  let b='';const chunk=8192;
  for(let i=0;i<u8.length;i+=chunk)b+=String.fromCharCode.apply(null,u8.subarray(i,i+chunk));
  return btoa(b);
}
function b64ToU8(s){const b=atob(s);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function u8ToBase85(u8) {
  let b = '', a = 0, c = 0;
  for (let i = 0; i < u8.length; i++) {
    a = (a * 256) + u8[i]; c++;
    if (c === 4) {
      if (a === 0) b += 'z';
      else { let chunk = ''; for (let j = 0; j < 5; j++) { chunk = String.fromCharCode(33 + (a % 85)) + chunk; a = Math.floor(a / 85); } b += chunk; }
      a = 0; c = 0;
    }
  }
  if (c > 0) {
    for (let i = c; i < 4; i++) a *= 256;
    let chunk = ''; for (let j = 0; j < 5; j++) { chunk = String.fromCharCode(33 + (a % 85)) + chunk; a = Math.floor(a / 85); }
    b += chunk.substring(0, c + 1);
  }
  return '<~' + b + '~>';
}
function base85ToU8(s) {
  if (s.startsWith('<~')) s = s.substring(2, s.length - 2);
  s = s.replace(/\s/g, '');
  const u = []; let a = 0, c = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'z') { if (c !== 0) throw new Error("Invalid b85"); u.push(0,0,0,0); }
    else {
      a = (a * 85) + (s.charCodeAt(i) - 33); c++;
      if (c === 5) { u.push((a>>>24)&255, (a>>>16)&255, (a>>>8)&255, a&255); a=0; c=0; }
    }
  }
  if (c > 0) {
    if (c === 1) throw new Error("Invalid b85 len");
    for (let i = c; i < 5; i++) a = (a * 85) + 84;
    for (let i = 0; i < c - 1; i++) u.push((a>>>(24-i*8))&255);
  }
  return new Uint8Array(u);
}
function drawQRCodeWithLogo(text, canvas) {
  if (typeof qrcode === 'undefined') return;
  try {
    let errLvl = 'H';
    if (text.length > 1100) errLvl = 'Q';
    if (text.length > 1500) errLvl = 'M';
    if (text.length > 2000) errLvl = 'L';
    
    const qr = qrcode(0, errLvl);
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount(), cellSize = 6, margin = 4;
    const size = (count * cellSize) + (margin * 2 * cellSize);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    const offset = margin * cellSize;
    
    const isMarker = (r, c) => (r <= 6 && c <= 6) || (r >= count - 7 && c <= 6) || (r <= 6 && c >= count - 7);

    // Draw circular dots for all data modules
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (isMarker(r, c)) continue;
        if (qr.isDark(r, c)) {
          ctx.beginPath();
          ctx.arc(offset + c * cellSize + cellSize/2, offset + r * cellSize + cellSize/2, (cellSize/2) * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw the 3 rounded positioning eyes
    const drawSingleEye = (startRow, startCol) => {
      const cx = offset + startCol * cellSize + 3.5 * cellSize;
      const cy = offset + startRow * cellSize + 3.5 * cellSize;
      
      const w7 = 7 * cellSize, r7 = 2.2 * cellSize;
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx - w7/2, cy - w7/2, w7, w7, r7);
      else ctx.rect(cx - w7/2, cy - w7/2, w7, w7);
      ctx.fill();
      
      const w5 = 5 * cellSize, r5 = 1.3 * cellSize;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx - w5/2, cy - w5/2, w5, w5, r5);
      else ctx.rect(cx - w5/2, cy - w5/2, w5, w5);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      const w3 = 3 * cellSize, r3 = 0.8 * cellSize;
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(cx - w3/2, cy - w3/2, w3, w3, r3);
      else ctx.rect(cx - w3/2, cy - w3/2, w3, w3);
      ctx.fill();
    };
    
    drawSingleEye(0, 0);           // Top Left
    drawSingleEye(count - 7, 0);   // Bottom Left
    drawSingleEye(0, count - 7);   // Top Right

  } catch(e) { console.error("QR Error", e); }
}

function hexDump(u8, max=512) {
  let s = '[BINARY HEX DUMP]\n\n';
  for(let i=0; i<Math.min(u8.length, max); i+=16) {
    let hex = [], ascii = [];
    for(let j=0; j<16; j++) {
      if (i+j < u8.length) {
        let b = u8[i+j];
        hex.push(b.toString(16).padStart(2,'0'));
        ascii.push((b>=32 && b<=126) ? String.fromCharCode(b) : '.');
      } else {
        hex.push('  ');
        ascii.push(' ');
      }
    }
    s += hex.join(' ') + '  |' + ascii.join('') + '|\n';
  }
  if (u8.length > max) s += `\n... (${fmtSz(u8.length - max)} more binary bytes) ...`;
  return s;
}

// ─── Pixen filter helpers ────────────────────────────────────
function filterNone(row){return row;}
function filterSub(row,bpp){
  const out=new Uint8Array(row.length);
  for(let i=0;i<row.length;i++)out[i]=(row[i]-(i>=bpp?row[i-bpp]:0)+256)&0xff;
  return out;
}
function filterUp(row,prev){
  const out=new Uint8Array(row.length);
  for(let i=0;i<row.length;i++)out[i]=(row[i]-(prev?prev[i]:0)+256)&0xff;
  return out;
}
function sumAbs(arr){let s=0;for(let i=0;i<arr.length;i++){const v=arr[i];s+=v<128?v:256-v;}return s;}

function applyBestFilter(rawRows,w){
  const bpp=3, rowLen=w*3;
  const out=new Uint8Array(rawRows.length/w * (1+rowLen));
  let outOff=0;
  for(let y=0;y<rawRows.length/(w*3);y++){
    const rowStart=y*rowLen;
    const row=rawRows.subarray(rowStart,rowStart+rowLen);
    const prev=y>0?rawRows.subarray(rowStart-rowLen,rowStart):null;
    const fNone=filterNone(row), fSub=filterSub(row,bpp), fUp=filterUp(row,prev);
    const sNone=sumAbs(fNone), sSub=sumAbs(fSub), sUp=sumAbs(fUp);
    let best,bestType;
    if(sSub<=sNone&&sSub<=sUp){best=fSub;bestType=1;}
    else if(sUp<=sNone){best=fUp;bestType=2;}
    else{best=fNone;bestType=0;}
    out[outOff++]=bestType;
    out.set(best,outOff);
    outOff+=rowLen;
  }
  return out;
}

function reverseFilters(filtered,w,h){
  const bpp=3,rowLen=w*3;
  const raw=new Uint8Array(h*rowLen);
  let inOff=0;
  for(let y=0;y<h;y++){
    const filterType=filtered[inOff++];
    const outStart=y*rowLen;
    const prevStart=(y-1)*rowLen;
    for(let i=0;i<rowLen;i++){
      let val=filtered[inOff++];
      if(filterType===1)val=(val+(i>=bpp?raw[outStart+i-bpp]:0))&0xff;
      else if(filterType===2)val=(val+(y>0?raw[prevStart+i]:0))&0xff;
      raw[outStart+i]=val;
    }
  }
  return raw;
}

// ─── Pixen Ultra: Palette + RLE + Deflate ─────────────────────
// 1. Quantize similar colors (within tolerance) into a palette
// 2. Map every pixel to a palette index
// 3. Run-length encode consecutive identical indices
// 4. Pack into a binary buffer and deflate
//
// Binary layout (before deflate):
//   [1 byte]  version = 1
//   [2 bytes] palette count (little-endian)
//   [N*3 bytes] palette RGB entries
//   [4 bytes] total pixel count (little-endian)
//   [... RLE pairs ...]
//     If palette <= 256:  [1 byte index][1-2 byte count (varint)]
//     If palette > 256:   [2 byte index LE][1-2 byte count (varint)]
//
// Varint count: if count <= 127, 1 byte. Else 2 bytes (high bit set on first).

function quantizeColors(rawRGB, tolerance) {
  // Spatial-hash quantizer: bucket colors by (r/step, g/step, b/step)
  // so we only compare against colors in nearby buckets.
  const step = Math.max(tolerance, 1);
  const buckets = new Map(); // "br,bg,bb" -> [{r,g,b,idx}]
  const paletteFlat = [];  // flat array of r,g,b,...
  const colorCache = new Map(); // exact rgb key -> palette index
  const indexBuf = new Uint32Array(rawRGB.length / 3);
  const total = rawRGB.length / 3;
  let palCount = 0;
  
  for (let i = 0; i < total; i++) {
    const r = rawRGB[i*3], g = rawRGB[i*3+1], b = rawRGB[i*3+2];
    const key = (r << 16) | (g << 8) | b;
    
    // Exact cache hit (fast path)
    if (colorCache.has(key)) {
      indexBuf[i] = colorCache.get(key);
      continue;
    }
    
    let found = -1;
    if (tolerance > 0) {
      // Check nearby spatial buckets
      const br = (r / step) | 0, bg = (g / step) | 0, bb = (b / step) | 0;
      outer:
      for (let dr = -1; dr <= 1; dr++) {
        for (let dg = -1; dg <= 1; dg++) {
          for (let db = -1; db <= 1; db++) {
            const bk = ((br+dr) << 16) | ((bg+dg) << 8) | (bb+db);
            const bucket = buckets.get(bk);
            if (!bucket) continue;
            for (let j = 0; j < bucket.length; j++) {
              const e = bucket[j];
              if (Math.abs(r - e.r) <= tolerance && Math.abs(g - e.g) <= tolerance && Math.abs(b - e.b) <= tolerance) {
                found = e.idx;
                break outer;
              }
            }
          }
        }
      }
    }
    
    if (found >= 0) {
      colorCache.set(key, found);
      indexBuf[i] = found;
    } else {
      const idx = palCount++;
      paletteFlat.push(r, g, b);
      colorCache.set(key, idx);
      indexBuf[i] = idx;
      // Add to spatial bucket
      const br = (r / step) | 0, bg = (g / step) | 0, bb = (b / step) | 0;
      const bk = (br << 16) | (bg << 8) | bb;
      let bucket = buckets.get(bk);
      if (!bucket) { bucket = []; buckets.set(bk, bucket); }
      bucket.push({r, g, b, idx});
    }
  }
  
  return { palette: new Uint8Array(paletteFlat), indices: indexBuf, paletteCount: palCount };
}

function rleEncode(indices) {
  const runs = []; // [index, count, index, count, ...]
  let i = 0;
  while (i < indices.length) {
    const val = indices[i];
    let count = 1;
    while (i + count < indices.length && indices[i + count] === val && count < 32767) count++;
    runs.push(val, count);
    i += count;
  }
  return runs;
}

function packPixenUltra(paletteRGB, paletteCount, runs, totalPixels) {
  const useWide = paletteCount > 256;
  let estSize = 1 + 2 + paletteCount * 3 + 4 + runs.length * 3;
  let buf = new Uint8Array(estSize);
  let off = 0;
  
  function ensureSpace(need) {
    if (off + need > buf.length) {
      const nb = new Uint8Array(Math.max(buf.length * 2, off + need));
      nb.set(buf);
      buf = nb;
    }
  }
  
  // Version
  buf[off++] = 1;
  // Palette count (LE 16-bit)
  buf[off++] = paletteCount & 0xff;
  buf[off++] = (paletteCount >> 8) & 0xff;
  // Palette entries
  ensureSpace(paletteCount * 3);
  buf.set(paletteRGB.subarray(0, paletteCount * 3), off);
  off += paletteCount * 3;
  // Total pixel count (LE 32-bit)
  buf[off++] = totalPixels & 0xff;
  buf[off++] = (totalPixels >> 8) & 0xff;
  buf[off++] = (totalPixels >> 16) & 0xff;
  buf[off++] = (totalPixels >> 24) & 0xff;
  
  // RLE pairs
  for (let i = 0; i < runs.length; i += 2) {
    const idx = runs[i], count = runs[i+1];
    ensureSpace(6);
    if (useWide) {
      buf[off++] = idx & 0xff;
      buf[off++] = (idx >> 8) & 0xff;
    } else {
      buf[off++] = idx & 0xff;
    }
    if (count <= 127) {
      buf[off++] = count;
    } else {
      buf[off++] = (count & 0x7f) | 0x80;
      buf[off++] = (count >> 7) & 0xff;
    }
  }
  return buf.slice(0, off);
}

function unpackPixenUltra(data) {
  let off = 0;
  const version = data[off++];
  const paletteCount = data[off] | (data[off+1] << 8); off += 2;
  const palette = data.slice(off, off + paletteCount * 3); off += paletteCount * 3;
  const totalPixels = data[off] | (data[off+1] << 8) | (data[off+2] << 16) | (data[off+3] << 24); off += 4;
  const useWide = paletteCount > 256;
  
  const rawRGB = new Uint8Array(totalPixels * 3);
  let pxOff = 0;
  
  while (pxOff < totalPixels * 3 && off < data.length) {
    let idx;
    if (useWide) {
      idx = data[off] | (data[off+1] << 8); off += 2;
    } else {
      idx = data[off++];
    }
    let count = data[off++];
    if (count & 0x80) {
      count = (count & 0x7f) | (data[off++] << 7);
    }
    const r = palette[idx*3], g = palette[idx*3+1], b = palette[idx*3+2];
    for (let c = 0; c < count && pxOff < totalPixels * 3; c++) {
      rawRGB[pxOff++] = r;
      rawRGB[pxOff++] = g;
      rawRGB[pxOff++] = b;
    }
  }
  return rawRGB;
}

async function encodePixenUltra(rawRGB, w, h) {
  // Try multiple tolerance levels and pick the smallest result
  // Higher tolerances merge more similar colors -> fewer palette entries -> more RLE runs
  let bestResult = null, bestSize = Infinity;
  for (const tol of [0, 4, 8, 12, 16, 20, 24]) {
    const q = quantizeColors(rawRGB, tol);
    if (q.paletteCount > 65535) continue;
    const runs = rleEncode(q.indices);
    const packed = packPixenUltra(q.palette, q.paletteCount, runs, w * h);
    const compressed = await compressBytes(packed);
    if (compressed.length < bestSize) {
      bestSize = compressed.length;
      bestResult = { compressed, tolerance: tol, paletteCount: q.paletteCount, runs: runs.length / 2 };
    }
  }
  return bestResult;
}

async function decodePixenUltra(b64data) {
  const compressed = b64ToU8(b64data);
  const packed = await decompressBytes(compressed);
  return unpackPixenUltra(packed);
}

async function encodePixels(imgData,w,h,enc){
  const d=imgData.data;
  const rawRGB=new Uint8Array(w*h*3);
  for(let i=0,j=0;i<d.length;i+=4,j+=3){rawRGB[j]=d[i];rawRGB[j+1]=d[i+1];rawRGB[j+2]=d[i+2];}

  if(enc==='base64')return{type:'data',value:u8ToB64(rawRGB)};
  if(enc==='pixen'){
    const filtered=applyBestFilter(rawRGB,w);
    const compressed=await compressBytes(filtered);
    return{type:'data',value:u8ToB64(compressed)};
  }
  if(enc==='pixenultra'){
    const result=await encodePixenUltra(rawRGB,w,h);
    return{type:'data',value:u8ToB64(result.compressed),meta:{tolerance:result.tolerance,paletteCount:result.paletteCount,runs:result.runs}};
  }
  const pixels=[];
  for(let y=0;y<h;y++){
    const row=[];
    for(let x=0;x<w;x++){const i=(y*w+x)*4;const r=d[i],g=d[i+1],b=d[i+2];
      if(enc==='hex')row.push(rgbHex(r,g,b));
      else row.push(rgbInt(r,g,b));
    }
    pixels.push(row);
  }
  return{type:'pixels',value:pixels};
}

function decodePx(v,enc){
  if(enc==='hex'||typeof v==='string'){
    let h=String(v).replace('#','');
    if(h.length>=8)return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:parseInt(h.slice(6,8),16)};
    return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:255};
  }
  const n=v>>>0;return{r:(n>>16)&0xff,g:(n>>8)&0xff,b:n&0xff,a:255};
}

// ══════════════════════════════════════════════════════════════
//  ENCODE — Universal File Router
// ══════════════════════════════════════════════════════════════

const FILE_ICONS={pdf:'📄',doc:'📝',docx:'📝',ppt:'📊',pptx:'📊',xls:'📗',xlsx:'📗',csv:'📋',mp3:'🎵',wav:'🎵',mp4:'🎬',mov:'🎬',zip:'📦',rar:'📦',txt:'📃',json:'📃',html:'🌐',css:'🎨',js:'⚙️'};
function getFileIcon(name){const ext=name.split('.').pop().toLowerCase();return FILE_ICONS[ext]||'📎';}

function addFiles(files){
  for(const f of files){
    if(f.type.startsWith('image/'))addImg(f);
    else addGenericFile(f);
  }
}

function addImg(file, isRestore = false, restoreId = null){
  const id=restoreId || ++imgCtr;
  if(!isRestore) saveFileToDB('encodeFiles', id, file);
  const reader=new FileReader();
  reader.onload=e=>{const img=new Image();img.onload=()=>makeImgRow(id,file,img,e.target.result);img.src=e.target.result;};
  reader.readAsDataURL(file);
}

function addImgBlob(blob){
  const id=++imgCtr, file=new File([blob], 'pasted-'+id+'.png', {type: blob.type});
  saveFileToDB('encodeFiles', id, file);
  const reader=new FileReader();
  reader.onload=e=>{const img=new Image();img.onload=()=>makeImgRow(id,{name:file.name,size:file.size,type:file.type},img,e.target.result);img.src=e.target.result;};
  reader.readAsDataURL(blob);
}

function makeImgRow(id,file,imgEl,dataUrl){
  const w=imgEl.naturalWidth,h=imgEl.naturalHeight;
  const row=document.createElement('div');row.className='row-card';row.id='ir-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<input type="checkbox" class="js-row-sel" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);margin:0 15px 0 5px;">'+
      '<div class="row-thumb"><img src="'+dataUrl+'" alt=""></div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-dim">'+w+' × '+h+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Encode</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options">'+
      '<div class="option-group"><label class="option-label">Original size</label><label class="toggle-switch"><input type="checkbox" class="js-orig" checked><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Max Dimensions</label><input type="number" class="option-input js-maxdim" value="256" min="1" max="4096" disabled></div>'+
      '<div class="option-group"><label class="option-label">Encoding</label><select class="option-select js-enc">'+encOptHTML()+'</select></div>'+
      '<div class="option-group"><label class="option-label">Container Format</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option><option value="pxsn">Legacy PXN (.pxsn)</option><option value="pxsn2">PXSN v2 Binary (.pxsn)</option></select></div>'+
      '<div class="option-group"><label class="option-label">Encrypt</label><label class="toggle-switch"><input type="checkbox" class="js-enc-tog"><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Password</label><input type="password" class="option-input js-enc-pass" placeholder="Secret..." disabled></div>'+
    '</div>'+
    '<div class="row-progress"><div class="row-progress-bar"></div></div>'+
    '<div class="row-result" id="res-'+id+'">'+
      '<div class="row-result-header"><h4>JSON Preview</h4><div class="card-actions">'+
        '<span class="badge badge-enc js-eb"></span><span class="badge badge-size js-js"></span>'+
        '<button class="btn btn-sm btn-outline-cyan js-cp-html" title="Copy <img> tag">HTML</button>'+
        '<button class="btn btn-sm btn-outline-cyan js-cp-css" title="Copy background-image">CSS</button>'+
        '<button class="btn btn-sm btn-outline-cyan js-qr-btn" title="Show QR Code" style="display:none">QR Code</button>'+
        '<button class="btn btn-sm btn-ghost js-cp">Copy</button><button class="btn btn-sm btn-accent js-dl">Download</button></div></div>'+
      '<pre class="json-preview js-jp"></pre>'+
      '<canvas class="qr-canvas js-qr" style="display:none; width:100%; max-width:300px; margin: 20px auto 10px; border-radius:8px;"></canvas>'+
    '</div>';

  imgQueue.appendChild(row);
  row._img=imgEl;row._fn=file.name;row._origFile=file;row._jd=null;

  const origTog=row.querySelector('.js-orig'),maxIn=row.querySelector('.js-maxdim'),encTog=row.querySelector('.js-enc-tog'),encPass=row.querySelector('.js-enc-pass'),convBtn=row.querySelector('.js-conv');
  origTog.onchange=()=>{maxIn.disabled=origTog.checked;};
  encTog.onchange=()=>{encPass.disabled=!encTog.checked;if(encTog.checked)encPass.focus();};
  encPass.onkeydown=(e)=>{if(e.key==='Enter') convBtn.click();};
  
  row.querySelector('.js-rm').onclick=()=>{
    removeFileFromDB('encodeFiles', id);
    row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);
  };
  row.querySelector('.js-conv').onclick=()=>convertImgRow(row,id);
  showProgress(row);setTimeout(()=>hideProgress(row),300);

  const thumbImg = row.querySelector('.row-thumb img');
  if (thumbImg) {
    thumbImg.style.cursor = 'zoom-in';
    thumbImg.onclick = () => openImagePreview(thumbImg.src);
  }
  
  const qrBtn = row.querySelector('.js-qr-btn'), qrCvs = row.querySelector('.js-qr'), jp = row.querySelector('.js-jp');
  qrBtn.onclick = () => {
    if (qrCvs.style.display === 'none') { qrCvs.style.display = 'block'; jp.style.display = 'none'; qrBtn.textContent = 'Hide QR Code'; }
    else { qrCvs.style.display = 'none'; jp.style.display = 'block'; qrBtn.textContent = 'QR Code'; }
  };
  
  row.querySelector('.js-cp').onclick=async()=>{
    if(row._lastState && row._lastState !== getImgRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertImgRow(row,id);
    }
    if(!row._dlBlob)return;
    try{
      let text;
      if(row._outFmt==='json'){
        text = JSON.stringify(row._jd,null,2);
      }else{
        const buf = await row._dlBlob.arrayBuffer();
        text = u8ToB64(new Uint8Array(buf));
      }
      await navigator.clipboard.writeText(text);
      toast(row._outFmt==='json'?'Copied JSON!':'Copied as Base64!','success');
    }catch{toast('Copy failed','error');}
  };

  const getWebpB64 = async () => {
    if (!row._jd) throw new Error('Convert image first');
    if (row._jd.format === 'pixson-encrypted-v1') throw new Error('Cannot embed encrypted files');
    if (row._jd.encoding === 'webp' && row._jd.data) return row._jd.data;
    const cvs = document.createElement('canvas');
    cvs.width = row._jd.width; cvs.height = row._jd.height;
    cvs.getContext('2d').drawImage(imgEl, 0, 0, cvs.width, cvs.height);
    const blob = await new Promise(r => cvs.toBlob(r, 'image/webp', 1.0));
    const buf = await blob.arrayBuffer();
    return u8ToB64(new Uint8Array(buf));
  };
  row.querySelector('.js-cp-html').onclick = async () => {
    if(row._lastState && row._lastState !== getImgRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertImgRow(row,id);
    }
    try {
      const b64 = await getWebpB64();
      const html = `<img src="data:image/webp;base64,${b64}" width="${row._jd.width}" height="${row._jd.height}" alt="${row._fn}">`;
      await navigator.clipboard.writeText(html);
      toast('Copied HTML <img> tag!', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };
  row.querySelector('.js-cp-css').onclick = async () => {
    if(row._lastState && row._lastState !== getImgRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertImgRow(row,id);
    }
    try {
      const b64 = await getWebpB64();
      const css = `background-image: url('data:image/webp;base64,${b64}');\nbackground-size: contain;\nbackground-repeat: no-repeat;`;
      await navigator.clipboard.writeText(css);
      toast('Copied CSS snippet!', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  row.querySelector('.js-dl').onclick=async()=>{
    if(row._lastState && row._lastState !== getImgRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertImgRow(row,id);
    }
    if(!row._dlBlob)return;
    dlBlob(row._dlBlob, row._dlName);
    toast('Downloaded!','success');
  };
  toast('Added: '+file.name,'success',1800);
}

// ─── Generic File Row ────────────────────────────────────────
function addGenericFile(file, isRestore = false, restoreId = null){
  const id=restoreId || ++imgCtr;
  if(!isRestore) saveFileToDB('encodeFiles', id, file);
  const reader=new FileReader();
  reader.onload=e=>makeGenericRow(id,file,new Uint8Array(e.target.result));
  reader.readAsArrayBuffer(file);
}

function makeGenericRow(id,file,u8){
  const icon=getFileIcon(file.name);
  const row=document.createElement('div');row.className='row-card';row.id='ir-'+id;

  const blob=new Blob([u8],{type:file.type||'application/octet-stream'});
  const url=URL.createObjectURL(blob);
  const mime=file.type||'';
  let previewHtml='';
  if(mime.startsWith('audio/')){
    previewHtml='<audio controls src="'+url+'" style="width:100%"></audio>';
  }else if(mime.startsWith('video/')){
    previewHtml='<video controls src="'+url+'" style="width:100%;max-height:400px;border-radius:6px"></video>';
  }else if(mime==='application/pdf'){
    previewHtml='<iframe src="'+url+'" style="width:100%;height:500px;border:none;border-radius:6px;background:#fff"></iframe>';
  }else if(mime.startsWith('text/')||mime==='application/json'||mime==='application/javascript'||mime==='text/css'){
    const text=new TextDecoder().decode(u8);
    const maxL=50000;const disp=text.length>maxL?text.substring(0,maxL)+'\n\n... [truncated]':text;
    previewHtml='<pre class="json-preview">'+disp.replace(/</g,'&lt;')+'</pre>';
  }else{
    previewHtml='<div style="text-align:center;padding:20px;color:var(--text-3);font-size:.85rem">Preview not available for this file type.</div>';
  }

  row.innerHTML=
    '<div class="row-top">'+
      '<input type="checkbox" class="js-row-sel" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);margin:0 15px 0 5px;">'+
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">'+icon+'</div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">'+file.name.split('.').pop().toUpperCase()+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Encode</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options" style="border-bottom:1px solid var(--border)">'+
      '<div class="option-group"><label class="option-label">Container</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option><option value="pxsn">Legacy PXN (.pxsn)</option><option selected value="pxsn2">PXSN v2 Binary (.pxsn)</option></select></div>'+
      '<div class="option-group js-enc-group"><label class="option-label">Encoding</label><select class="option-select js-enc"><option value="gzip">GZip (Raw Bytes)</option><option value="base64">Base64 Text</option><option value="base85">Base85 Text</option></select></div>'+
      '<div class="option-group"><label class="option-label">Encrypt</label><label class="toggle-switch"><input type="checkbox" class="js-enc-tog"><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Password</label><input type="password" class="option-input js-enc-pass" placeholder="Secret..." disabled></div>'+
    '</div>'+
    '<div class="generic-preview-wrap" style="border-top:none">'+previewHtml+'</div>'+
    '<div class="row-progress"><div class="row-progress-bar"></div></div>'+
    '<div class="row-result" id="res-'+id+'">'+
      '<div class="row-result-header"><h4>Output Preview</h4><div class="card-actions">'+
        '<span class="badge badge-enc js-eb"></span><span class="badge badge-size js-js"></span>'+
        '<button class="btn btn-sm btn-outline-cyan js-qr-btn" title="Show QR Code" style="display:none">QR Code</button>'+
        '<button class="btn btn-sm btn-ghost js-cp">Copy</button><button class="btn btn-sm btn-accent js-dl">Download</button></div></div>'+
      '<pre class="json-preview js-jp"></pre>'+
      '<canvas class="qr-canvas js-qr" style="display:none; width:100%; max-width:300px; margin: 20px auto 10px; border-radius:8px;"></canvas>'+
    '</div>';
  imgQueue.appendChild(row);
  row._u8=u8;row._fn=file.name;row._mime=file.type||'application/octet-stream';row._origFile=file;row._jd=null;row._dlBlob=null;row._outFmt='json';row._blobUrl=url;
  const encTog=row.querySelector('.js-enc-tog'),encPass=row.querySelector('.js-enc-pass'),convBtn=row.querySelector('.js-conv');
  encTog.onchange=()=>{encPass.disabled=!encTog.checked;if(encTog.checked)encPass.focus();};
  encPass.onkeydown=(e)=>{if(e.key==='Enter') convBtn.click();};
  
  const fmtSel = row.querySelector('.js-fmt'), encGroup = row.querySelector('.js-enc-group');
  fmtSel.onchange = () => { encGroup.style.display = fmtSel.value === 'pxsn2' ? 'block' : 'none'; };
  
  row.querySelector('.js-rm').onclick=()=>{
    removeFileFromDB('encodeFiles', id);
    if(row._blobUrl) URL.revokeObjectURL(row._blobUrl);
    row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';
    setTimeout(()=>row.remove(),180);
  };
  
  const qrBtn = row.querySelector('.js-qr-btn'), qrCvs = row.querySelector('.js-qr'), jp = row.querySelector('.js-jp');
  qrBtn.onclick = () => {
    if (qrCvs.style.display === 'none') { qrCvs.style.display = 'block'; jp.style.display = 'none'; qrBtn.textContent = 'Hide QR Code'; }
    else { qrCvs.style.display = 'none'; jp.style.display = 'block'; qrBtn.textContent = 'QR Code'; }
  };
  
  row.querySelector('.js-conv').onclick=()=>convertGenericRow(row,id);
  row.querySelector('.js-cp').onclick=async()=>{
    if(row._lastState && row._lastState !== getGenericRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertGenericRow(row,id);
    }
    if(!row._dlBlob)return;
    try{
      let text;
      if(row._outFmt==='json') text=JSON.stringify(row._jd,null,2);
      else{const buf=await row._dlBlob.arrayBuffer();text=u8ToB64(new Uint8Array(buf));}
      await navigator.clipboard.writeText(text);toast('Copied!','success');
    }catch{toast('Copy failed','error');}
  };
  row.querySelector('.js-dl').onclick=async()=>{
    if(row._lastState && row._lastState !== getGenericRowState(row)){
      toast('Auto-compiling new settings...','info');
      await convertGenericRow(row,id);
    }
    if(!row._dlBlob)return;
    dlBlob(row._dlBlob,row._dlName);toast('Downloaded!','success');
  };
  toast('Added: '+file.name,'success',1800);
}

async function convertGenericRow(row,id){
  const outFmt=row.querySelector('.js-fmt').value;
  const enc=row.querySelector('.js-enc').value;
  const btn=row.querySelector('.js-conv');btn.disabled=true;btn.textContent='Encoding…';
  showProgress(row);
  await sleep(10);
  const compressed=await compressBytes(row._u8);
  
  let encData, encLabel;
  if(enc==='base85') { encData=u8ToBase85(compressed); encLabel='gzip+base85'; }
  else { encData=u8ToB64(compressed); encLabel='gzip+base64'; }
  
  const obj={format:'pixson-file-v1',filename:row._fn,mimeType:row._mime,originalSize:row._u8.length,encoding:encLabel,data:encData};
  row._jd=obj;
  const jsonStr=JSON.stringify(obj,null,2);
  let fileBlob,fileExt,displaySize,previewStr;
  
  if (outFmt === 'pxsn2') {
    const origFile = row._origFile || new File([row._u8], row._fn, {type: row._mime});
    const bin = await window.PXSN2.encodeToPXSN(origFile, { binaryEncoding: enc, encrypt: row.querySelector('.js-enc-tog').checked });
    fileBlob = new Blob([bin], {type: 'application/octet-stream'});
    fileExt = 'pxsn';
    displaySize = bin.length;
    previewStr = hexDump(bin);
  } else if (outFmt === 'pxsn') {
    const bin = createGenericPxnBinary(row._fn, row._mime, row._u8.length, compressed);
    fileBlob = new Blob([bin], {type: 'application/octet-stream'});
    fileExt = 'pxsn';
    displaySize = bin.length;
    previewStr = hexDump(bin);
  } else if(outFmt==='gz'){
    const gzBytes=await gzipJSON(jsonStr);
    fileBlob=new Blob([gzBytes],{type:'application/gzip'});fileExt='json.gz';
    displaySize=gzBytes.length;previewStr=hexDump(gzBytes);
  }else{
    fileBlob=new Blob([jsonStr],{type:'application/json'});fileExt='json';
    displaySize=jsonStr.length;
    const mp=50000;previewStr=jsonStr.length>mp?jsonStr.substring(0,mp)+'\n\n… ['+fmtSz(jsonStr.length-mp)+' more]':jsonStr;
  }

  const encTog=row.querySelector('.js-enc-tog').checked, pass=row.querySelector('.js-enc-pass').value;
  if(encTog){
    if(!pass){toast('Enter password to encrypt','error');btn.disabled=false;btn.textContent='Encode';hideProgress(row);return;}
    const buf=await fileBlob.arrayBuffer();
    const enc=await encryptData(new Uint8Array(buf), pass);
    const envObj={format:'pixson-encrypted-v1', salt:enc.salt, iv:enc.iv, data:enc.data, originalFmt:outFmt, originalName:row._fn};
    const envJson=JSON.stringify(envObj,null,2);
    fileBlob=new Blob([envJson],{type:'application/json'});
    fileExt='enc.json'; displaySize=fileBlob.size; previewStr=envJson.substring(0,500)+'\n\n... [Encrypted Payload]';
    row._jd=envObj;
  }

  row._dlBlob=fileBlob;row._dlName=row._fn+'.pixson.'+fileExt;row._outFmt=outFmt;
  hideProgress(row);
  const res=row.querySelector('#res-'+id);res.classList.add('visible');
  res.querySelector('.js-eb').textContent='GZIP+B64';
  res.querySelector('.js-js').textContent=fmtSz(displaySize);
  res.querySelector('.js-jp').textContent=previewStr;

  const qrBtn = row.querySelector('.js-qr-btn'), qrCvs = row.querySelector('.js-qr'), jp = row.querySelector('.js-jp');
  if (qrBtn) {
    let txtData = '';
    if (encTog || outFmt === 'json') txtData = JSON.stringify(row._jd);
    else { const buf = await fileBlob.arrayBuffer(); txtData = u8ToB64(new Uint8Array(buf)); }
    
    if (txtData.length <= 2900) {
      qrBtn.style.display = 'inline-block';
      drawQRCodeWithLogo(txtData, qrCvs);
      qrCvs.style.display = 'none'; jp.style.display = 'block'; qrBtn.textContent = 'QR Code';
    } else {
      qrBtn.style.display = 'none'; qrCvs.style.display = 'none'; jp.style.display = 'block';
    }
  }

  btn.disabled=false;btn.textContent='Encode';
  row._lastState = getGenericRowState(row);
  if(typeof updateBulkUI==='function') updateBulkUI();
  toast(fmtSz(row._u8.length)+' → '+fmtSz(displaySize)+' ('+((displaySize/row._u8.length)*100).toFixed(0)+'%)','success');
}

async function convertImgRow(row,id){
  const imgEl=row._img,useOrig=row.querySelector('.js-orig').checked;
  const maxDim=parseInt(row.querySelector('.js-maxdim').value)||256;
  let enc=row.querySelector('.js-enc').value;
  const outFmt=row.querySelector('.js-fmt').value;
  
  if (outFmt === 'pxsn' && enc !== 'pixenultra') enc = 'pixen';
  
  const btn=row.querySelector('.js-conv');btn.disabled=true;btn.textContent='Encoding…';
  showProgress(row);
  await sleep(10);

  let cw=imgEl.naturalWidth,ch=imgEl.naturalHeight;
  if(!useOrig&&(cw>maxDim||ch>maxDim)){const s=maxDim/Math.max(cw,ch);cw=Math.round(cw*s);ch=Math.round(ch*s);}

  const cvs=document.createElement('canvas');cvs.width=cw;cvs.height=ch;
  const ctx=cvs.getContext('2d');ctx.drawImage(imgEl,0,0,cw,ch);
  
  let encoded;
  if (enc === 'webp') {
    const blob = await new Promise(r => cvs.toBlob(r, 'image/webp', 1.0));
    const buf = await blob.arrayBuffer();
    encoded = { type: 'data', value: u8ToB64(new Uint8Array(buf)) };
  } else {
    const imgData=ctx.getImageData(0,0,cw,ch);
    encoded = await encodePixels(imgData,cw,ch,enc);
  }

  const obj={format:(enc==='pixen'||enc==='pixenultra')?'pixen-v1':'pixson-v1',width:cw,height:ch,encoding:enc,totalPixels:cw*ch};
  if(encoded.type==='data')obj.data=encoded.value;else obj.pixels=encoded.value;
  if(encoded.meta)obj.meta=encoded.meta;
  
  row._jd = obj;
  const jsonStr = JSON.stringify(obj,null,2);
  
  let fileBlob, fileExt, displaySize, displayEnc = enc, previewStr;

  if (outFmt === 'pxsn2') {
    const origFile = row._origFile || new File([await fetch(imgEl.src).then(r=>r.blob())], row._fn, {type: 'image/png'});
    const bin = await window.PXSN2.encodeToPXSN(origFile, { imageEncoding: enc, encrypt: row.querySelector('.js-enc-tog').checked });
    fileBlob = new Blob([bin], {type: 'application/octet-stream'});
    fileExt = 'pxsn';
    displaySize = bin.length;
    displayEnc = 'PXSN v2 Binary';
    previewStr = hexDump(bin);
  } else if (outFmt === 'pxsn') {
    const pxnType = enc === 'pixenultra' ? 2 : 1;
    const bin = createPxnBinary(cw, ch, b64ToU8(obj.data), pxnType);
    fileBlob = new Blob([bin], {type: 'application/octet-stream'});
    fileExt = 'pxsn';
    displaySize = bin.length;
    displayEnc = 'PXN Binary';
    previewStr = hexDump(bin);
  } else if (outFmt === 'gz') {
    const gzBytes = await gzipJSON(jsonStr);
    fileBlob = new Blob([gzBytes], {type: 'application/gzip'});
    fileExt = 'json.gz';
    displaySize = gzBytes.length;
    displayEnc = enc + ' (GZipped)';
    previewStr = hexDump(gzBytes);
  } else {
    fileBlob = new Blob([jsonStr], {type: 'application/json'});
    fileExt = 'json';
    displaySize = jsonStr.length;
    const maxPreview=50000;
    previewStr = jsonStr.length>maxPreview?jsonStr.substring(0,maxPreview)+'\n\n… ['+fmtSz(jsonStr.length-maxPreview)+' more bytes — click Download to get the full file]':jsonStr;
  }

  const encTog=row.querySelector('.js-enc-tog').checked, pass=row.querySelector('.js-enc-pass').value;
  if(encTog){
    if(!pass){toast('Enter password to encrypt','error');btn.disabled=false;btn.textContent='Encode';hideProgress(row);return;}
    const buf=await fileBlob.arrayBuffer();
    const encResult=await encryptData(new Uint8Array(buf), pass);
    const envObj={format:'pixson-encrypted-v1', salt:encResult.salt, iv:encResult.iv, data:encResult.data, originalFmt:outFmt, originalName:row._fn};
    const envJson=JSON.stringify(envObj,null,2);
    fileBlob=new Blob([envJson],{type:'application/json'});
    fileExt='enc.json'; displaySize=fileBlob.size; previewStr=envJson.substring(0,500)+'\n\n... [Encrypted Payload]';
    displayEnc='AES-256';
    row._jd=envObj;
  }

  row._dlBlob = fileBlob;
  row._dlName = row._fn.replace(/\.[^/.]+$/,'')+'-pixson.'+fileExt;
  row._outFmt = outFmt;

  const res=row.querySelector('#res-'+id);
  res.classList.add('visible');
  res.querySelector('.js-eb').textContent=displayEnc;
  res.querySelector('.js-js').textContent=fmtSz(displaySize);
  res.querySelector('.js-jp').textContent=previewStr;

  const qrBtn = row.querySelector('.js-qr-btn'), qrCvs = row.querySelector('.js-qr'), jp = row.querySelector('.js-jp');
  if (qrBtn) {
    let txtData = '';
    if (encTog || outFmt === 'json') txtData = JSON.stringify(row._jd);
    else { const buf = await fileBlob.arrayBuffer(); txtData = u8ToB64(new Uint8Array(buf)); }
    
    if (txtData.length <= 2900) {
      qrBtn.style.display = 'inline-block';
      drawQRCodeWithLogo(txtData, qrCvs);
      qrCvs.style.display = 'none'; jp.style.display = 'block'; qrBtn.textContent = 'QR Code';
    } else {
      qrBtn.style.display = 'none'; qrCvs.style.display = 'none'; jp.style.display = 'block';
    }
  }

  btn.disabled=false;btn.textContent='Encode';
  hideProgress(row);
  row._lastState = getImgRowState(row);
  toast((cw*ch).toLocaleString()+' px → '+fmtSz(displaySize)+' ('+displayEnc+')','success');
  if(typeof updateBulkUI==='function') updateBulkUI();
}

// Drop/click/paste
imgDrop.onclick=e=>{if(e.target.closest('.row-card')||e.target.closest('.bulk-actions-bar'))return;imgInput.click();};
imgInput.onchange=e=>{if(e.target.files.length)addFiles(e.target.files);imgInput.value='';};
imgDrop.ondragover=e=>{e.preventDefault();imgDrop.classList.add('drag-over');};
imgDrop.ondragleave=()=>imgDrop.classList.remove('drag-over');
imgDrop.ondrop=e=>{e.preventDefault();imgDrop.classList.remove('drag-over');if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files);};
document.onpaste=e=>{
  if(document.activeElement===jsonText)return;
  if(!panelI.classList.contains('active'))return;
  const items=e.clipboardData.items;if(!items)return;
  for(const it of items)if(it.type.startsWith('image/')){e.preventDefault();const b=it.getAsFile();if(b)addImgBlob(b);return;}
};

// ══════════════════════════════════════════════════════════════
//  DECODE — Data → File / Image (multi-row)
// ══════════════════════════════════════════════════════════════

function explodeBundle(obj) {
  toast(`Exploding ${obj.files.length} files from bundle...`, 'info');
  for (const f of obj.files) {
    const fU8 = b64ToU8(f.b64);
    const fBlob = new Blob([fU8], {type: 'application/octet-stream'});
    addDataFile(new File([fBlob], f.name));
  }
}


async function processDataBuffer(u8, name, id, sizeOverride){
  try {
    const file = new File([u8], name, { type: 'application/octet-stream' });
    const result = await window.PXSN2.detectAndDecode(file);
    const sizeStr = fmtSz(sizeOverride || u8.length);
    
    for (const item of result.files) {
      if (item._legacyImageJSON) {
        makeDataRow(id || ++jsonCtr, item._legacyImageJSON.filename || name, sizeStr, item._legacyImageJSON, item._legacyImageJSON.encoding || 'hex');
      } else if (item._legacyEncryptedJSON) {
        makeEncryptedDecodeRow(id || ++jsonCtr, item._legacyEncryptedJSON.originalName || name, sizeStr, item._legacyEncryptedJSON);
      } else {
        makeGenericDecodeRow(id || ++jsonCtr, item.filename || name, sizeStr, {
          filename: item.filename,
          mimeType: item.mimeType,
          originalSize: item.data.length,
          _binaryData: item.data,
          _isPreDecoded: true,
          blob: item.blob,
          url: item.url
        });
      }
    }
  } catch(e) {
    toast('Error parsing file: ' + e.message, 'error');
  }
}

function addDataFiles(files){for(const f of files)addDataFile(f);}

function addDataFile(file, isRestore = false, restoreId = null){
  const id=restoreId || ++jsonCtr;
  if(!isRestore) saveFileToDB('decodeFiles', id, file);
  const reader=new FileReader();
  reader.onload=async e=>{
    try {
      await processDataBuffer(new Uint8Array(e.target.result), file.name, id, file.size);
    } catch(err) { toast('Error reading file: '+err.message, 'error'); }
  };
  reader.readAsArrayBuffer(file);
}

async function addJsonFromText(text,name){
  const id=++jsonCtr;
  const u8 = new TextEncoder().encode(text);
  await processDataBuffer(u8, name || 'pasted-data-'+id, id);
}

function makeDataRow(id,name,sizeStr,obj,encBadge){
  if(!obj.width||!obj.height){toast(name+': missing width/height','error');return;}
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<input type="checkbox" class="js-row-sel" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);margin:0 15px 0 5px;">'+
      '<div class="row-thumb" id="jthumb-'+id+'"><canvas width="1" height="1"></canvas></div>'+
      '<div class="row-info"><div class="row-name" title="'+name+'">'+name+'</div>'+
        '<div class="row-meta"><span class="badge badge-dim">'+obj.width+' × '+obj.height+'</span><span class="badge badge-size">'+sizeStr+'</span><span class="badge badge-enc">'+encBadge+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-recon">Decode</button>'+
        '<select class="option-select js-outfmt"><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP Lossless</option></select>'+
        '<button class="btn btn-sm btn-accent js-dli" disabled>Download</button>'+
        '<button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-progress"><div class="row-progress-bar"></div></div>'+
    '<div class="row-result" id="jres-'+id+'">'+
      '<div class="row-preview-wrap checker"><canvas id="jcvs-'+id+'"></canvas></div>'+
    '</div>';

  jsonQueue.appendChild(row);
  row._obj=obj;row._name=name;row._done=false;

  const thumbCvs = row.querySelector('#jthumb-'+id+' canvas');
  const fullCvs = row.querySelector('#jcvs-'+id);
  const setupPreview = (cvsEl) => {
    cvsEl.style.cursor = 'zoom-in';
    cvsEl.onclick = () => {
      if (!row._done) return;
      openImagePreview(fullCvs.toDataURL());
    };
  };
  if(thumbCvs) setupPreview(thumbCvs);
  if(fullCvs) setupPreview(fullCvs);

  row.querySelector('.js-rm').onclick=()=>{removeFileFromDB('decodeFiles', id); row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  row.querySelector('.js-recon').onclick=()=>reconRow(row,id);
  row.querySelector('.js-dli').onclick=()=>{
    if(!row._done)return;
    const fmt=row.querySelector('.js-outfmt').value;
    const mime=fmt==='jpeg'?'image/jpeg':fmt==='webp'?'image/webp':'image/png';
    const ext=fmt==='jpeg'?'jpg':fmt;
    const cvs=row.querySelector('#jcvs-'+id);
    cvs.toBlob(b=>{if(b){dlBlob(b,'pixson-decoded.'+ext);toast('Downloaded!','success');}},mime,1.0); // 1.0 = Highest quality
  };
  toast('Added: '+name,'success',1800);
}

// ─── Encrypted Decode Row ────────────────────────────────────
function makeEncryptedDecodeRow(id,name,sizeStr,obj){
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<input type="checkbox" class="js-row-sel" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);margin:0 15px 0 5px;">'+
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">🔒</div>'+
      '<div class="row-info"><div class="row-name" title="'+name+'">'+name+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">ENCRYPTED</span><span class="badge badge-size">'+sizeStr+'</span></div></div>'+
      '<div class="row-actions"><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options" style="border-top:none;padding-top:0">'+
      '<div class="option-group" style="flex:1"><input type="password" class="option-input js-dec-pass" placeholder="Enter password to decrypt" style="width:100%"></div>'+
      '<button class="btn btn-sm btn-primary js-dec">Decrypt</button>'+
    '</div>'+
    '<div class="row-progress"><div class="row-progress-bar"></div></div>';
  jsonQueue.appendChild(row);
  row._done=false;
  row.querySelector('.js-rm').onclick=()=>{removeFileFromDB('decodeFiles', id); row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  const decBtn = row.querySelector('.js-dec');
  const passInput = row.querySelector('.js-dec-pass');
  passInput.onkeydown = (e) => { if(e.key==='Enter') decBtn.click(); };
  decBtn.onclick=async()=>{
    const pass=row.querySelector('.js-dec-pass').value;
    if(!pass){toast('Please enter password','error');return;}
    const btn=row.querySelector('.js-dec');btn.disabled=true;btn.textContent='Decrypting...';
    showProgress(row); await sleep(50);
    try{
      const decryptedU8=await decryptData(obj, pass);
      hideProgress(row); toast('Decrypted successfully!','success');
      row.remove();
      await processDataBuffer(decryptedU8, name.replace('.enc.json',''), id);
    }catch(err){
      hideProgress(row); toast(err.message,'error');
      btn.disabled=false;btn.textContent='Decrypt';
    }
  };
}



// ─── Generic File Decode Row ─────────────────────────────────
function makeGenericDecodeRow(id,name,sizeStr,obj){
  const icon=getFileIcon(obj.filename||'file');
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<input type="checkbox" class="js-row-sel" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);margin:0 15px 0 5px;">'+
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">'+icon+'</div>'+
      '<div class="row-info"><div class="row-name" title="'+(obj.filename||name)+'">'+(obj.filename||name)+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">'+(obj.filename||'').split('.').pop().toUpperCase()+'</span><span class="badge badge-size">'+fmtSz(obj.originalSize||0)+'</span><span class="badge badge-dim">Encoded: '+sizeStr+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-recon">Decode</button>'+
        '<button class="btn btn-sm btn-accent js-dli" disabled>Download</button>'+
        '<button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-progress"><div class="row-progress-bar"></div></div>'+
    '<div class="row-result" id="gres-'+id+'">'+
      '<div class="generic-preview-wrap" id="gprev-'+id+'"></div>'+
    '</div>';
  jsonQueue.appendChild(row);
  row._obj=obj;row._done=false;
  row.querySelector('.js-rm').onclick=()=>{
    removeFileFromDB('decodeFiles', id);
    if(row._blobUrl) URL.revokeObjectURL(row._blobUrl);
    row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';
    setTimeout(()=>row.remove(),180);
  };
  row.querySelector('.js-recon').onclick=async()=>{
    const btn=row.querySelector('.js-recon');btn.disabled=true;btn.textContent='Decoding…';
    showProgress(row);
    try{
      await sleep(10);
      let raw;
      if (obj.encoding === 'Raw Text') {
        raw = obj._binaryData;
      } else {
        let compressed;
        if (obj._binaryData) {
          compressed = obj._binaryData;
        } else if (obj.encoding === 'gzip+base85') {
          compressed = base85ToU8(obj.data);
        } else {
          compressed = b64ToU8(obj.data);
        }
        raw = await decompressBytes(compressed);
      }
      const blob=new Blob([raw],{type:obj.mimeType||'application/octet-stream'});
      row._blob=blob;row._done=true;
      
      const url=URL.createObjectURL(blob);
      row._blobUrl=url;
      const mime=obj.mimeType||'';
      let html='';
      if(mime.startsWith('audio/')){
        html='<audio controls src="'+url+'" style="width:100%"></audio>';
      }else if(mime.startsWith('video/')){
        html='<video controls src="'+url+'" style="width:100%;max-height:400px;border-radius:6px"></video>';
      }else if(mime==='application/pdf'){
        html='<iframe src="'+url+'" style="width:100%;height:500px;border:none;border-radius:6px;background:#fff"></iframe>';
      }else if(mime.startsWith('text/')||mime==='application/json'||mime==='application/javascript'||mime==='text/css'){
        const text=new TextDecoder().decode(raw);
        const maxL=50000;const disp=text.length>maxL?text.substring(0,maxL)+'\n\n... [truncated]':text;
        html='<pre class="json-preview">'+disp.replace(/</g,'&lt;')+'</pre>';
      }else{
        html='<div style="text-align:center;padding:20px;color:var(--text-3);font-size:.85rem">Preview not available for this file type. Click Download to open.</div>';
      }
      row.querySelector('#gprev-'+id).innerHTML=html;
      row.querySelector('#gres-'+id).classList.add('visible');

      row.querySelector('.js-dli').disabled=false;
      hideProgress(row);
      btn.textContent='Decode';
      if(btn.style.display!=='none') toast('Decoded: '+(obj.filename||'file')+' ('+fmtSz(raw.length)+')','success');
      if(typeof updateBulkUI==='function') updateBulkUI();
    }catch(err){hideProgress(row);toast('Decode error: '+err.message,'error');btn.disabled=false;btn.textContent='Decode';}
  };
  
  if (obj._isPreDecoded) {
    const reconBtn = row.querySelector('.js-recon');
    reconBtn.style.display = 'none';
    reconBtn.click();
  }
  row.querySelector('.js-dli').onclick=()=>{if(!row._blob)return;dlBlob(row._blob,obj.filename||'decoded-file');toast('Downloaded!','success');};
  toast('Added: '+(obj.filename||name),'success',1800);
}

async function reconRow(row,id){
  const obj=row._obj,w=obj.width,h=obj.height,enc=obj.encoding||'hex';
  const btn=row.querySelector('.js-recon');btn.disabled=true;btn.textContent='Decoding…';
  showProgress(row);
  await sleep(10);

  const cvs=row.querySelector('#jcvs-'+id);
  cvs.width=w;cvs.height=h;
  const ctx=cvs.getContext('2d');
  
  if (enc === 'webp' && obj.data) {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + obj.data;
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
    ctx.drawImage(img, 0, 0);
  } else {
    const imgData=ctx.createImageData(w,h);
    const d=imgData.data;

    if((enc==='base64'||enc==='pixen'||enc==='pixenultra') && (obj.data || obj._binaryData)){
      let raw;
      if(enc==='pixenultra'){
        if(obj._binaryData){
          // PXN binary: data is raw deflated bytes
          const packed = await decompressBytes(obj._binaryData);
          raw = unpackPixenUltra(packed);
        } else {
          raw = await decodePixenUltra(obj.data);
        }
      }else if(enc==='pixen'){
        const compressed = obj._binaryData ? obj._binaryData : b64ToU8(obj.data);
        const filtered = await decompressBytes(compressed);
        raw = reverseFilters(filtered,w,h);
      }else{
        raw = b64ToU8(obj.data);
      }
      for(let i=0,j=0;j<raw.length&&i<d.length;j+=3,i+=4){d[i]=raw[j];d[i+1]=raw[j+1];d[i+2]=raw[j+2];d[i+3]=255;}
    }else if(obj.pixels){
      if(!Array.isArray(obj.pixels)||obj.pixels.length!==h){toast('Expected '+h+' rows','error');btn.disabled=false;btn.textContent='Reconstruct';return;}
      for(let y=0;y<h;y++){const r=obj.pixels[y];if(!Array.isArray(r)){toast('Row '+y+' invalid','error');btn.disabled=false;btn.textContent='Reconstruct';return;}
        for(let x=0;x<w;x++){const px=decodePx(r[x],enc);const i=(y*w+x)*4;d[i]=px.r;d[i+1]=px.g;d[i+2]=px.b;d[i+3]=px.a;}}
    }else{toast('No pixel data found','error');btn.disabled=false;btn.textContent='Reconstruct';return;}

    ctx.putImageData(imgData,0,0);
  }

  // Update thumbnail
  const thumb=row.querySelector('#jthumb-'+id);
  const tc=thumb.querySelector('canvas');
  tc.width=68;tc.height=68;
  const tctx=tc.getContext('2d');
  tctx.drawImage(cvs,0,0,68,68);

  row.querySelector('#jres-'+id).classList.add('visible');
  row.querySelector('.js-dli').disabled=false;
  row._done=true;
  btn.disabled=false;btn.textContent='Decode';
  hideProgress(row);
  toast('Decoded: '+w+'×'+h,'success');
  if(typeof updateBulkUI==='function') updateBulkUI();
}

// Drop/click for Data
jsonDrop.onclick=e=>{if(e.target.closest('.row-card')||e.target.closest('.bulk-actions-bar'))return;jsonInput.click();};
jsonInput.onchange=e=>{if(e.target.files.length)addDataFiles(e.target.files);jsonInput.value='';};
jsonDrop.ondragover=e=>{e.preventDefault();jsonDrop.classList.add('drag-over');};
jsonDrop.ondragleave=()=>jsonDrop.classList.remove('drag-over');
jsonDrop.ondrop=e=>{e.preventDefault();jsonDrop.classList.remove('drag-over');if(e.dataTransfer.files.length)addDataFiles(e.dataTransfer.files);};

// ─── Buffered paste system (prevents crash on large text) ───
let _pastedBuffer = null;

jsonText.addEventListener('paste', e => {
  const text = e.clipboardData.getData('text');
  if (!text || text.length < 50000) return; // small pastes go directly to textarea
  e.preventDefault(); // BLOCK the browser from inserting megabytes into DOM
  _pastedBuffer = text;
  pasteOverlay.classList.add('active');
  // Use rAF to let the overlay render before we touch the textarea
  requestAnimationFrame(() => {
    jsonText.value = '[Buffered ' + fmtSz(text.length) + ' of data — click "Add to queue" to process]';
    jsonText.disabled = true;
    pasteOverlay.classList.remove('active');
    toast('Buffered ' + fmtSz(text.length) + ' of pasted data', 'success');
  });
});

addPastedBtn.onclick = async () => {
  const text = _pastedBuffer || jsonText.value.trim();
  if (!text || text.startsWith('[Buffered')) {
    if (!_pastedBuffer) { toast('Paste data first', 'error'); return; }
  }
  const data = _pastedBuffer || text;
  _pastedBuffer = null;
  jsonText.value = '';
  jsonText.disabled = false;
  pasteOverlay.classList.add('active');
  // Yield to let overlay render
  await sleep(50);
  try {
    await addJsonFromText(data);
  } catch (err) {
    toast('Error processing: ' + err.message, 'error');
  }
  pasteOverlay.classList.remove('active');
};

// ─── Simple Uncompressed ZIP Generator ──────────────────────
const crcTable=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;crcTable[i]=c;}
function getCrc(u8){let c=0xffffffff;for(let i=0;i<u8.length;i++)c=crcTable[(c^u8[i])&0xff]^(c>>>8);return(c^0xffffffff)>>>0;}

function createZip(files) {
  const enc=new TextEncoder(); let cdOffset=0, centralDir=[], localFiles=[];
  for (const f of files) {
    const nameBuf=enc.encode(f.name), u8=f.u8, crc=getCrc(u8), size=u8.length;
    let lh=new Uint8Array(30+nameBuf.length), ldv=new DataView(lh.buffer);
    ldv.setUint32(0,0x04034b50,true); ldv.setUint16(4,10,true); ldv.setUint32(14,crc,true); ldv.setUint32(18,size,true); ldv.setUint32(22,size,true); ldv.setUint16(26,nameBuf.length,true); lh.set(nameBuf,30);
    
    let cd=new Uint8Array(46+nameBuf.length), cdv=new DataView(cd.buffer);
    cdv.setUint32(0,0x02014b50,true); cdv.setUint16(4,20,true); cdv.setUint16(6,10,true); cdv.setUint32(16,crc,true); cdv.setUint32(20,size,true); cdv.setUint32(24,size,true); cdv.setUint16(28,nameBuf.length,true); cdv.setUint32(42,cdOffset,true); cd.set(nameBuf,46);
    
    localFiles.push(lh, u8); centralDir.push(cd); cdOffset += lh.length + u8.length;
  }
  let cdSize = centralDir.reduce((a,b)=>a+b.length, 0);
  let eocd = new Uint8Array(22), edv = new DataView(eocd.buffer);
  edv.setUint32(0,0x06054b50,true); edv.setUint16(8,files.length,true); edv.setUint16(10,files.length,true); edv.setUint32(12,cdSize,true); edv.setUint32(16,cdOffset,true);
  
  const total = cdOffset + cdSize + eocd.length, out = new Uint8Array(total); let pos = 0;
  for (const b of localFiles) { out.set(b, pos); pos += b.length; }
  for (const b of centralDir) { out.set(b, pos); pos += b.length; }
  out.set(eocd, pos); return out;
}

// ─── Bulk Operations UI & Handlers ──────────────────────────
window.updateBulkUI = function() {
  const encRows=Array.from(imgQueue.querySelectorAll('.row-card')), decRows=Array.from(jsonQueue.querySelectorAll('.row-card'));
  if(encRows.length>0){ 
    $('#bulkEncodeBar').style.display='flex'; 
    const selEnc = encRows.filter(r => r.querySelector('.js-row-sel').checked);
    $('#bulkEncodeCount').textContent = selEnc.length; 
    const allDone = selEnc.length > 0 && selEnc.every(r=>r._dlBlob);
    $('#btnDownloadAllEncode').disabled = !allDone;
    const bundleBtn = $('#btnBundleAllEncode'); if(bundleBtn) bundleBtn.disabled = !allDone;
    $('#btnProcessAllEncode').disabled = selEnc.length === 0;
  } else { $('#bulkEncodeBar').style.display='none'; }
  
  if(decRows.length>0){ 
    $('#bulkDecodeBar').style.display='flex'; 
    const selDec = decRows.filter(r => r.querySelector('.js-row-sel').checked);
    $('#bulkDecodeCount').textContent = selDec.length; 
    $('#btnDownloadAllDecode').disabled = selDec.length === 0 || !selDec.every(r=>r._blob||r._dlBlob||(r._done&&r.querySelector('canvas')));
    $('#btnProcessAllDecode').disabled = selDec.length === 0;
  } else { $('#bulkDecodeBar').style.display='none'; }
};
const observer = new MutationObserver(updateBulkUI);
observer.observe(imgQueue, {childList: true}); observer.observe(jsonQueue, {childList: true});

$('#btnClearAllEncode').onclick = () => { imgQueue.innerHTML = ''; clearDBStore('encodeFiles'); };
$('#btnClearAllDecode').onclick = () => { jsonQueue.innerHTML = ''; clearDBStore('decodeFiles'); };

document.addEventListener('change', e => {
  if (e.target.classList.contains('js-row-sel')) {
    updateBulkUI();
    const sae = $('#selectAllEncode');
    if (sae) sae.checked = Array.from(imgQueue.querySelectorAll('.row-card')).every(r => r.querySelector('.js-row-sel').checked);
    const sad = $('#selectAllDecode');
    if (sad) sad.checked = Array.from(jsonQueue.querySelectorAll('.row-card')).every(r => r.querySelector('.js-row-sel').checked);
  }
});
const sae = $('#selectAllEncode');
if (sae) sae.onchange = (e) => { Array.from(imgQueue.querySelectorAll('.js-row-sel')).forEach(cb => cb.checked = e.target.checked); updateBulkUI(); };
const sad = $('#selectAllDecode');
if (sad) sad.onchange = (e) => { Array.from(jsonQueue.querySelectorAll('.js-row-sel')).forEach(cb => cb.checked = e.target.checked); updateBulkUI(); };

async function autoCompileBulk(btn, activeText) {
  const allRows = Array.from(imgQueue.querySelectorAll('.row-card')).filter(r => r.querySelector('.js-row-sel').checked);
  let needsRecompile = false;
  for (const row of allRows) {
    const isGeneric = !!row._u8;
    const currentState = isGeneric ? getGenericRowState(row) : getImgRowState(row);
    if (!row._dlBlob || row._lastState !== currentState) { needsRecompile = true; break; }
  }
  
  if (needsRecompile) {
    if(btn) { btn.disabled=true; btn.textContent=activeText; }
    toast('Auto-compiling pending or mismatched settings...', 'info');
    for (const row of allRows) {
      const isGeneric = !!row._u8;
      const currentState = isGeneric ? getGenericRowState(row) : getImgRowState(row);
      if (!row._dlBlob || row._lastState !== currentState) {
        if(isGeneric) await convertGenericRow(row, row.id.replace('ir-','')); 
        else await convertImgRow(row, row.id.replace('ir-',''));
      }
    }
  }
  return allRows;
}

$('#btnProcessAllEncode').onclick = async () => {
  const btn=$('#btnProcessAllEncode'); 
  await autoCompileBulk(btn, 'Processing...');
  btn.disabled=false; btn.textContent='Encode All';
};

const bundleBtn = $('#btnBundleAllEncode');
if (bundleBtn) {
  bundleBtn.onclick = async () => {
    const allRows = await autoCompileBulk(bundleBtn, 'Compiling...');
    const rows = allRows.filter(r => r._dlBlob);
    if(!rows.length) { bundleBtn.disabled=false; bundleBtn.textContent='Bundle into 1 File'; return; }
    const pass = await customPrompt('Optional: Enter a password to encrypt this entire bundle', 'Bundle');
    if (pass === null) { bundleBtn.disabled=false; bundleBtn.textContent='Bundle into 1 File'; return; }
    bundleBtn.disabled=true; bundleBtn.textContent='Bundling...';
    
    try {
      const files = rows.map(r => r._origFile || (r._u8 ? new File([r._u8], r._fn, {type: r._mime}) : null)).filter(Boolean);
      let bundleBytes = await window.PXSN2.encodeBundleToPXSN(files, { imageEncoding: 'pixen', binaryEncoding: 'gzip' });
      
      let finalBlob, finalName;
      if (pass) {
        const enc = await encryptData(bundleBytes, pass);
        const envObj = { format: 'pixson-encrypted-v1', salt: enc.salt, iv: enc.iv, data: enc.data, originalFmt: 'bundle', originalName: 'workspace_bundle' };
        finalBlob = new Blob([JSON.stringify(envObj)], {type: 'application/json'});
        finalName = 'workspace.bundle.enc.json';
      } else {
        finalBlob = new Blob([bundleBytes], {type: 'application/octet-stream'});
        finalName = 'workspace.bundle.pxsn';
      }
      dlBlob(finalBlob, finalName);
      toast('Bundle generated successfully!', 'success');
    } catch(e) {
      toast('Bundle failed: '+e.message, 'error');
    }
    bundleBtn.disabled=false; bundleBtn.textContent='Bundle into 1 File';
  };
}

$('#btnProcessAllDecode').onclick = async () => {
  const btn=$('#btnProcessAllDecode'); btn.disabled=true; btn.textContent='Processing...';
  for (const row of Array.from(jsonQueue.querySelectorAll('.row-card')).filter(r => r.querySelector('.js-row-sel').checked)) {
    if (!row._done) { const b = row.querySelector('.js-recon'); if (b) { b.click(); await sleep(100); while (!row._done && document.body.contains(row)) await sleep(100); } }
  }
  btn.disabled=false; btn.textContent='Decode All';
};

// ─── Interactive Logo Rotation ──────────────────────────────
const logoIcon = document.querySelector('.logo-icon');
if (logoIcon) {
  let logoRot = 0, logoSpeed = 0.3, isDraggingLogo = false, lastX = 0;
  const tick = () => {
    if (!isDraggingLogo) {
      logoRot += logoSpeed;
      logoSpeed += (0.3 - logoSpeed) * 0.005; // Less friction so it spins much longer
    }
    logoIcon.style.transform = `rotate(${logoRot}deg)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  
  logoIcon.onpointerdown = e => {
    isDraggingLogo = true; lastX = e.clientX;
    try { logoIcon.setPointerCapture(e.pointerId); } catch(err){}
  };
  logoIcon.onpointermove = e => {
    if (!isDraggingLogo) return;
    const dx = e.clientX - lastX;
    logoRot += dx; 
    logoSpeed = (logoSpeed * 0.4) + (dx * 0.6); // Smoother momentum capture
    logoIcon.style.transform = `rotate(${logoRot}deg)`;
    lastX = e.clientX;
  };
  const endDrag = e => {
    if (!isDraggingLogo) return;
    isDraggingLogo = false;
    try { logoIcon.releasePointerCapture(e.pointerId); } catch(err){}
  };
  logoIcon.onpointerup = endDrag;
  logoIcon.onpointercancel = endDrag;
  document.addEventListener('pointerup', endDrag);
}
$('#btnDownloadAllEncode').onclick = async () => {
  const btn=$('#btnDownloadAllEncode');
  const allRows = await autoCompileBulk(btn, 'Compiling...');
  const rows = allRows.filter(r => r._dlBlob);
  if(!rows.length) { btn.disabled=false; btn.textContent='Download All (ZIP)'; return; }
  btn.disabled=true; btn.textContent='Zipping...';
  const files = [];
  for (const row of rows) { const buf = await row._dlBlob.arrayBuffer(); files.push({name: row._dlName, u8: new Uint8Array(buf)}); }
  dlBlob(new Blob([createZip(files)], {type:'application/zip'}), 'pixson_encoded.zip');
  btn.disabled=false; btn.textContent='Download All (ZIP)';
};

$('#btnDownloadAllDecode').onclick = async () => {
  const rows = Array.from(jsonQueue.querySelectorAll('.row-card')).filter(r => r.querySelector('.js-row-sel').checked && (r._done || r._dlBlob || r._blob));
  if(!rows.length) return;
  const files = [];
  for (const row of rows) {
    let u8, name;
    if (row._blob) { const buf=await row._blob.arrayBuffer(); u8=new Uint8Array(buf); name=row._obj.filename||'decoded-file'; }
    else if (row._dlBlob) { const buf=await row._dlBlob.arrayBuffer(); u8=new Uint8Array(buf); name=row._obj.filename||'decoded-file'; }
    else {
      const cvs=row.querySelector('canvas'); if(!cvs) continue;
      const fmt=row.querySelector('.js-outfmt').value, mime=fmt==='jpeg'?'image/jpeg':fmt==='webp'?'image/webp':'image/png';
      const ext=fmt==='jpeg'?'jpg':fmt;
      const blob=await new Promise(r => cvs.toBlob(r, mime, 1.0)), buf=await blob.arrayBuffer();
      u8=new Uint8Array(buf); name=(row._name||'decoded').replace(/\.(json|pxsn|gz)$/i,'')+'.'+ext;
    }
    files.push({name, u8});
  }
  dlBlob(new Blob([createZip(files)], {type:'application/zip'}), 'pixson_decoded.zip');
};

// ─── Rotating Witty Quotes ──────────────────────────────────
const wittyQuotes = [
  "Because sometimes a file needs to cosplay as text.",
  "Like ZIP, but with an identity crisis.",
  "Ctrl+C for files that refuse to be copied.",
  "Smuggling files through plain text since 2026.",
  "Your file's undercover identity: plain text.",
  "If Base64 had a glow-up.",
  "The witness protection program for files.",
  "When email says \"attachments not allowed.\"",
  "Because not every platform deserves your .pdf.",
  "Turning \"you can't send that\" into \"watch me.\"",
  "Sneak your files through text-only doors.",
  "The Swiss Army knife of copy and paste.",
  "ASCII would be proud.",
  "Any file. One text blob. No magic—just clever encoding.",
  "It's giving... file in a trench coat pretending to be text.",
  "For the moments when only text gets past security.",
  "Definitely not a PNG wearing a fake mustache.",
  "Your PDF identifies as a paragraph now.",
  "Congratulations. Your file is now literature.",
  "The greatest disguise since sunglasses and a fake mustache.",
  "The internet was built on text anyway.",
  "Looks like text. Secretly isn't.",
  "One giant wall of text. Surprisingly useful."
];
let wittyIndex = 0;
const wqEl = $('#wittyQuote');
setInterval(() => {
  if (!wqEl) return;
  wqEl.classList.add('slide-up');
  setTimeout(() => {
    wqEl.classList.remove('slide-up');
    wqEl.classList.add('slide-down');
    wittyIndex = (wittyIndex + 1) % wittyQuotes.length;
    wqEl.textContent = wittyQuotes[wittyIndex];
    void wqEl.offsetWidth; // Force reflow to apply the no-transition move
    wqEl.classList.remove('slide-down');
  }, 400); // Wait for slide-up transition to finish
}, 5000);

})();
