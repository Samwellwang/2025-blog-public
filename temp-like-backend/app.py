"""
爱心计数后端：GET 查询计数，POST 增加计数（按 IP + slug 每日限流）。
与前端 like-button 对接：GET/POST /api/like?slug=xxx
"""
import os
import sqlite3
from datetime import date
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# 使用 Flask-CORS 统一处理所有请求的 CORS，避免 GET 被代理缓存后无头
CORS(app, origins="*", allow_headers=["Content-Type"], methods=["GET", "POST", "OPTIONS"])

# 数据库文件路径（与脚本同目录）
DB_PATH = Path(__file__).resolve().parent / "like.db"


def get_db():
	conn = sqlite3.connect(DB_PATH)
	conn.row_factory = sqlite3.Row
	return conn


def init_db():
	with get_db() as conn:
		conn.execute("""
			CREATE TABLE IF NOT EXISTS counts (
				slug TEXT PRIMARY KEY,
				count INTEGER NOT NULL DEFAULT 0
			)
		""")
		conn.execute("""
			CREATE TABLE IF NOT EXISTS rate_limits (
				ip TEXT NOT NULL,
				slug TEXT NOT NULL,
				day TEXT NOT NULL,
				PRIMARY KEY (ip, slug, day)
			)
		""")
		conn.commit()


@app.route("/api/like", methods=["GET", "POST"])
def api_like():
	slug = request.args.get("slug", "").strip()
	if not slug:
		return jsonify({"error": "missing slug"}), 400

	with get_db() as conn:
		if request.method == "GET":
			row = conn.execute(
				"SELECT count FROM counts WHERE slug = ?", (slug,)
			).fetchone()
			count = row["count"] if row else 0
			response = jsonify({"count": count})
			response.headers["Access-Control-Allow-Origin"] = "*"
			response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
			response.headers["Access-Control-Allow-Headers"] = "Content-Type"
			response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
			# 调试：若 Network 里 GET 响应没有此头，说明 GET 被代理/缓存拦截，未到 Flask
			response.headers["X-Served-By"] = "flask"
			return response

		# POST: 增加计数，同一 IP 同一 slug 每天仅允许一次
		ip = request.headers.get("X-Forwarded-For", request.remote_addr or "")
		if ip and "," in ip:
			ip = ip.split(",")[0].strip()
		day = date.today().isoformat()

		cur = conn.execute(
			"SELECT 1 FROM rate_limits WHERE ip = ? AND slug = ? AND day = ?",
			(ip, slug, day),
		)
		if cur.fetchone():
			return jsonify({"reason": "rate_limited"})

		cur = conn.execute("UPDATE counts SET count = count + 1 WHERE slug = ?", (slug,))
		if cur.rowcount == 0:
			conn.execute("INSERT INTO counts (slug, count) VALUES (?, 1)", (slug,))
		conn.execute(
			"INSERT INTO rate_limits (ip, slug, day) VALUES (?, ?, ?)",
			(ip, slug, day),
		)
		conn.commit()

		row = conn.execute("SELECT count FROM counts WHERE slug = ?", (slug,)).fetchone()
		count = row["count"] if row else 1
		return jsonify({"count": count})


@app.route("/api/like", methods=["OPTIONS"])
def api_like_options():
	return "", 204


if __name__ == "__main__":
	init_db()
	port = int(os.environ.get("PORT", 5000))
	app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
