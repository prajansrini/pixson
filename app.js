/* Pixson v8 — Universal File Encoder with Pixen Ultra */
(function(){
'use strict';
const $=s=>document.querySelector(s);

const tabI=$('#tabImg2Json'),tabJ=$('#tabJson2Img'),tabInd=$('#tabIndicator');
const panelI=$('#panelImg2Json'),panelJ=$('#panelJson2Img');
const imgDrop=$('#imgDropZone'),imgInput=$('#imgFileInput'),imgQueue=$('#imageQueue');
const jsonDrop=$('#jsonDropZone'),jsonInput=$('#jsonFileInput'),jsonText=$('#jsonTextInput');
const addPastedBtn=$('#addPastedJson'),jsonQueue=$('#jsonQueue');
const toasts=$('#toastContainer'),themeBtn=$('#themeToggle');

let imgCtr=0, jsonCtr=0;

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
function setTheme(t){document.body.setAttribute('data-theme',t);localStorage.setItem('pixson-theme',t);}
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

// ─── Helpers ────────────────────────────────────────────────
function fmtSz(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(2)+' MB';}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function dlBlob(b,n){const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5e3);}
function c2h(c){return c.toString(16).padStart(2,'0');}
function rgbHex(r,g,b){return c2h(r)+c2h(g)+c2h(b);}
function rgbInt(r,g,b){return(r<<16)|(g<<8)|b;}

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
function parsePxnBinary(u8) {
  if (u8.length < 13 || u8[0]!==80 || u8[1]!==88 || u8[2]!==69 || u8[3]!==78) throw new Error("Invalid PXN file");
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  return { w: view.getUint32(4, true), h: view.getUint32(8, true), type: u8[12], data: u8.slice(13) };
}

function u8ToB64(u8){
  let b='';const chunk=8192;
  for(let i=0;i<u8.length;i+=chunk)b+=String.fromCharCode.apply(null,u8.subarray(i,i+chunk));
  return btoa(b);
}
function b64ToU8(s){const b=atob(s);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}

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

function addImg(file){
  const id=++imgCtr,reader=new FileReader();
  reader.onload=e=>{const img=new Image();img.onload=()=>makeImgRow(id,file,img,e.target.result);img.src=e.target.result;};
  reader.readAsDataURL(file);
}

function addImgBlob(blob){
  const id=++imgCtr,reader=new FileReader();
  reader.onload=e=>{const img=new Image();img.onload=()=>makeImgRow(id,{name:'pasted-'+id+'.png',size:blob.size,type:blob.type},img,e.target.result);img.src=e.target.result;};
  reader.readAsDataURL(blob);
}

function makeImgRow(id,file,imgEl,dataUrl){
  const w=imgEl.naturalWidth,h=imgEl.naturalHeight;
  const row=document.createElement('div');row.className='row-card';row.id='ir-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<div class="row-thumb"><img src="'+dataUrl+'" alt=""></div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-dim">'+w+' × '+h+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Convert</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options">'+
      '<div class="option-group"><label class="option-label">Original size</label><label class="toggle-switch"><input type="checkbox" class="js-orig"><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Max Dimensions</label><input type="number" class="option-input js-maxdim" value="256" min="1" max="4096"></div>'+
      '<div class="option-group"><label class="option-label">Encoding</label><select class="option-select js-enc">'+encOptHTML()+'</select></div>'+
      '<div class="option-group"><label class="option-label">Container Format</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option><option value="pxn">PXN Binary (.pxn)</option></select></div>'+
    '</div>'+
    '<div class="row-result" id="res-'+id+'">'+
      '<div class="row-result-header"><h4>JSON Preview</h4><div class="card-actions">'+
        '<span class="badge badge-enc js-eb"></span><span class="badge badge-size js-js"></span>'+
        '<button class="btn btn-sm btn-ghost js-cp">Copy</button><button class="btn btn-sm btn-accent js-dl">Download</button></div></div>'+
      '<pre class="json-preview js-jp"></pre>'+
    '</div>';

  imgQueue.appendChild(row);
  row._img=imgEl;row._fn=file.name;row._jd=null;

  const origTog=row.querySelector('.js-orig'),maxIn=row.querySelector('.js-maxdim');
  origTog.onchange=()=>{maxIn.disabled=origTog.checked;};
  row.querySelector('.js-rm').onclick=()=>{row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  row.querySelector('.js-conv').onclick=()=>convertImgRow(row,id);
  
  row.querySelector('.js-cp').onclick=async()=>{
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
  row.querySelector('.js-dl').onclick=()=>{
    if(!row._dlBlob)return;
    dlBlob(row._dlBlob, row._dlName);
    toast('Downloaded!','success');
  };
  toast('Added: '+file.name,'success',1800);
}

// ─── Generic File Row ────────────────────────────────────────
function addGenericFile(file){
  const id=++imgCtr;
  const reader=new FileReader();
  reader.onload=e=>{
    const u8=new Uint8Array(e.target.result);
    makeGenericRow(id,file,u8);
  };
  reader.readAsArrayBuffer(file);
}

function makeGenericRow(id,file,u8){
  const icon=getFileIcon(file.name);
  const row=document.createElement('div');row.className='row-card';row.id='ir-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">'+icon+'</div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">'+file.name.split('.').pop().toUpperCase()+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Encode</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options">'+
      '<div class="option-group"><label class="option-label">Container</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option></select></div>'+
    '</div>'+
    '<div class="row-result" id="res-'+id+'">'+
      '<div class="row-result-header"><h4>Output Preview</h4><div class="card-actions">'+
        '<span class="badge badge-enc js-eb"></span><span class="badge badge-size js-js"></span>'+
        '<button class="btn btn-sm btn-ghost js-cp">Copy</button><button class="btn btn-sm btn-accent js-dl">Download</button></div></div>'+
      '<pre class="json-preview js-jp"></pre>'+
    '</div>';
  imgQueue.appendChild(row);
  row._u8=u8;row._fn=file.name;row._mime=file.type||'application/octet-stream';row._jd=null;row._dlBlob=null;row._outFmt='json';
  row.querySelector('.js-rm').onclick=()=>{row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  row.querySelector('.js-conv').onclick=()=>convertGenericRow(row,id);
  row.querySelector('.js-cp').onclick=async()=>{
    if(!row._dlBlob)return;
    try{
      let text;
      if(row._outFmt==='json') text=JSON.stringify(row._jd,null,2);
      else{const buf=await row._dlBlob.arrayBuffer();text=u8ToB64(new Uint8Array(buf));}
      await navigator.clipboard.writeText(text);toast('Copied!','success');
    }catch{toast('Copy failed','error');}
  };
  row.querySelector('.js-dl').onclick=()=>{if(!row._dlBlob)return;dlBlob(row._dlBlob,row._dlName);toast('Downloaded!','success');};
  toast('Added: '+file.name,'success',1800);
}

async function convertGenericRow(row,id){
  const outFmt=row.querySelector('.js-fmt').value;
  const btn=row.querySelector('.js-conv');btn.disabled=true;btn.textContent='Encoding…';
  await sleep(10);
  const compressed=await compressBytes(row._u8);
  const b64=u8ToB64(compressed);
  const obj={format:'pixson-file-v1',filename:row._fn,mimeType:row._mime,originalSize:row._u8.length,encoding:'gzip+base64',data:b64};
  row._jd=obj;
  const jsonStr=JSON.stringify(obj,null,2);
  let fileBlob,fileExt,displaySize,previewStr;
  if(outFmt==='gz'){
    const gzBytes=await gzipJSON(jsonStr);
    fileBlob=new Blob([gzBytes],{type:'application/gzip'});fileExt='json.gz';
    displaySize=gzBytes.length;previewStr=hexDump(gzBytes);
  }else{
    fileBlob=new Blob([jsonStr],{type:'application/json'});fileExt='json';
    displaySize=jsonStr.length;
    const mp=50000;previewStr=jsonStr.length>mp?jsonStr.substring(0,mp)+'\n\n… ['+fmtSz(jsonStr.length-mp)+' more]':jsonStr;
  }
  row._dlBlob=fileBlob;row._dlName=row._fn+'.pixson.'+fileExt;row._outFmt=outFmt;
  const res=row.querySelector('#res-'+id);res.classList.add('visible');
  res.querySelector('.js-eb').textContent='GZIP+B64';
  res.querySelector('.js-js').textContent=fmtSz(displaySize);
  res.querySelector('.js-jp').textContent=previewStr;
  btn.disabled=false;btn.textContent='Encode';
  toast(fmtSz(row._u8.length)+' → '+fmtSz(displaySize)+' ('+((displaySize/row._u8.length)*100).toFixed(0)+'%)','success');
}

async function convertImgRow(row,id){
  const imgEl=row._img,useOrig=row.querySelector('.js-orig').checked;
  const maxDim=parseInt(row.querySelector('.js-maxdim').value)||256;
  let enc=row.querySelector('.js-enc').value;
  const outFmt=row.querySelector('.js-fmt').value;
  
  if (outFmt === 'pxn' && enc !== 'pixenultra') enc = 'pixen';
  
  const btn=row.querySelector('.js-conv');btn.disabled=true;btn.textContent='Converting…';
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

  if (outFmt === 'pxn') {
    const pxnType = enc === 'pixenultra' ? 2 : 1;
    const bin = createPxnBinary(cw, ch, b64ToU8(obj.data), pxnType);
    fileBlob = new Blob([bin], {type: 'application/octet-stream'});
    fileExt = 'pxn';
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

  row._dlBlob = fileBlob;
  row._dlName = row._fn.replace(/\.[^/.]+$/,'')+'-pixson.'+fileExt;
  row._outFmt = outFmt;

  const res=row.querySelector('#res-'+id);
  res.classList.add('visible');
  res.querySelector('.js-eb').textContent=displayEnc;
  res.querySelector('.js-js').textContent=fmtSz(displaySize);
  res.querySelector('.js-jp').textContent=previewStr;

  btn.disabled=false;btn.textContent='Convert';
  toast((cw*ch).toLocaleString()+' px → '+fmtSz(displaySize)+' ('+displayEnc+')','success');
}

// Drop/click/paste
imgDrop.onclick=()=>imgInput.click();
imgInput.onchange=e=>{if(e.target.files.length)addFiles(e.target.files);imgInput.value='';};
imgDrop.ondragover=e=>{e.preventDefault();imgDrop.classList.add('drag-over');};
imgDrop.ondragleave=()=>imgDrop.classList.remove('drag-over');
imgDrop.ondrop=e=>{e.preventDefault();imgDrop.classList.remove('drag-over');if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files);};
document.onpaste=e=>{
  if(document.activeElement===jsonText)return;
  if(!panelI.classList.contains('active'))return;
  const items=e.clipboardData?.items;if(!items)return;
  for(const it of items)if(it.type.startsWith('image/')){e.preventDefault();const b=it.getAsFile();if(b)addImgBlob(b);return;}
};

// ══════════════════════════════════════════════════════════════
//  DECODE — Data → File / Image (multi-row)
// ══════════════════════════════════════════════════════════════

async function processDataBuffer(u8, name, id, sizeOverride) {
  const sizeStr = fmtSz(sizeOverride || u8.length);
  if(u8.length>=4 && u8[0]===80 && u8[1]===88 && u8[2]===69 && u8[3]===78){
    const parsed = parsePxnBinary(u8);
    const encType = parsed.type === 2 ? 'pixenultra' : 'pixen';
    const obj = { format:'pixen-v1', width:parsed.w, height:parsed.h, encoding:encType, _binaryData:parsed.data };
    makeDataRow(id, name, sizeStr, obj, 'PXN Binary ('+encType+')');
    return;
  }
  if(u8.length>=2 && u8[0]===0x1f && u8[1]===0x8b){
    const jsonStr = await ungzipJSON(u8);
    const obj = JSON.parse(jsonStr);
    if(obj.format==='pixson-file-v1'){makeGenericDecodeRow(id,name,sizeStr,obj);return;}
    makeDataRow(id, name, sizeStr, obj, (obj.encoding||'hex')+' (GZIP)');
    return;
  }
  const text = new TextDecoder().decode(u8);
  const obj = JSON.parse(text);
  if(obj.format==='pixson-file-v1'){makeGenericDecodeRow(id,name,sizeStr,obj);return;}
  makeDataRow(id, name, sizeStr, obj, obj.encoding||'hex');
}

function addDataFiles(files){for(const f of files)addDataFile(f);}

function addDataFile(file){
  const id=++jsonCtr, reader=new FileReader();
  reader.onload=async e=>{
    try {
      await processDataBuffer(new Uint8Array(e.target.result), file.name, id, file.size);
    } catch(err) { toast('Error reading file: '+err.message, 'error'); }
  };
  reader.readAsArrayBuffer(file);
}

async function addJsonFromText(text,name){
  const id=++jsonCtr;
  if (!text.startsWith('{') && !text.startsWith('[')) {
    try {
      const u8 = b64ToU8(text);
      await processDataBuffer(u8, name || 'pasted-base64-'+id, id);
      return;
    } catch(e) {}
  }
  try {
    const obj = JSON.parse(text);
    if(obj.format==='pixson-file-v1'){makeGenericDecodeRow(id,name||'pasted-'+id,fmtSz(new Blob([text]).size),obj);return;}
    makeDataRow(id, name||'pasted-'+id+'.json', fmtSz(new Blob([text]).size), obj, obj.encoding||'hex');
  } catch(e) { toast('Invalid Data: '+e.message, 'error'); }
}

function makeDataRow(id,name,sizeStr,obj,encBadge){
  if(!obj.width||!obj.height){toast(name+': missing width/height','error');return;}
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<div class="row-thumb" id="jthumb-'+id+'"><canvas width="1" height="1"></canvas></div>'+
      '<div class="row-info"><div class="row-name" title="'+name+'">'+name+'</div>'+
        '<div class="row-meta"><span class="badge badge-dim">'+obj.width+' × '+obj.height+'</span><span class="badge badge-size">'+sizeStr+'</span><span class="badge badge-enc">'+encBadge+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-recon">Reconstruct</button>'+
        '<select class="option-select js-outfmt"><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP Lossless</option></select>'+
        '<button class="btn btn-sm btn-accent js-dli" disabled>Download</button>'+
        '<button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-result" id="jres-'+id+'">'+
      '<div class="row-preview-wrap checker"><canvas id="jcvs-'+id+'"></canvas></div>'+
    '</div>';

  jsonQueue.appendChild(row);
  row._obj=obj;row._name=name;row._done=false;

  row.querySelector('.js-rm').onclick=()=>{row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  row.querySelector('.js-recon').onclick=()=>reconRow(row,id);
  row.querySelector('.js-dli').onclick=()=>{
    if(!row._done)return;
    const fmt=row.querySelector('.js-outfmt').value;
    const mime=fmt==='jpeg'?'image/jpeg':fmt==='webp'?'image/webp':'image/png';
    const ext=fmt==='jpeg'?'jpg':fmt;
    const cvs=row.querySelector('#jcvs-'+id);
    cvs.toBlob(b=>{if(b){dlBlob(b,'pixson-reconstructed.'+ext);toast('Downloaded!','success');}},mime,1.0); // 1.0 = Highest quality
  };
  toast('Added: '+name,'success',1800);
}

// ─── Generic File Decode Row ─────────────────────────────────
function makeGenericDecodeRow(id,name,sizeStr,obj){
  const icon=getFileIcon(obj.filename||'file');
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">'+icon+'</div>'+
      '<div class="row-info"><div class="row-name" title="'+(obj.filename||name)+'">'+(obj.filename||name)+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">'+(obj.filename||'').split('.').pop().toUpperCase()+'</span><span class="badge badge-size">'+fmtSz(obj.originalSize||0)+'</span><span class="badge badge-dim">Encoded: '+sizeStr+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-recon">Decode</button>'+
        '<button class="btn btn-sm btn-accent js-dli" disabled>Download</button>'+
        '<button class="btn-remove js-rm">✕</button></div>'+
    '</div>';
  jsonQueue.appendChild(row);
  row._obj=obj;row._done=false;
  row.querySelector('.js-rm').onclick=()=>{row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s';setTimeout(()=>row.remove(),180);};
  row.querySelector('.js-recon').onclick=async()=>{
    const btn=row.querySelector('.js-recon');btn.disabled=true;btn.textContent='Decoding…';
    try{
      const compressed=b64ToU8(obj.data);
      const raw=await decompressBytes(compressed);
      const blob=new Blob([raw],{type:obj.mimeType||'application/octet-stream'});
      row._blob=blob;row._done=true;
      row.querySelector('.js-dli').disabled=false;
      btn.textContent='Decoded ✓';
      toast('Decoded: '+(obj.filename||'file')+' ('+fmtSz(raw.length)+')','success');
    }catch(err){toast('Decode error: '+err.message,'error');btn.disabled=false;btn.textContent='Decode';}
  };
  row.querySelector('.js-dli').onclick=()=>{if(!row._blob)return;dlBlob(row._blob,obj.filename||'decoded-file');toast('Downloaded!','success');};
  toast('Added: '+(obj.filename||name),'success',1800);
}

async function reconRow(row,id){
  const obj=row._obj,w=obj.width,h=obj.height,enc=obj.encoding||'hex';
  const btn=row.querySelector('.js-recon');btn.disabled=true;btn.textContent='Working…';
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
  btn.disabled=false;btn.textContent='Reconstruct';
  toast('Reconstructed: '+w+'×'+h,'success');
}

// Drop/click for Data
jsonDrop.onclick=()=>jsonInput.click();
jsonInput.onchange=e=>{if(e.target.files.length)addDataFiles(e.target.files);jsonInput.value='';};
jsonDrop.ondragover=e=>{e.preventDefault();jsonDrop.classList.add('drag-over');};
jsonDrop.ondragleave=()=>jsonDrop.classList.remove('drag-over');
jsonDrop.ondrop=e=>{e.preventDefault();jsonDrop.classList.remove('drag-over');if(e.dataTransfer.files.length)addDataFiles(e.dataTransfer.files);};

// Paste JSON text button
addPastedBtn.onclick=()=>{
  const t=jsonText.value.trim();
  if(!t){toast('Paste JSON first','error');return;}
  addJsonFromText(t);
  jsonText.value='';
};

})();
