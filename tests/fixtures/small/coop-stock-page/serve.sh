#!/bin/sh
# Serve the shop page on http://localhost:8077 until stopped with Ctrl-C.
cd "$(dirname "$0")" && exec python3 -m http.server 8077 --directory site
