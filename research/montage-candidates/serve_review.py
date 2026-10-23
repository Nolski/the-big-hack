#!/usr/bin/env python3
"""Serve the review page and save thumbs-up/down picks to picks.json.

    python3 serve_review.py            # http://127.0.0.1:8077/review.html
    python3 serve_review.py --port 8078

Same as python3 -m http.server, plus POST /picks.json writes the body to picks.json.
Standard library only; binds to localhost.
"""
import argparse
import http.server
import json
import os
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def do_POST(self):
        if self.path != "/picks.json":
            self.send_error(404)
            return
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        try:
            data = json.loads(body)
            assert isinstance(data.get("picks"), dict)
        except (ValueError, AssertionError):
            self.send_error(400, "expected {\"picks\": {...}}")
            return
        fd, tmp = tempfile.mkstemp(dir=HERE, prefix=".picks-", suffix=".json")
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=1, ensure_ascii=False)
        os.replace(tmp, os.path.join(HERE, "picks.json"))
        self.send_response(204)
        self.end_headers()

    def end_headers(self):
        if self.path.endswith("picks.json"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if self.command == "POST":
            super().log_message(fmt, *args)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8077)
    args = ap.parse_args()
    with http.server.ThreadingHTTPServer(("127.0.0.1", args.port), Handler) as srv:
        print(f"http://127.0.0.1:{args.port}/review.html  (Ctrl+C stops)")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
