# Pixson — Universal File ↔ Text Encoder

![License](https://img.shields.io/badge/license-MIT-blue)
![Zero Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)
![Client Side Only](https://img.shields.io/badge/backend-none-lightgrey)

> A 100% client-side web application that converts **any file** — images, PDFs, audio, documents, spreadsheets — into compact, copy-pasteable text data and reconstructs them back perfectly. Features custom lossless image compression encodings, selective bulk bundling, AES-GCM encryption, QR Code generation, and IndexedDB session auto-saving. Zero external libraries. Zero server calls. Your files never leave your browser.

![Pixson Demo](demo.gif)

---

## Features

### Core
- **Universal File Encoding** — Encode literally any file type into copy-pasteable text or binary blocks.
- **7 Image Encoding Schemes** — Ranging from human-readable hex strings to ultra-compressed Pixen Ultra.
- **Selective Bundling** — Checkbox-driven selection to merge multiple files into a single `.bundle.pxsn` or encrypted archive.
- **Persistent Sessions** — IndexedDB automatically saves your queue; refresh without losing your files.
- **AES-GCM Encryption** — Military-grade password protection applied directly via Web Crypto API.
- **QR Code Generation** — Instantly generate QR codes for encoded files directly in the browser.
- **Lossless Round-Trip** — Decoded files are byte-for-byte identical to the original inputs.

### UI/UX
- **Dual Theme** — Dark mode (Blue/Black) and Light mode (Peach) with dynamic glassmorphism and animated scrolling.
- **Keyboard Navigation** — Full support for `Escape` key to fluidly close active modals and prompts.
- **Smart Bulk Logic** — "Select All" actions automatically detect mismatched states, auto-compile them, and preserve state memory across different batch actions (e.g., Download vs. Bundle).
- **Interactive Physics** — Dynamic UI features including a physics-based, draggable spinning logo.
- **File Type Icons** — Emoji-based file type recognition (📄 PDF, 🎵 MP3, 📊 PPTX, etc.).

---

## Table of Contents

- [Features](#features)
- [How to Run](#how-to-run)
- [Supported File Types](#supported-file-types)
- [Image Encoding Algorithms](#image-encoding-algorithms)
- [Generic File Encoding Pipeline](#generic-file-encoding-pipeline)
- [Container Formats & The PXSN Standard](#container-formats--the-pxsn-standard)
  - [PXSN Binary Deep Dive](#pxsn-binary-deep-dive)
  - [Pixson Bundles](#pixson-bundles)
- [Security: Encryption Architecture](#security-encryption-architecture)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [UI / UX Innovations](#ui--ux-innovations)
- [Development Log](#development-log)

---



## How to Run

```bash
chmod +x run.sh
./run.sh
# → Starts on http://localhost:3080
```

Or manually: `python3 -m http.server 3080`

> **Note:** Because Pixson uses modern browser APIs like `CompressionStream`, `IndexedDB`, and `OffscreenCanvas`, you must run it through a local server. Opening `index.html` directly via the file system (`file://`) will result in CORS and security context errors.
> 
> **Browser Support:** A modern Chromium-based browser (Chrome, Edge, Brave) is highly recommended for full feature support (specifically `OffscreenCanvas` and `CompressionStream`).

No build step. No install. Just serve static files.

---

## Project Structure

```text
pixson/
├── index.html       # Main UI and layout
├── index.css        # Vanilla CSS styling and animations
├── app.js           # Core logic, UI events, memory state, and QR library
├── pxsn-v2.js       # Encoding algorithms, compression, and PXSN format handler
└── run.sh           # Local Python web server script
```

---

## Supported File Types

### Encode Tab — Input
| Category | Handling |
|----------|----------|
| **Images** (PNG, JPG, SVG, WebP) | Pixel-level encoding (Canvas extraction) with 7 specific schemes |
| **Documents, Audio, Video, Archives** | Binary payload extraction → CompressionStream → Base64 serialization |

### Decode Tab — Input
| Format | Detection |
|--------|-----------|
| PXSN Binary (`.pxsn`) | Magic bytes `PXSV` (50 58 53 56) |
| GZipped JSON (`.json.gz`) | Magic bytes `1F 8B`, decompressed and parsed |
| Plain JSON (`.json`) | Auto-detected when content starts with `{` or `[` |
| Pasted Base64 | Auto-detected and recursively decoded into its underlying format |

---

## Image Encoding Algorithms

When an image is passed to Pixson, it is drawn to an offscreen Canvas, and its raw RGBA byte arrays (`getImageData`) are extracted. Pixson offers 7 algorithms to serialize this data:

### 1. Hex String (`hex`)
Each pixel is mapped to a 6-character hex string (e.g. `"FF8040"`). Output is a 2D array of strings. Highly readable, zero compression.

### 2. 24-bit Integer (`int`)
Pixels are converted to a single integer: `(r << 16) | (g << 8) | b`. Smaller than hex strings.

### 3. Packed Array (`packed`)
Instead of a 2D array of strings, all pixels are flattened into a 1D row-major array of integers.

### 4. Base64 Binary (`base64`)
Raw RGB byte array is directly converted to a Base64 string. 

### 5. Pixen (Delta-Filter + Deflate)
Inspired by the PNG specification. 
1. **Filtering**: Each row is evaluated against 3 filters:
   - *None*: Raw pixel byte.
   - *Sub*: Difference between current byte and the byte 1 pixel to the left.
   - *Up*: Difference between current byte and the byte exactly above it.
2. **Entropy Selection**: The algorithm calculates the absolute sum of deviations for all 3 filters and selects the one with the lowest entropy (closest to 0).
3. **Deflate**: The filtered byte array is passed through the native `CompressionStream('deflate')`.

### 6. Pixen Ultra (Palette + RLE + Deflate)
Exploits color repetition instead of spatial deltas.
1. **Color Quantization (Auto-Tolerance)**: Builds a palette of unique colors using a spatial-hash bucketed search. It attempts 7 tolerance levels (0, 4, 8, 12, 16, 20, 24) and merges similar colors.
2. **Run-Length Encoding (RLE)**: Consecutive identical palette indices are converted to `[index, count]` pairs. Counts use Variable-Length Integers (Varints) to save bytes.
3. **Deflate**: The Header + Palette + RLE Stream is deflated. The tolerance producing the smallest compressed block is selected.

### 7. WebP Lossless (`webp`)
Bypasses custom algorithms and asks the browser to generate a native `image/webp` blob losslessly, which is then serialized.

---

## Generic File Encoding Pipeline

For non-image files (PDFs, ZIPs, MP3s), Pixson extracts the raw binary payload
and lets you choose both an encoding scheme and a container format independently.

**Step 1 — Extraction**: `FileReader.readAsArrayBuffer()` loads the raw bytes into a `Uint8Array`.

**Step 2 — Encoding** (user choice):
| Scheme | How it works | Size |
|--------|-------------|------|
| **GZip** (default) | Raw bytes pushed through `CompressionStream('gzip')`, stored directly — no text encoding layer | Smallest |
| **Base64** | Raw bytes converted to Base64 text, stored as UTF-8 | ~33% larger than raw |
| **Base85** | Raw bytes converted to Base85 text, stored as UTF-8 | ~25% smaller than Base64 |

**Step 3 — Container** (user choice): The encoded payload is wrapped in either
JSON Text, GZipped JSON, or the PXSN binary container along with the filename,
original size, and MIME type needed for reconstruction.

---

## Container Formats & The PXSN Standard

The JSON encoding wrapper is robust, but the `{ "data": "base64..." }` overhead wastes space. Pixson offers three export containers:

1. **JSON Text (`.json`)**: Raw text file. Best for direct copy-pasting.
2. **GZipped JSON (`.json.gz`)**: The JSON string compressed.
3. **PXN Binary (`.pxsn`)**: A custom, hyper-compact binary container that abandons Base64 entirely.

### PXSN Binary Deep Dive

The `.pxsn` file extension stands for Pixson Archive. It is a strictly structured binary format designed to eliminate the ~33% bloat caused by Base64 encoding.

**Structure of a PXSN File:**
| Offset (Bytes) | Size | Data Type | Description |
|----------------|------|-----------|-------------|
| `0` | 4 | `ASCII` | Magic Header: `PXSV` (50 58 53 56) |
| `4` | 1 | `Uint8` | Version Flag (`0x02`) |
| `5` | 1 | `Uint8` | File Type (0=Generic, 1=Image, 2=Bundle) |
| `6` | 1 | `Uint8` | Encoding Strategy (Pixen, GZip, etc.) |
| `7` | 1 | `Uint8` | Bit Flags (e.g., Encrypted) |
| `8` | 4 | `Uint32 LE` | Original Uncompressed Size |
| `12` | 2 | `Uint16 LE` | Filename Length (N) |
| `14` | 2 | `Uint16 LE` | MIME Type Length (M) |
| `16` | N | `UTF-8` | Filename String |
| `16+N` | M | `UTF-8` | MIME Type String |
| `16+N+M` | Var | `Binary` | Compressed Payload Bitstream |
| `EOF-4` | 4 | `Uint32 LE` | CRC-32 Data Integrity Checksum |

*Why this matters:* By omitting Base64, a 30KB Pixen string drops to roughly ~22KB in `.pxsn` format, making it the most mathematically optimal container.

### Pixson Bundles
When using the **"Bundle into 1 File"** feature, Pixson creates a compact multi-file archive.

1. Each selected file is individually encoded as a complete, self-contained PXSN file with its own CRC-32 integrity checksum.
2. These files are packed using a binary framing structure: a 4-byte file count followed by length-prefixed PXSN blocks.
3. The entire frame is gzip-compressed and stored as `workspace.bundle.pxsn`.

When dropped into the Decode tab, Pixson reads the PXSV magic header, decompresses the bundle, and reconstructs every inner file simultaneously — each verified independently by its own CRC-32.

---

## Security: Encryption Architecture

Pixson integrates AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) via the Web Crypto API (`window.crypto.subtle`) for military-grade file protection.

**Encryption Flow (`encryptData`):**
1. **Key Derivation**: Takes the user's password and generates a 16-byte random Salt. Uses PBKDF2 (100,000 iterations, SHA-256) to derive a 256-bit AES key.
2. **Encryption**: Generates a 12-byte random Initialization Vector (IV). Encrypts the raw data payload using `AES-GCM`.
3. **Packaging**: Exports a JSON object containing the `salt`, `iv`, and encrypted `data` (all Base64-encoded).

**Decryption Flow (`decryptData`):**
1. Extracts the `salt` and `iv` from the JSON block.
2. Runs PBKDF2 on the user-provided password using the extracted salt to regenerate the exact 256-bit AES key.
3. Decrypts the payload using the key and the original IV. If the password is wrong, the Web Crypto API throws an auth tag verification error, and Pixson rejects the file.

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | Semantic HTML5 |
| **Styling** | Vanilla CSS (CSS custom properties, flexbox, grid, transforms) |
| **Logic** | Vanilla JavaScript (ES6+, async/await, IIFE) |
| **Compression** | `CompressionStream` / `DecompressionStream` APIs |
| **Cryptography** | `window.crypto.subtle` (AES-GCM, PBKDF2) |
| **Database** | IndexedDB (Asynchronous workspace persistence) |

### Zero Dependencies
No npm, no webpack, no React. Every byte is hand-written or relies exclusively on modern browser-native APIs (even QR Code generation is bundled in a single file!).

---

## UI / UX Innovations

- **IndexedDB Auto-Save**: Files dropped into the queue are immediately serialized into an IndexedDB database. Refreshing or accidentally closing the tab will reload the exact state of your workspace instantly.
- **Buffered Paste Interception**: Pasting megabytes of Base64 into a browser `<textarea>` will crash the rendering engine. Pixson intercepts the `paste` event, calls `e.preventDefault()`, and buffers the text payload directly into JavaScript memory.
- **Smart Selection Binding**: The Bulk Action bar tracks DOM checkbox states (`.js-row-sel`) and dynamically updates button availability.
- **Auto-Compile Verification**: Clicking "Bundle" or "Download All" triggers an asynchronous state verification loop (`autoCompileBulk`). If a row's current configuration (e.g., changed from Base64 to Pixen Ultra) doesn't match its cached compiled blob, the app automatically re-encodes the specific row before executing the bulk action.

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
| **v8** | Universal file encoding (PDF, MP3, DOCX), buffered paste system |
| **v9** | **Major Refactor**: IndexedDB Auto-Save, Selective Bundling UI, AES-GCM Encryption logic, Auto-compile state-verification for bulk actions, removal of Steganography module for architectural purity. |
| **v10**| Zero-dependency architecture integration, integrated QR code generator, enhanced modal Escape-key listeners, physics-based rotation interactions, independent batch workflow memory persistence, and strict UI safety guards for destructive actions. |

### Roadmap
- **Planned**: Direct text-to-file decompression for streaming text directly into `Blob` handles.
- **Planned**: Integration of the upcoming PXSN v3 container format for advanced metadata.
- **Planned**: Extended testing across non-Chromium browsers (Firefox/Safari).

---

## License

This project is licensed under the MIT License.
