#!/bin/bash
echo "🔥 Starting PixelForge on http://localhost:3080"
python3 -m http.server 3080 --directory "$(dirname "$0")"
