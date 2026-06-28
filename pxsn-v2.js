"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAGIC = [0x50, 0x58, 0x53, 0x56]; // "PXSV"
const VERSION = 0x02;

const FILE_TYPE = { IMAGE: 0x01, BINARY: 0x02, BUNDLE: 0x03 };

// Image encoding bytes — maps to your 7 dropdown options
const ENC_IMAGE = {
  HEX: 0x01, // Hex String (Medium)
  INT: 0x02, // 24-bit Integer (Small)
  PACKED: 0x03, // Packed Array (Small)
  RGBA_GZIP: 0x04, // Raw RGBA bytes → gzip
  PIXEN: 0x05, // Pixen delta-filter + deflate (Smallest)
  ULTRA: 0x06, // Pixen Ultra palette+RLE+deflate (Ultra)
  WEBP: 0x07, // WebP Lossless (Ultimate)
};

// Binary encoding bytes — maps to your binary file dropdown options
const ENC_BINARY = {
  GZIP: 0x10, // Raw bytes → gzip
  BASE64_RAW: 0x11, // Raw bytes → Base64 text → stored as UTF-8 bytes
  BASE85_RAW: 0x12, // Raw bytes → Base85 text → stored as UTF-8 bytes
};

const ENC_BUNDLE = { GZIP: 0x20 };

const FLAG = { ENCRYPTED: 0x01, HAS_THUMB: 0x02 };

// Your existing image MIME types that go through the canvas path
const IMAGE_MIMES = new Set([
  "image/png", "image/jpeg", "image/gif",
  "image/webp", "image/bmp", "image/svg+xml",
]);

// ─────────────────────────────────────────────────────────────────────────────
// CRC-32
// ─────────────────────────────────────────────────────────────────────────────

