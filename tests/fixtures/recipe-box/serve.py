"""Serves the recipes folder on a free local port, for a quick look in a browser."""

import functools
import http.server
import threading

LIMIT_SECONDS = 120  # stop after two minutes

handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory="recipes")
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
print(f"serving recipes on http://127.0.0.1:{server.server_address[1]}/", flush=True)
threading.Timer(LIMIT_SECONDS, server.shutdown).start()
server.serve_forever()
