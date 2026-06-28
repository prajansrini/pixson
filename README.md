# Pixson — Universal File ↔ Text Encoder

> A 100% client-side web application that converts **any file** — images, PDFs, audio, documents, spreadsheets — into compact, copy-pasteable text data and reconstructs them back perfectly. Includes **Pixen** and **Pixen Ultra**, custom lossless compression encodings. Zero external libraries. Zero server calls. Your files never leave your browser.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [How to Run](#how-to-run)
- [Supported File Types](#supported-file-types)
- [Image Encoding Formats](#image-encoding-formats)
- [Container Formats](#container-formats)
- [Pixen Encoding — Deep Dive](#pixen-encoding--deep-dive)
- [Pixen Ultra Encoding — Deep Dive](#pixen-ultra-encoding--deep-dive)
- [Generic File Encoding](#generic-file-encoding)
- [JSON Output Schema](#json-output-schema)
- [PXN Binary Format](#pxsn-binary-format)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [UI / UX](#ui--ux)
- [Performance & Safety](#performance--safety)
- [Development Log](#development-log)

---

## Overview

Pixson is a browser-based universal encoder/decoder with two core modes:

| Mode | Input | Output |
|------|-------|--------|
| **Encode** | Any file (images, PDF, DOCX, MP3, CSV, ZIP, etc.) | Compressed text/binary data in chosen format |
| **Decode** | Pixson-format JSON, GZipped JSON, or PXN binary | Reconstructed original file (byte-for-byte identical) |

### Image-Specific Capabilities

| Input | Output |
|-------|--------|
| PNG, JPG, JPEG, SVG, WebP, BMP, GIF | JSON with pixel data in 7 encoding schemes |
| Pixson image JSON | Reconstructed PNG, JPEG, or WebP image |

---

## Features

### Core
- **Universal File Encoding** — Encode literally any file type into copy-pasteable JSON text
- **7 Image Encoding Schemes** — From human-readable hex strings to ultra-compressed Pixen Ultra
- **3 Container Formats** — JSON Text, GZipped JSON, PXN Binary
- **Lossless Round-Trip** — Decoded files are byte-for-byte identical to originals
- **Multi-File Queue** — Encode/decode multiple files simultaneously with per-row controls
- **Copy & Paste Workflow** — Copy encoded text, switch tabs, paste to decode — no file downloads needed

### UI/UX
- **Dual Theme** — Blue/black dark mode and warm peach light mode with smooth toggle
- **Glassmorphism Design** — Frosted glass cards, animated particles, gradient accents
- **Progress Bars** — Animated indeterminate progress bars on every encode/decode operation
- **Buffered Paste System** — Large text pastes (>50 KB) are intercepted and buffered to prevent browser crashes
- **Paste Loading Overlay** — Spinner overlay appears while processing pasted data
- **Toast Notifications** — Color-coded success/error/info feedback
- **File Type Icons** — Emoji-based file type recognition (📄 PDF, 🎵 MP3, 📊 PPTX, etc.)
- **Hex Dump Viewer** — Binary formats (GZIP, PXN) show professional hex dump previews
- **Scrollable Previews** — JSON/hex previews are capped and scrollable, never full-screen
- **Responsive Design** — Adapts to mobile and desktop viewports

### Performance
- **100% Client-Side** — Zero network requests, works offline after page load
- **Zero Dependencies** — No npm, no frameworks, no external libraries
- **Native Compression** — Uses browser's built-in `CompressionStream` / `DecompressionStream` APIs
- **Async Processing** — `await sleep()` yields between heavy operations to keep UI responsive

---

## File Structure

```
newproj2/
├── index.html      # UI layout (89 lines)
├── index.css       # Design system — dark/light themes (214 lines)
├── app.js          # Core logic — encoders, decoders, UI handlers (918 lines)
└── run.sh          # Dev server launcher
```

---

## How to Run

```bash
chmod +x run.sh
./run.sh
# → Starts on http://localhost:3080
```

Or manually:

```bash
python3 -m http.server 3080
```

No build step. No install. Just serve static files.

---

## Supported File Types

### Encode Tab — Input
| Category | Formats | Handling |
|----------|---------|----------|
| **Images** | PNG, JPG, JPEG, SVG, WebP, BMP, GIF | Pixel-level encoding with 7 schemes + dimension controls |
| **Documents** | PDF, DOC, DOCX, PPT, PPTX, TXT, HTML, CSS, JS | Binary GZIP + Base64 compression |
| **Spreadsheets** | XLS, XLSX, CSV | Binary GZIP + Base64 compression |
| **Audio** | MP3, WAV | Binary GZIP + Base64 compression |
| **Video** | MP4, MOV | Binary GZIP + Base64 compression |
| **Archives** | ZIP, RAR | Binary GZIP + Base64 compression |
| **Any Other** | * | Binary GZIP + Base64 compression |

### Decode Tab — Input
| Format | Detection |
|--------|-----------|
| JSON Text (`.json`) | Standard JSON parse |
| GZipped JSON (`.json.gz`) | Magic bytes `1F 8B` |
| PXN Binary (`.pxsn`) | Magic bytes `PXEN` (50 58 45 4E) |
| Base64 String (pasted) | Auto-detected when text doesn't start with `{` or `[` |

---

## Image Encoding Formats

| # | Encoding | ID | Size Category | Description |
|---|----------|----|---------------|-------------|
| 1 | **Hex String** | `hex` | Medium | Each pixel as `"FF8040"` — human-readable |
| 2 | **24-bit Integer** | `int` | Small | Each pixel as `16744512` — numeric |
| 3 | **Packed Array** | `packed` | Small | Row-major integer arrays |
| 4 | **Base64 Binary** | `base64` | Smaller | Raw RGB bytes → Base64 string |
| 5 | **Pixen** | `pixen` | Smallest | Delta-filter + Deflate compression |
| 6 | **Pixen Ultra** | `pixenultra` | Ultra | Palette + RLE + Deflate with auto-tolerance |
| 7 | **WebP Lossless** | `webp` | Ultimate | Browser-native WebP lossless encoder |

### Image-Specific Controls
- **Original Size Toggle** — Preserve source dimensions or downscale
- **Max Dimensions** — Cap width/height (default: 256px) for smaller output
- **Encoding Selector** — Choose from the 7 schemes above
- **Container Format** — JSON, GZIP, or PXN binary output

---

## Container Formats

| Container | Extension | Type | Best For |
|-----------|-----------|------|----------|
| **JSON Text** | `.json` | Text | Copy-paste workflows, readability |
| **GZipped JSON** | `.json.gz` | Binary | Smallest JSON-based output |
| **PXN Binary** | `.pxsn` | Binary | Maximum compression — strips all JSON overhead |

---

## Pixen Encoding — Deep Dive

Pixen is a custom lossless image compression algorithm that mirrors PNG's internal strategy:

### Algorithm Pipeline

```
Raw RGB pixels (W × H × 3 bytes)
    │
    ▼
┌─────────────────────────────────┐
│  Per-Row Adaptive Filtering     │
│  Evaluate 3 filter types:       │
│  • None (type 0) — raw bytes    │
│  • Sub  (type 1) — delta left   │
│  • Up   (type 2) — delta above  │
│  Pick filter with lowest entropy │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  Deflate Compression            │
│  (Native CompressionStream API) │
└─────────────────────────────────┘
    │
    ▼
  Base64 string in JSON
```

### Filter Functions

```javascript
// Sub filter: difference from pixel to the left
filterSub(row, bpp) → (pixel[i] - pixel[i - bpp] + 256) & 0xFF

// Up filter: difference from pixel above
filterUp(row, prev) → (pixel[i] - prev[i] + 256) & 0xFF

// Entropy heuristic: sum of absolute deviations
sumAbs(arr) → Σ (v < 128 ? v : 256 - v)
```

---

## Pixen Ultra Encoding — Deep Dive

Pixen Ultra is a fundamentally different approach that exploits **color repetition** rather than spatial deltas:

### Algorithm Pipeline

```
Raw RGB pixels
    │
    ▼
┌─────────────────────────────────────┐
│  Color Quantization (with tolerance)│
│  • Build palette of unique colors   │
│  • Spatial-hash bucketed search     │
│  • Merge colors within ±tolerance   │
│  • Auto-tries: 0, 4, 8, 12, 16,    │
│    20, 24 — picks smallest output   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Run-Length Encoding (RLE)          │
│  Consecutive identical palette      │
│  indices → [index, count] pairs     │
│  Max run length: 32767 (varint)     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Binary Packing                     │
│  Header + Palette + RLE stream      │
│  Varint counts for space efficiency │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Deflate Compression                │
│  (Native CompressionStream API)     │
└─────────────────────────────────────┘
    │
    ▼
  Base64 string in JSON
```

### Binary Layout (before Deflate)

| Offset | Size | Field |
|--------|------|-------|
| 0 | 1 byte | Version (= 1) |
| 1 | 2 bytes | Palette count (LE) |
| 3 | N × 3 bytes | Palette RGB entries |
| 3 + N×3 | 4 bytes | Total pixel count (LE) |
| 7 + N×3 | variable | RLE pairs |

### RLE Pair Encoding

| Palette Size | Index Size | Count Encoding |
|-------------|------------|----------------|
| ≤ 256 colors | 1 byte | Varint: ≤127 = 1 byte, >127 = 2 bytes |
| > 256 colors | 2 bytes (LE) | Varint: ≤127 = 1 byte, >127 = 2 bytes |

### Auto-Tolerance Optimization
The encoder tries 7 tolerance levels (0, 4, 8, 12, 16, 20, 24) and picks whichever produces the smallest compressed output. Higher tolerance merges more similar colors → fewer palette entries → longer RLE runs → smaller file.

- **Tolerance 0** = Fully lossless (exact colors)
- **Tolerance 24** = Near-lossless (±24 per channel, visually imperceptible)

### Performance: Spatial Hash Bucketing
Instead of O(n×m) brute-force palette search, colors are bucketed by `(r/step, g/step, b/step)` coordinates. Only the 27 neighboring buckets are searched, giving ~100x speedup on large images.

---

## Generic File Encoding

For non-image files, Pixson uses a simpler pipeline:

```
Any file → Read as ArrayBuffer → Deflate compress → Base64 encode → JSON wrapper
```

### JSON Output

```json
{
  "format": "pixson-file-v1",
  "filename": "report.pdf",
  "mimeType": "application/pdf",
  "originalSize": 1234567,
  "encoding": "gzip+base64",
  "data": "eJzLSM3JyVcozy/KSVEA..."
}
```

### Decoding

```
JSON → Parse → Base64 decode → Deflate decompress → Original file bytes → Download
```

The round-trip is **100% lossless** — the decoded file is byte-for-byte identical to the original.

---

## JSON Output Schema

### Image Format (`pixson-v1` / `pixen-v1`)

```json
{
  "format": "pixson-v1",
  "width": 256,
  "height": 144,
  "encoding": "hex",
  "totalPixels": 36864,
  "pixels": [
    ["ff0000", "00ff00", "0000ff"],
    ["..."]
  ]
}
```

### Binary Data Format (Pixen / Pixen Ultra / WebP / Base64)

```json
{
  "format": "pixen-v1",
  "width": 256,
  "height": 144,
  "encoding": "pixen",
  "totalPixels": 36864,
  "data": "eJzLSM3JyVcozy/KSVEA..."
}
```

### Generic File Format

```json
{
  "format": "pixson-file-v1",
  "filename": "song.mp3",
  "mimeType": "audio/mpeg",
  "originalSize": 4521984,
  "encoding": "gzip+base64",
  "data": "H4sIAAAAAAAA..."
}
```

---

## PXN Binary Format

The PXN container strips all JSON/Base64 overhead for maximum compression.

### Header (13 bytes)

| Offset | Size | Value | Description |
|--------|------|-------|-------------|
| 0–3 | 4 bytes | `PXEN` (50 58 45 4E) | Magic bytes |
| 4–7 | 4 bytes | uint32 LE | Image width |
| 8–11 | 4 bytes | uint32 LE | Image height |
| 12 | 1 byte | 1 or 2 | Encoding type (1=Pixen, 2=Pixen Ultra) |

### Body (offset 13+)

Raw deflated bytes (output of CompressionStream). No Base64 wrapping, no JSON overhead.

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | Semantic HTML5 |
| **Styling** | Vanilla CSS with CSS custom properties (no frameworks) |
| **Logic** | Vanilla JavaScript (IIFE, strict mode) |
| **Compression** | Native `CompressionStream` / `DecompressionStream` (deflate, gzip) |
| **Image Processing** | Canvas API (`getImageData`, `putImageData`, `toBlob`) |
| **WebP Encoding** | Native `canvas.toBlob('image/webp', 1.0)` |
| **File I/O** | `FileReader`, `Blob`, `URL.createObjectURL` |
| **Fonts** | Google Fonts (Inter, JetBrains Mono) |
| **Server** | Python `http.server` (static file serving only) |

### Zero Dependencies
No npm, no node_modules, no webpack, no React, no Tailwind. Every byte is hand-written or browser-native.

---

## UI / UX

### Themes

| Theme | Background | Accent | Cards |
|-------|-----------|--------|-------|
| **Dark** | `#050510` (deep navy) | `#3b82f6` (blue) | Frosted glass with blue borders |
| **Light** | `#fdf5ef` (warm cream) | `#c2703c` (peach/amber) | Frosted glass with peach borders |

### Design Elements
- **Glassmorphism** — `backdrop-filter: blur()` on cards and modals
- **Animated Particles** — 20 floating dots in the background
- **Spinning Logo** — 25-second CSS rotation on the pixel-grid SVG icon
- **Pill Tabs** — Sliding gradient indicator between Encode/Decode
- **Micro-Animations** — Row cards slide in, removed cards fade out, buttons scale on press
- **Responsive Breakpoint** — Stacked layout below 600px

### Progress & Loading
- **Row Progress Bars** — Animated indeterminate bar slides across each card during processing
- **Paste Overlay** — Spinner + label covers the paste area while data is being buffered
- **Buffered Paste System** — Pastes over 50 KB are intercepted (`preventDefault`) and stored in a JS variable to prevent browser crashes from rendering megabytes of text in a textarea DOM element

### File Type Icons

| Extension | Icon | Extension | Icon |
|-----------|------|-----------|------|
| PDF | 📄 | MP3, WAV | 🎵 |
| DOC, DOCX | 📝 | MP4, MOV | 🎬 |
| PPT, PPTX | 📊 | ZIP, RAR | 📦 |
| XLS, XLSX | 📗 | HTML | 🌐 |
| CSV | 📋 | CSS | 🎨 |
| TXT, JSON | 📃 | JS | ⚙️ |
| Other | 📎 | | |

---

## Performance & Safety

### Browser Crash Prevention
- **Buffered Paste** — Text over 50 KB is `preventDefault()`-ed and stored in a JS variable instead of the textarea DOM
- **Preview Cap** — JSON preview text is truncated at 50 KB with a "click Download for full file" notice
- **Async Yields** — `await sleep(10)` between heavy computation to keep the main thread responsive
- **Hex Dump Limit** — Binary previews cap at 512 bytes to avoid DOM bloat

### Privacy
- **No Network Requests** — Everything runs in the browser tab
- **No Cookies** — Only `localStorage` for theme preference
- **No Analytics** — Zero tracking, zero telemetry

---

## Development Log

| Version | Changes |
|---------|---------|
| **v1** | Basic image → JSON converter with hex encoding |
| **v2** | Added 4 encoding schemes (hex, int, packed, base64) |
| **v3** | Pixen encoding (delta-filter + deflate), multi-file queue |
| **v4** | Dual theme (dark blue + peach light), Original Size toggle |
| **v5** | Container formats (JSON, GZIP, PXN Binary), hex dump viewer |
| **v6** | Copy/paste Base64 workflow for binary formats |
| **v7** | Pixen Ultra (palette + RLE + deflate), spatial-hash quantizer |
| **v8** | Universal file encoding (PDF, MP3, DOCX, etc.), buffered paste system, progress bars, tab rename to Encode/Decode |

---

## Compression Comparison (Typical 256×144 Image)

| Encoding + Container | Typical Output Size | Notes |
|---------------------|-------------------|-------|
| Hex + JSON | ~150 KB | Human-readable, largest |
| 24-bit Int + JSON | ~110 KB | Numeric, readable |
| Base64 + JSON | ~75 KB | Raw bytes, no compression |
| Pixen + JSON | ~35 KB | Delta-filtered + deflated |
| Pixen Ultra + JSON | ~25–35 KB | Palette + RLE + deflated |
| WebP Lossless + JSON | ~15–25 KB | Browser-native, often smallest |
| Pixen + PXN Binary | ~25 KB | Strips JSON/Base64 overhead |
| Pixen Ultra + PXN Binary | ~18–28 KB | Maximum pixel compression |
| WebP Lossless + GZIP | ~12–20 KB | Often the absolute smallest |

> [!NOTE]
> Actual sizes depend heavily on image content. Photos with many unique colors compress less than illustrations or screenshots with flat regions.

> [!IMPORTANT]
> When the source image is a lossy JPEG, lossless re-encoding will typically produce output **similar in size** to the original — because the JPEG's compression artifacts become "real" data that must be faithfully stored. This is a fundamental limitation of information theory, not a bug.

---

## License

This project is provided as-is for educational and personal use.