const _crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf, start = 0, end = buf.length) {
  let crc = 0xFFFFFFFF;
  for (let i = start; i < end; i++) {
    crc = _crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Async wrapper to prevent main thread freezing on very large files
async function crc32Async(buf) {
  const chunkSize = 10 * 1024 * 1024; // 10MB chunks
  if (buf.length <= chunkSize) return crc32(buf);

  return new Promise((resolve) => {
    let crc = 0xFFFFFFFF;
    let i = 0;
    function processChunk() {
      const end = Math.min(i + chunkSize, buf.length);
      for (; i < end; i++) crc = _crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
      if (i < buf.length) setTimeout(processChunk, 0); // Yield to main thread
      else resolve((crc ^ 0xFFFFFFFF) >>> 0);
    }
    processChunk();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Stream helpers
// ─────────────────────────────────────────────────────────────────────────────

async function gzipBytes(uint8) {
  const cs = new CompressionStream("gzip");
  const readPromise = _readStream(cs.readable);
  const writer = cs.writable.getWriter();
  const chunk = 10 * 1024 * 1024;
  for (let i = 0; i < uint8.length; i += chunk) { await writer.write(uint8.subarray(i, i + chunk)); await new Promise(r => setTimeout(r, 0)); }
  await writer.close();
  return await readPromise;
}

async function gunzipBytes(uint8) {
  const ds = new DecompressionStream("gzip");
  const readPromise = _readStream(ds.readable);
  const writer = ds.writable.getWriter();
  const chunk = 10 * 1024 * 1024;
  for (let i = 0; i < uint8.length; i += chunk) { await writer.write(uint8.subarray(i, i + chunk)); await new Promise(r => setTimeout(r, 0)); }
  await writer.close();
  return await readPromise;
}

async function _readStream(readable) {
  const chunks = [];
  const reader = readable.getReader();
  for (; ;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return _concatU8(chunks);
}

function _concatU8(arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Base85 encode / decode
// ─────────────────────────────────────────────────────────────────────────────

function base85Encode(uint8) {
  const out = [];
  const pad = (4 - (uint8.length % 4)) % 4;
  const buf = pad ? _concatU8([uint8, new Uint8Array(pad)]) : uint8;
  for (let i = 0; i < buf.length; i += 4) {
    let v = ((buf[i] << 24) | (buf[i + 1] << 16) | (buf[i + 2] << 8) | buf[i + 3]) >>> 0;
    if (v === 0) { out.push(122); continue; }
    const block = new Uint8Array(5);
    for (let j = 4; j >= 0; j--) { block[j] = (v % 85) + 33; v = Math.floor(v / 85); }
    for (const b of block) out.push(b);
  }
  const result = new Uint8Array(out);
  return result.slice(0, result.length - pad);
}

function base85Decode(uint8) {
  const out = [];
  let i = 0;
  while (i < uint8.length) {
    if (uint8[i] === 122) {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    const block = new Uint8Array(5).fill(84);
    let take = 0;
    while (take < 5 && i < uint8.length) { block[take++] = uint8[i++] - 33; }
    let v = 0;
    for (let j = 0; j < 5; j++) v = v * 85 + block[j];
    v = v >>> 0;
    out.push((v >>> 24) & 0xFF, (v >>> 16) & 0xFF, (v >>> 8) & 0xFF, v & 0xFF);
  }
  return new Uint8Array(out);
}

// ─────────────────────────────────────────────────────────────────────────────
// Header builder / parser
// ─────────────────────────────────────────────────────────────────────────────

function buildHeader({ fileType, encoding, flags = 0, originalSize, filename, mimeType }) {
  const fnBytes = new TextEncoder().encode(filename);
  const mimeBytes = new TextEncoder().encode(mimeType);

  const fixed = new Uint8Array(16);
  const dv = new DataView(fixed.buffer);
  fixed[0] = MAGIC[0]; fixed[1] = MAGIC[1]; fixed[2] = MAGIC[2]; fixed[3] = MAGIC[3];
  fixed[4] = VERSION;
  fixed[5] = fileType;
  fixed[6] = encoding;
  fixed[7] = flags;
  dv.setUint32(8, originalSize, true);
  dv.setUint16(12, fnBytes.length, true);
  dv.setUint16(14, mimeBytes.length, true);

  return _concatU8([fixed, fnBytes, mimeBytes]);
}

function parseHeader(buf) {
  if (buf.length < 20) throw new Error("PXSN v2: file too short to contain a valid header");

  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  if (buf[0] !== MAGIC[0] || buf[1] !== MAGIC[1] ||
    buf[2] !== MAGIC[2] || buf[3] !== MAGIC[3]) {
    throw new Error(
      `PXSN v2: bad magic bytes ` +
      `(got ${[...buf.slice(0, 4)].map(b => b.toString(16).padStart(2, '0')).join(' ')}, expected 50 58 53 56)`
    );
  }

  const version = buf[4];
  if (version !== VERSION) {
    throw new Error(`PXSN v2: unsupported version 0x${version.toString(16).padStart(2, '0')} (this decoder handles 0x02)`);
  }

  const fileType = buf[5];
  const encoding = buf[6];
  const flags = buf[7];
  const originalSize = dv.getUint32(8, true);
  const fnLen = dv.getUint16(12, true);
  const mimeLen = dv.getUint16(14, true);

  const fnStart = 16;
  const mimeStart = fnStart + fnLen;
  const payloadLenOffset = mimeStart + mimeLen;

  if (buf.length < payloadLenOffset + 4) {
    throw new Error("PXSN v2: header is truncated before PayloadLength field");
  }

  const filename = new TextDecoder().decode(buf.slice(fnStart, mimeStart));
  const mimeType = new TextDecoder().decode(buf.slice(mimeStart, payloadLenOffset));
  const payloadLen = dv.getUint32(payloadLenOffset, true);
  const payloadStart = payloadLenOffset + 4;

  return {
    header: { version, fileType, encoding, flags, originalSize, filename, mimeType, payloadLen },
    payloadStart,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ENCODER
// ─────────────────────────────────────────────────────────────────────────────

async function encodeToPXSN(file, opts = {}) {
  const {
    imageEncoding = "pixen",
    binaryEncoding = "gzip",
    encrypt = false,
  } = opts;

  const isImage = IMAGE_MIMES.has(file.type);
  const flags = encrypt ? FLAG.ENCRYPTED : 0;

  let payload, fileType, encodingByte, originalSize;

  if (isImage) {
    fileType = FILE_TYPE.IMAGE;
    ({ payload, encodingByte, originalSize } = await _encodeImage(file, imageEncoding));
  } else {
    fileType = FILE_TYPE.BINARY;
    ({ payload, encodingByte, originalSize } = await _encodeBinary(file, binaryEncoding));
  }

  return await _assemblePXSN({
    fileType, encodingByte, flags, originalSize,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    payload,
  });
}

async function encodeBundleToPXSN(files, opts = {}) {
  const innerFiles = await Promise.all(files.map(f => encodeToPXSN(f, opts)));

  const countBuf = new Uint8Array(4);
  new DataView(countBuf.buffer).setUint32(0, innerFiles.length, true);
  const parts = [countBuf];

  for (const inner of innerFiles) {
    const lenBuf = new Uint8Array(4);
    new DataView(lenBuf.buffer).setUint32(0, inner.length, true);
    parts.push(lenBuf, inner);
  }

  const bundleRaw = _concatU8(parts);
  const originalSize = bundleRaw.length;
  const payload = await gzipBytes(bundleRaw);

  return await _assemblePXSN({
    fileType: FILE_TYPE.BUNDLE,
    encodingByte: ENC_BUNDLE.GZIP,
    flags: 0,
    originalSize,
    filename: "workspace.bundle",
    mimeType: "application/pxsn-bundle",
    payload,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DECODER
// ─────────────────────────────────────────────────────────────────────────────

async function decodeFromPXSN(buf) {
  if (buf.length < 24) {
    throw new Error("PXSN v2: file is too small to be valid (minimum 24 bytes)");
  }

  const storedCRC = new DataView(buf.buffer, buf.byteOffset + buf.length - 4, 4).getUint32(0, true);
  const computedCRC = await crc32Async(buf.subarray(0, buf.length - 4));
  if (storedCRC !== computedCRC) {
    throw new Error(
      `PXSN v2: integrity check failed — file is corrupted or truncated\n` +
      `  stored CRC:   0x${storedCRC.toString(16).padStart(8, '0')}\n` +
      `  computed CRC: 0x${computedCRC.toString(16).padStart(8, '0')}`
    );
  }

  const { header, payloadStart } = parseHeader(buf);
  const payloadEnd = payloadStart + header.payloadLen;

  if (payloadEnd > buf.length - 4) {
    throw new Error(
      `PXSN v2: PayloadLength (${header.payloadLen}) extends beyond file boundary`
    );
  }

  const payloadBuf = buf.slice(payloadStart, payloadEnd);

  if (header.fileType === FILE_TYPE.BUNDLE) {
    return _decodeBundle(payloadBuf);
  }
  const file = await _decodeSingleFile(payloadBuf, header);
  return { files: [file], bundled: false };
}

async function detectAndDecode(file) {
  const first8 = new Uint8Array(await file.slice(0, 8).arrayBuffer());

  if (first8[0] === 0x50 && first8[1] === 0x58 && first8[2] === 0x53 && first8[3] === 0x56) {
    const buf = new Uint8Array(await file.arrayBuffer());
    const result = await decodeFromPXSN(buf);
    return { ...result, format: "pxsn-v2" };
  }



  if (first8[0] === 0x1F && first8[1] === 0x8B) {
    const buf = new Uint8Array(await file.arrayBuffer());
    const text = new TextDecoder().decode(await gunzipBytes(buf));
    return { ..._decodeFromLegacyJSON(text), format: "gzip-json" };
  }

  const text = await file.text();
  const trimmed = text.trimStart();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return { ..._decodeFromLegacyJSON(text), format: "json" };
  }

  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
    const raw = Uint8Array.from(atob(trimmed.replace(/\s/g, "")), c => c.charCodeAt(0));
    const decodedFile = new File([raw], file.name || "decoded", { type: "application/octet-stream" });
    try {
      const result = await detectAndDecode(decodedFile);
      // Optional: append an indicator that it was wrapped in base64
      result.format = result.format ? (result.format + " (from base64)") : "base64-paste";
      return result;
    } catch (e) {
      const blob = new Blob([raw], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      return {
        files: [{ filename: file.name || "decoded", mimeType: "application/octet-stream", data: raw, blob, url }],
        bundled: false,
        format: "base64-paste",
      };
    }
  }

  throw new Error(
    "Unrecognized format.\n" +
    "Expected: PXSN (PXSV magic), GZipped JSON (1F 8B), plain JSON, or pasted Base64."
  );
}

async function _assemblePXSN({ fileType, encodingByte, flags, originalSize, filename, mimeType, payload }) {
  const headerBytes = buildHeader({ fileType, encoding: encodingByte, flags, originalSize, filename, mimeType });
  const payloadLenBuf = new Uint8Array(4);
  new DataView(payloadLenBuf.buffer).setUint32(0, payload.length, true);

  const body = _concatU8([headerBytes, payloadLenBuf, payload]);
  const crcVal = await crc32Async(body);
  const crcBuf = new Uint8Array(4);
  new DataView(crcBuf.buffer).setUint32(0, crcVal, true);

  return _concatU8([body, crcBuf]);
}

async function _encodeBinary(file, mode) {
  const raw = new Uint8Array(await file.arrayBuffer());
  const originalSize = raw.length;
  let payload, encodingByte;

  switch (mode) {
    case "base64": {
      encodingByte = ENC_BINARY.BASE64_RAW;
      let binary = '';
      const chunk = 8192;
      for (let i = 0; i < raw.length; i += chunk) {
        binary += String.fromCharCode.apply(null, raw.subarray(i, i + chunk));
      }
      const b64 = btoa(binary);
      payload = new TextEncoder().encode(b64);
      break;
    }
    case "base85": {
      encodingByte = ENC_BINARY.BASE85_RAW;
      payload = base85Encode(raw);
      break;
    }
    case "gzip":
    default: {
      encodingByte = ENC_BINARY.GZIP;
      payload = await gzipBytes(raw);
      break;
    }
  }

  return { payload, encodingByte, originalSize };
}

async function _decodeBinary(payloadBuf, header) {
  let data;
  switch (header.encoding) {
    case ENC_BINARY.BASE64_RAW: {
      const b64str = new TextDecoder().decode(payloadBuf);
      data = Uint8Array.from(atob(b64str), c => c.charCodeAt(0));
      break;
    }
    case ENC_BINARY.BASE85_RAW: {
      data = base85Decode(payloadBuf);
      data = data.slice(0, header.originalSize);
      break;
    }
    case ENC_BINARY.GZIP:
    default: {
      data = await gunzipBytes(payloadBuf);
      break;
    }
  }

  if (data.length !== header.originalSize) {
    throw new Error(
      `PXSN v2: decoded size mismatch ` +
      `(expected ${header.originalSize} bytes, got ${data.length} bytes)`
    );
  }
  return data;
}

async function _encodeImage(file, mode) {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  const imgData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const rgba = imgData.data;
  const { width, height } = bitmap;
  const originalSize = rgba.length;

  let payload, encodingByte;

  switch (mode) {
    case "hex": {
      encodingByte = ENC_IMAGE.HEX;
      const chars = new Uint8Array(width * height * 6);
      const HEX = "0123456789ABCDEF";
      for (let i = 0, o = 0; i < rgba.length; i += 4, o += 6) {
        chars[o] = HEX.charCodeAt((rgba[i] >> 4) & 0xF);
        chars[o + 1] = HEX.charCodeAt(rgba[i] & 0xF);
        chars[o + 2] = HEX.charCodeAt((rgba[i + 1] >> 4) & 0xF);
        chars[o + 3] = HEX.charCodeAt(rgba[i + 1] & 0xF);
        chars[o + 4] = HEX.charCodeAt((rgba[i + 2] >> 4) & 0xF);
        chars[o + 5] = HEX.charCodeAt(rgba[i + 2] & 0xF);
      }
      payload = await gzipBytes(chars);
      break;
    }
    case "int": {
      encodingByte = ENC_IMAGE.INT;
      const rgb = new Uint8Array(width * height * 3);
      for (let i = 0, o = 0; i < rgba.length; i += 4, o += 3) {
        rgb[o] = rgba[i]; rgb[o + 1] = rgba[i + 1]; rgb[o + 2] = rgba[i + 2];
      }
      payload = await gzipBytes(rgb);
      break;
    }
    case "packed": {
      encodingByte = ENC_IMAGE.PACKED;
      const packed = new Uint8Array(width * height * 3);
      for (let i = 0, o = 0; i < rgba.length; i += 4, o += 3) {
        packed[o] = rgba[i]; packed[o + 1] = rgba[i + 1]; packed[o + 2] = rgba[i + 2];
      }
      payload = await gzipBytes(packed);
      break;
    }
    case "base64": {
      encodingByte = ENC_IMAGE.RGBA_GZIP;
      const rgbaBytes = new Uint8Array(rgba.buffer);
      payload = await gzipBytes(rgbaBytes);
      break;
    }
    case "ultra": {
      encodingByte = ENC_IMAGE.ULTRA;
      payload = await window.pixenUltraEncode(rgba, width, height); // exposed from app.js
      break;
    }
    case "webp": {
      encodingByte = ENC_IMAGE.WEBP;
      const blob = await canvas.convertToBlob({ type: "image/webp", quality: 1.0 });
      payload = new Uint8Array(await blob.arrayBuffer());
      break;
    }
    case "pixen":
    default: {
      encodingByte = ENC_IMAGE.PIXEN;
      payload = await window.pixenEncode(rgba, width, height); // exposed from app.js
      break;
    }
  }

  const dimBuf = new Uint8Array(8);
  const dimDV = new DataView(dimBuf.buffer);
  dimDV.setUint32(0, width, true);
  dimDV.setUint32(4, height, true);
  payload = _concatU8([dimBuf, payload]);

  return { payload, encodingByte, originalSize };
}

async function _decodeImage(payloadBuf, header) {
  const dv = new DataView(payloadBuf.buffer, payloadBuf.byteOffset, payloadBuf.byteLength);
  const width = dv.getUint32(0, true);
  const height = dv.getUint32(4, true);
  const data = payloadBuf.slice(8);

  switch (header.encoding) {
    case ENC_IMAGE.HEX: {
      const chars = await gunzipBytes(data);
      const rgba = new Uint8Array(width * height * 4);
      for (let i = 0, o = 0; i < chars.length; i += 6, o += 4) {
        rgba[o] = parseInt(String.fromCharCode(chars[i], chars[i + 1]), 16);
        rgba[o + 1] = parseInt(String.fromCharCode(chars[i + 2], chars[i + 3]), 16);
        rgba[o + 2] = parseInt(String.fromCharCode(chars[i + 4], chars[i + 5]), 16);
        rgba[o + 3] = 255;
      }
      return _rgbaToPNG(rgba, width, height);
    }
    case ENC_IMAGE.INT:
    case ENC_IMAGE.PACKED: {
      const rgb = await gunzipBytes(data);
      const rgba = new Uint8Array(width * height * 4);
      for (let i = 0, o = 0; i < rgb.length; i += 3, o += 4) {
        rgba[o] = rgb[i]; rgba[o + 1] = rgb[i + 1]; rgba[o + 2] = rgb[i + 2]; rgba[o + 3] = 255;
      }
      return _rgbaToPNG(rgba, width, height);
    }
    case ENC_IMAGE.RGBA_GZIP: {
      const rgbaRaw = await gunzipBytes(data);
      return _rgbaToPNG(new Uint8Array(rgbaRaw.buffer), width, height);
    }
    case ENC_IMAGE.ULTRA: {
      const rgba = await window.pixenUltraDecode(data, width, height);
      return _rgbaToPNG(rgba, width, height);
    }
    case ENC_IMAGE.WEBP: {
      const blob = new Blob([data], { type: "image/webp" });
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      canvas.getContext("2d").drawImage(bitmap, 0, 0);
      const pngBlob = await canvas.convertToBlob({ type: "image/png" });
      return new Uint8Array(await pngBlob.arrayBuffer());
    }
    case ENC_IMAGE.PIXEN:
    default: {
      const rgba = await window.pixenDecode(data, width, height);
      return _rgbaToPNG(rgba, width, height);
    }
  }
}

async function _rgbaToPNG(rgba, width, height) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba.buffer), width, height), 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return new Uint8Array(await blob.arrayBuffer());
}

async function _decodeSingleFile(payloadBuf, header) {
  let data;
  if (header.fileType === FILE_TYPE.IMAGE) {
    data = await _decodeImage(payloadBuf, header);
  } else {
    data = await _decodeBinary(payloadBuf, header);
  }
  const blob = new Blob([data], { type: header.mimeType });
  const url = URL.createObjectURL(blob);
  return { filename: header.filename, mimeType: header.mimeType, data, blob, url };
}

async function _decodeBundle(payloadBuf) {
  const raw = await gunzipBytes(payloadBuf);
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  const count = dv.getUint32(0, true);
  let offset = 4;
  const files = [];

  for (let i = 0; i < count; i++) {
    if (offset + 4 > raw.length) throw new Error(`PXSN v2: bundle entry ${i} length field missing`);
    const len = dv.getUint32(offset, true);
    offset += 4;
    if (offset + len > raw.length) throw new Error(`PXSN v2: bundle entry ${i} data truncated`);
    const innerBuf = raw.slice(offset, offset + len);
    offset += len;
    const { files: inner } = await decodeFromPXSN(innerBuf);
    files.push(...inner);
  }

  return { files, bundled: true };
}


function _decodeFromLegacyJSON(text) {
  const obj = JSON.parse(text);

  if (obj.format === "pixson-bundle-v1" && Array.isArray(obj.files)) {
    const files = obj.files.map(entry => {
      const raw = Uint8Array.from(atob(entry.b64), c => c.charCodeAt(0));
      const blob = new Blob([raw], { type: "application/octet-stream" });
      return { filename: entry.name, mimeType: "application/octet-stream", data: raw, blob, url: URL.createObjectURL(blob) };
    });
    return { files, bundled: true };
  }

  if (obj.format === "pixson-file-v1") {
    const raw = Uint8Array.from(atob(obj.data), c => c.charCodeAt(0));
    const blob = new Blob([raw], { type: obj.mimeType || "application/octet-stream" });
    return { files: [{ filename: obj.filename, mimeType: obj.mimeType, data: raw, blob, url: URL.createObjectURL(blob) }], bundled: false };
  }

  if (obj.format === "pixson-encrypted-v1") {
    return { files: [{ _legacyEncryptedJSON: obj }], bundled: false };
  }

  if (obj.encoding) {
    return { files: [{ _legacyImageJSON: obj }], bundled: false };
  }

  throw new Error("JSON does not match any known Pixson format.");
}

window.PXSN2 = {
  encodeToPXSN,
  encodeBundleToPXSN,
  decodeFromPXSN,
  detectAndDecode,
  buildHeader,
  parseHeader,
  crc32,
  gzipBytes,
  gunzipBytes,
  base85Encode,
  base85Decode,
  FILE_TYPE,
  ENC_IMAGE,
  ENC_BINARY,
  ENC_BUNDLE,
  FLAG,
  VERSION,
  MAGIC,
};
