/* Pixson v8 — Universal File Encoder with Pixen Ultra */
(function(){
'use strict';
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

function getImgRowState(r){
  if(!r)return'';
  return JSON.stringify({
    o:r.querySelector('.js-orig').checked,
    m:r.querySelector('.js-maxdim').value,
    e:r.querySelector('.js-enc').value,
    f:r.querySelector('.js-fmt').value,
    st:r.querySelector('.js-stego-tog').checked,
    sx:r._stegoPayload||r.querySelector('.js-stego-txt').value,
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
function saveFileToDB(storeName, id, file) { if (db) db.transaction(storeName, 'readwrite').objectStore(storeName).put({ id, file, name: file.name, type: file.type, size: file.size }); }
function removeFileFromDB(storeName, id) { if (db) db.transaction(storeName, 'readwrite').objectStore(storeName).delete(id); }
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
      '<div class="row-thumb"><img src="'+dataUrl+'" alt=""></div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-dim">'+w+' × '+h+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Encode</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options">'+
      '<div class="option-group"><label class="option-label">Original size</label><label class="toggle-switch"><input type="checkbox" class="js-orig" checked><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Max Dimensions</label><input type="number" class="option-input js-maxdim" value="256" min="1" max="4096" disabled></div>'+
      '<div class="option-group"><label class="option-label">Encoding</label><select class="option-select js-enc">'+encOptHTML()+'</select></div>'+
      '<div class="option-group"><label class="option-label">Container Format</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option><option value="pxsn">PXN Binary (.pxsn)</option></select></div>'+
      '<div class="option-group"><label class="option-label">Steganography</label><label class="toggle-switch"><input type="checkbox" class="js-stego-tog"><span class="toggle-slider"></span></label></div>'+
      '<div class="option-group"><label class="option-label">Secret Text</label><div style="display:flex;gap:4px;"><input type="text" class="option-input js-stego-txt" placeholder="Type here..." disabled style="width:100px;"><button class="btn btn-sm btn-ghost js-stego-file-btn" disabled title="Upload Text File" style="padding:0 8px;">📄</button><input type="file" accept="text/plain,.txt" class="js-stego-file" style="display:none"></div></div>'+
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
  row._img=imgEl;row._fn=file.name;row._jd=null;

  const origTog=row.querySelector('.js-orig'),maxIn=row.querySelector('.js-maxdim'),encTog=row.querySelector('.js-enc-tog'),encPass=row.querySelector('.js-enc-pass');
  origTog.onchange=()=>{maxIn.disabled=origTog.checked;};
  encTog.onchange=()=>{encPass.disabled=!encTog.checked;if(encTog.checked)encPass.focus();};
  
  const stegoTog=row.querySelector('.js-stego-tog'),stegoTxt=row.querySelector('.js-stego-txt');
  const stegoBtn=row.querySelector('.js-stego-file-btn'),stegoFile=row.querySelector('.js-stego-file');
  stegoTog.onchange=()=>{
    const d=!stegoTog.checked; stegoTxt.disabled=d; stegoBtn.disabled=d;
    if(stegoTog.checked) stegoTxt.focus();
  };
  stegoTxt.oninput=()=>{ row._stegoPayload = null; };
  stegoBtn.onclick=()=>stegoFile.click();
  stegoFile.onchange=(e)=>{
    if(!e.target.files[0]) return;
    const f=e.target.files[0];
    const reader=new FileReader();
    reader.onload=(evt)=>{ 
      stegoTxt.value=`[File: ${f.name}]`; 
      row._stegoPayload = evt.target.result;
      toast('Loaded '+f.name,'success'); 
    };
    reader.readAsText(f);
    stegoFile.value='';
  };
  
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
      '<div class="row-thumb" style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--bg-input)">'+icon+'</div>'+
      '<div class="row-info"><div class="row-name" title="'+file.name+'">'+file.name+'</div>'+
        '<div class="row-meta"><span class="badge badge-enc">'+file.name.split('.').pop().toUpperCase()+'</span><span class="badge badge-size">'+fmtSz(file.size)+'</span></div></div>'+
      '<div class="row-actions"><button class="btn btn-sm btn-primary js-conv">Encode</button><button class="btn-remove js-rm">✕</button></div>'+
    '</div>'+
    '<div class="row-options" style="border-bottom:1px solid var(--border)">'+
      '<div class="option-group"><label class="option-label">Encoding</label><select class="option-select js-enc"><option value="base64">Base64</option><option value="base85">Base85 (Smaller)</option></select></div>'+
      '<div class="option-group"><label class="option-label">Container</label><select class="option-select js-fmt"><option value="json">JSON Text (.json)</option><option value="gz">GZipped JSON (.json.gz)</option><option value="pxsn">PXN Binary (.pxsn)</option></select></div>'+
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
  row._u8=u8;row._fn=file.name;row._mime=file.type||'application/octet-stream';row._jd=null;row._dlBlob=null;row._outFmt='json';row._blobUrl=url;
  const encTog=row.querySelector('.js-enc-tog'),encPass=row.querySelector('.js-enc-pass');
  encTog.onchange=()=>{encPass.disabled=!encTog.checked;if(encTog.checked)encPass.focus();};
  
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
  
  if (outFmt === 'pxsn') {
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
  if(encTog && outFmt !== 'stego'){
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
  
  const stegoTog = row.querySelector('.js-stego-tog').checked, stegoTxt = row.querySelector('.js-stego-txt').value;
  
  if (stegoTog) {
    const payloadStr = row._stegoPayload || stegoTxt;
    if (!payloadStr) { toast('Enter Secret Text or upload a file!', 'error'); btn.disabled = false; btn.textContent = 'Encode'; hideProgress(row); return; }
    
    // Convert secret text to binary
    const textBytes = new TextEncoder().encode(payloadStr);
    const finalPayload = new Uint8Array(9 + textBytes.length);
    finalPayload[0]=80; finalPayload[1]=88; finalPayload[2]=83; finalPayload[3]=84; // PXST
    finalPayload[4]=0; // No encryption flag for this text (keep it simple)
    const len = textBytes.length;
    finalPayload[5] = (len >>> 24) & 255; finalPayload[6] = (len >>> 16) & 255; finalPayload[7] = (len >>> 8) & 255; finalPayload[8] = len & 255;
    finalPayload.set(textBytes, 9);
    
    const imgData = ctx.getImageData(0, 0, cw, ch); const pixels = imgData.data;
    const maxBytes = Math.floor((pixels.length / 4 * 3) / 8);
    if (finalPayload.length > maxBytes) { toast(`Text too long! Max ${fmtSz(maxBytes)} chars for this image.`, 'error'); hideProgress(row); btn.disabled = false; btn.textContent = 'Encode'; return; }
    
    let bitIdx = 0; const totalBits = finalPayload.length * 8;
    for (let i = 0; i < pixels.length && bitIdx < totalBits; i += 4) {
      for (let c = 0; c < 3; c++) {
        if (bitIdx < totalBits) {
          const byte = finalPayload[Math.floor(bitIdx / 8)];
          const bit = (byte >>> (7 - (bitIdx % 8))) & 1;
          pixels[i + c] = (pixels[i + c] & ~1) | bit;
          bitIdx++;
        }
      }
      pixels[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const stegoBlob = await new Promise(res => cvs.toBlob(res, 'image/png'));
    
    row._dlBlob = stegoBlob;
    row._dlName = row._fn.replace(/\.[^/.]+$/,'')+'_secret.png';
    row._outFmt = 'png';
    
    hideProgress(row);
    const res=row.querySelector('#res-'+id); res.classList.add('visible');
    res.querySelector('.js-eb').textContent='Steganography';
    res.querySelector('.js-js').textContent=fmtSz(stegoBlob.size);
    res.querySelector('.js-jp').textContent=`[STEGANOGRAPHY]\nSecret message successfully embedded into ${cw}x${ch} PNG.\nOutput is a completely normal PNG image.`;
    
    const qrBtn = row.querySelector('.js-qr-btn'); if(qrBtn) qrBtn.style.display = 'none';
    btn.disabled=false;btn.textContent='Encode';
    if(typeof updateBulkUI==='function') updateBulkUI();
    toast('Secret Text Hidden!', 'success');
    return;
  }
  
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

  if (outFmt === 'pxsn') {
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
  if(encTog && outFmt !== 'stego'){
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
  const items=e.clipboardData?.items;if(!items)return;
  for(const it of items)if(it.type.startsWith('image/')){e.preventDefault();const b=it.getAsFile();if(b)addImgBlob(b);return;}
};

// ══════════════════════════════════════════════════════════════
//  DECODE — Data → File / Image (multi-row)
// ══════════════════════════════════════════════════════════════

async function processDataBuffer(u8, name, id, sizeOverride) {
  const sizeStr = fmtSz(sizeOverride || u8.length);
  
  if (u8.length >= 8 && u8[0]===137 && u8[1]===80 && u8[2]===78 && u8[3]===71) {
    try {
      const blob = new Blob([u8], {type: 'image/png'});
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      URL.revokeObjectURL(url);
      
      const cvs = document.createElement('canvas'); cvs.width = img.width; cvs.height = img.height;
      const ctx = cvs.getContext('2d'); ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height); const pixels = imgData.data;
      
      const headerBytes = new Uint8Array(9);
      let bitIdx = 0;
      for (let i = 0; i < pixels.length && bitIdx < 72; i += 4) {
        for (let c = 0; c < 3; c++) {
          if (bitIdx < 72) { const bit = pixels[i + c] & 1; headerBytes[Math.floor(bitIdx / 8)] |= (bit << (7 - (bitIdx % 8))); bitIdx++; }
        }
      }
      
      if (headerBytes[0]===80 && headerBytes[1]===88 && headerBytes[2]===83 && headerBytes[3]===84) {
        const isEnc = headerBytes[4] === 1;
        const len = (headerBytes[5]<<24) | (headerBytes[6]<<16) | (headerBytes[7]<<8) | headerBytes[8];
        if (len > 0 && len < 50*1024*1024) {
          const payload = new Uint8Array(len);
          bitIdx = 0; const totalBits = len * 8;
          let pixelIdx = Math.floor(72 / 3) * 4; let cIdx = 72 % 3;
          for (let i = pixelIdx; i < pixels.length && bitIdx < totalBits; i += 4) {
            for (let c = cIdx; c < 3; c++) {
              if (bitIdx < totalBits) { const bit = pixels[i + c] & 1; payload[Math.floor(bitIdx / 8)] |= (bit << (7 - (bitIdx % 8))); bitIdx++; }
            }
            cIdx = 0;
          }
          if (bitIdx === totalBits) {
            toast('Hidden payload extracted from PNG!', 'success');
            if (isEnc && payload.length > 28) {
              const salt = Array.from(payload.subarray(0, 16)); const iv = Array.from(payload.subarray(16, 28)); const ct = u8ToB64(payload.subarray(28));
              const envObj = { format:'pixson-encrypted-v1', salt, iv, data:ct, originalFmt: 'pxsn', originalName: 'Hidden Payload' };
              makeEncryptedDecodeRow(id + '_payload', name, fmtSz(len), envObj);
              const mockImgObj = { format: 'pixson-file-v1', filename: name, mimeType: 'image/png', originalSize: u8.length, encoding: 'Raw Text', _binaryData: u8 };
              makeGenericDecodeRow(id, name, sizeStr, mockImgObj);
            } else {
              const secretText = new TextDecoder().decode(payload);
              makeStegoDecodeRow(id, name, u8, secretText, len);
            }
            return;
          }
        }
      }
    } catch(e) { console.error('PNG Parse Error', e); }
    toast('No hidden payload found in this PNG.', 'info');
    return;
  }

  try {
    const text = new TextDecoder().decode(u8);
    if(text.includes('pixson-encrypted-v1')){
      const obj = JSON.parse(text);
      if(obj.format === 'pixson-encrypted-v1') { makeEncryptedDecodeRow(id, name, sizeStr, obj); return; }
    }
  } catch(e) {}
  if(u8.length>=4 && u8[0]===80 && u8[1]===88 && u8[2]===69 && u8[3]===78){
    const parsed = parsePxnBinary(u8);
    if (parsed.type === 3) {
      const obj = { format: 'pixson-file-v1', filename: parsed.filename, mimeType: parsed.mimeType, originalSize: parsed.originalSize, encoding: 'PXN Binary (Deflate)', _binaryData: parsed.data };
      makeGenericDecodeRow(id, name, sizeStr, obj);
      return;
    }
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
  let obj;
  try {
    obj = JSON.parse(text);
  } catch(e) {
    if (name.startsWith('Extracted from')) {
      const mockObj = { format: 'pixson-file-v1', filename: 'secret_message.txt', mimeType: 'text/plain', originalSize: u8.length, encoding: 'Raw Text', _binaryData: u8 };
      makeGenericDecodeRow(id, name, sizeStr, mockObj);
      return;
    }
    throw e;
  }
  if(obj.format==='pixson-file-v1'){makeGenericDecodeRow(id,name,sizeStr,obj);return;}
  makeDataRow(id, name, sizeStr, obj, obj.encoding||'hex');
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
  if (!text.startsWith('{') && !text.startsWith('[')) {
    try {
      const u8 = b64ToU8(text);
      await processDataBuffer(u8, name || 'pasted-base64-'+id, id);
      return;
    } catch(e) {}
  }
  try {
    const obj = JSON.parse(text);
    if(obj.format==='pixson-encrypted-v1'){makeEncryptedDecodeRow(id,name||'pasted-'+id,fmtSz(new Blob([text]).size),obj);return;}
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
    cvs.toBlob(b=>{if(b){dlBlob(b,'pixson-reconstructed.'+ext);toast('Downloaded!','success');}},mime,1.0); // 1.0 = Highest quality
  };
  toast('Added: '+name,'success',1800);
}

// ─── Encrypted Decode Row ────────────────────────────────────
function makeEncryptedDecodeRow(id,name,sizeStr,obj){
  const row=document.createElement('div');row.className='row-card';row.id='jr-'+id;
  row.innerHTML=
    '<div class="row-top">'+
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
  row.querySelector('.js-dec').onclick=async()=>{
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

// ─── Steganography Decode Row ─────────────────────────────────
function makeStegoDecodeRow(id, name, imgU8, secretText, len) {
  const row = document.createElement('div'); row.className = 'row-card'; row.id = 'jr-'+id;
  const imgUrl = URL.createObjectURL(new Blob([imgU8], {type: 'image/png'}));
  
  row.innerHTML =
    '<div class="row-top">' +
      '<div class="row-thumb"><img src="'+imgUrl+'" alt=""></div>' +
      '<div class="row-info"><div class="row-name" title="'+name+'">'+name+'</div>' +
        '<div class="row-meta"><span class="badge badge-enc" style="background:var(--accent);color:#000">STEGANOGRAPHY</span><span class="badge badge-size">'+fmtSz(imgU8.length)+'</span><span class="badge badge-dim">Secret: '+fmtSz(len)+'</span></div></div>' +
      '<div class="row-actions">' +
        '<button class="btn btn-sm btn-ghost js-cp">Copy Text</button>' +
        '<button class="btn btn-sm btn-accent js-dli">Download Image</button>' +
        '<button class="btn-remove js-rm">✕</button></div>' +
    '</div>' +
    '<div class="row-result visible">' +
      '<div class="row-preview-wrap checker"><img src="'+imgUrl+'" class="js-stego-img" style="max-width:100%;max-height:400px;display:block;margin:0 auto;border-radius:4px;cursor:zoom-in;"></div>' +
      '<div class="row-result-header" style="margin-top:15px; border-top:1px solid var(--border); padding-top:15px;"><h4>Extracted Secret Message</h4></div>' +
      '<pre class="json-preview" style="margin-top:10px; white-space:pre-wrap;">'+secretText.replace(/</g, '&lt;')+'</pre>' +
    '</div>';
  jsonQueue.appendChild(row);
  
  row.querySelector('.js-rm').onclick = () => { removeFileFromDB('decodeFiles', id); URL.revokeObjectURL(imgUrl); row.style.cssText='opacity:0;transform:translateY(-6px);transition:all .18s'; setTimeout(()=>row.remove(),180); };
  row.querySelector('.js-cp').onclick = async () => {
    try { await navigator.clipboard.writeText(secretText); toast('Copied secret text!', 'success'); }
    catch { toast('Copy failed', 'error'); }
  };
  row.querySelector('.js-dli').onclick = () => {
    const a = document.createElement('a'); a.href = imgUrl; a.download = name; a.click(); toast('Downloaded image!', 'success');
  };
  
  const thumbImg = row.querySelector('.row-thumb img');
  const mainImg = row.querySelector('.js-stego-img');
  if (thumbImg) { thumbImg.style.cursor = 'zoom-in'; thumbImg.onclick = () => openImagePreview(imgUrl); }
  if (mainImg) mainImg.onclick = () => openImagePreview(imgUrl);
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
      btn.textContent='Decoded ✓';
      toast('Decoded: '+(obj.filename||'file')+' ('+fmtSz(raw.length)+')','success');
      if(typeof updateBulkUI==='function') updateBulkUI();
    }catch(err){hideProgress(row);toast('Decode error: '+err.message,'error');btn.disabled=false;btn.textContent='Decode';}
  };
  row.querySelector('.js-dli').onclick=()=>{if(!row._blob)return;dlBlob(row._blob,obj.filename||'decoded-file');toast('Downloaded!','success');};
  toast('Added: '+(obj.filename||name),'success',1800);
}

async function reconRow(row,id){
  const obj=row._obj,w=obj.width,h=obj.height,enc=obj.encoding||'hex';
  const btn=row.querySelector('.js-recon');btn.disabled=true;btn.textContent='Working…';
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
  btn.disabled=false;btn.textContent='Reconstruct';
  hideProgress(row);
  toast('Reconstructed: '+w+'×'+h,'success');
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
  const text = e.clipboardData?.getData('text');
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
  if(encRows.length>0){ $('#bulkEncodeBar').style.display='flex'; $('#bulkEncodeCount').textContent=encRows.length; $('#btnDownloadAllEncode').disabled=!encRows.every(r=>r._dlBlob); }
  else { $('#bulkEncodeBar').style.display='none'; }
  if(decRows.length>0){ $('#bulkDecodeBar').style.display='flex'; $('#bulkDecodeCount').textContent=decRows.length; $('#btnDownloadAllDecode').disabled=!decRows.every(r=>r._blob||r._dlBlob||(r._done&&r.querySelector('canvas'))); }
  else { $('#bulkDecodeBar').style.display='none'; }
};
const observer = new MutationObserver(updateBulkUI);
observer.observe(imgQueue, {childList: true}); observer.observe(jsonQueue, {childList: true});

$('#btnClearAllEncode').onclick = () => { imgQueue.innerHTML = ''; };
$('#btnClearAllDecode').onclick = () => { jsonQueue.innerHTML = ''; };

$('#btnProcessAllEncode').onclick = async () => {
  const btn=$('#btnProcessAllEncode'); btn.disabled=true; btn.textContent='Processing...';
  for (const row of Array.from(imgQueue.querySelectorAll('.row-card'))) {
    if (!row._dlBlob) { if(row._u8) await convertGenericRow(row, row.id.replace('ir-','')); else await convertImgRow(row, row.id.replace('ir-','')); }
  }
  btn.disabled=false; btn.textContent='Encode All';
};

$('#btnProcessAllDecode').onclick = async () => {
  const btn=$('#btnProcessAllDecode'); btn.disabled=true; btn.textContent='Processing...';
  for (const row of Array.from(jsonQueue.querySelectorAll('.row-card'))) {
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
    logoIcon.setPointerCapture(e.pointerId);
  };
  logoIcon.onpointermove = e => {
    if (!isDraggingLogo) return;
    const dx = e.clientX - lastX;
    logoRot += dx; 
    logoSpeed = (logoSpeed * 0.4) + (dx * 0.6); // Smoother momentum capture
    logoIcon.style.transform = `rotate(${logoRot}deg)`;
    lastX = e.clientX;
  };
  logoIcon.onpointerup = e => {
    isDraggingLogo = false;
    logoIcon.releasePointerCapture(e.pointerId);
  };
}
$('#btnDownloadAllEncode').onclick = async () => {
  const rows = Array.from(imgQueue.querySelectorAll('.row-card')).filter(r => r._dlBlob);
  if(!rows.length) return;
  const files = [];
  for (const row of rows) { const buf = await row._dlBlob.arrayBuffer(); files.push({name: row._dlName, u8: new Uint8Array(buf)}); }
  dlBlob(new Blob([createZip(files)], {type:'application/zip'}), 'pixson_encoded.zip');
};

$('#btnDownloadAllDecode').onclick = async () => {
  const rows = Array.from(jsonQueue.querySelectorAll('.row-card')).filter(r => r._done || r._dlBlob || r._blob);
  if(!rows.length) return;
  const files = [];
  for (const row of rows) {
    let u8, name;
    if (row._blob) { const buf=await row._blob.arrayBuffer(); u8=new Uint8Array(buf); name=row._obj?.filename||'decoded-file'; }
    else if (row._dlBlob) { const buf=await row._dlBlob.arrayBuffer(); u8=new Uint8Array(buf); name=row._obj?.filename||'decoded-file'; }
    else {
      const cvs=row.querySelector('canvas'); if(!cvs) continue;
      const fmt=row.querySelector('.js-outfmt').value, mime=fmt==='jpeg'?'image/jpeg':fmt==='webp'?'image/webp':'image/png';
      const ext=fmt==='jpeg'?'jpg':fmt;
      const blob=await new Promise(r => cvs.toBlob(r, mime, 1.0)), buf=await blob.arrayBuffer();
      u8=new Uint8Array(buf); name=(row._name||'reconstructed').replace(/\.(json|pxsn|gz)$/i,'')+'.'+ext;
    }
    files.push({name, u8});
  }
  dlBlob(new Blob([createZip(files)], {type:'application/zip'}), 'pixson_decoded.zip');
};

})();
