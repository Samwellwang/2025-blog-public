# 爱心计数后端（临时目录，可拷贝部署）

与博客首页「心心」按钮对接：基于 Python Flask + SQLite，提供 GET/POST `/api/like?slug=xxx`。

## 接口

- **GET** `/api/like?slug=xxx`  
  返回 `{ "count": number }`，当前该 slug 的点赞数。

- **POST** `/api/like?slug=xxx`  
  对该 slug 点赞 +1。  
  - 成功：返回 `{ "count": number }`（新总数）。  
  - 同一 IP、同一 slug、同一天已点过：返回 `{ "reason": "rate_limited" }`（前端会提示「今天已经不能再点赞啦」）。

## 本地运行

```bash
cd temp-like-backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

默认监听 `http://0.0.0.0:5000`。可用环境变量：

- `PORT`：端口，默认 5000
- `FLASK_DEBUG=1`：开启调试
- 数据库文件：当前目录下的 `like.db`（首次请求时自动创建表）

## 生产部署示例

- **Gunicorn**（推荐）：  
  `pip install gunicorn`  
  `gunicorn -w 1 -b 0.0.0.0:5000 app:app`

- **云函数 / 容器**：把本目录整体拷贝，安装依赖后启动 `app:app`，并设置好 `PORT`。若前面有反向代理，需把真实 IP 传到 `X-Forwarded-For`，限流才按访客 IP 生效。

## 前端与代理（推荐）

博客项目已改为**同源请求** `/api/like`，由 Next.js 的 `app/api/like/route.ts` **代理到 Flask**，浏览器不再直连 Flask，从而避免跨域和 GET 被缓存的问题。

- 前端 `like-button.tsx` 的 `ENDPOINT` 已设为 `/api/like`，无需再改。
- 代理转发到 Flask 的地址由环境变量指定：在博客项目根目录的 `.env.local` 里配置（可选）：
  - `LIKE_API_BACKEND=http://api.samwell.wang:5000`（或你的 Flask 地址）
  - 不配置时默认 `http://api.samwell.wang:5000`。
- 部署时确保运行 Next 的机器能访问到 Flask（同机或内网/公网可达）。

## 数据库

- 文件：`like.db`（与 `app.py` 同目录）
- 表：`counts(slug, count)`、`rate_limits(ip, slug, day)`
- 备份/迁移：直接拷贝 `like.db` 即可。

## GET 跨域：请求没到 Flask 时（代理/缓存拦截）

若浏览器 Network 里 GET `/api/like` 的响应**没有** `X-Served-By: flask`，说明 **GET 被前面的 Nginx/代理/CDN 直接或从缓存响应了，没有回源到 Flask**。需要在代理层做两件事：**关闭对 /api/like 的缓存**，**并把 /api/like 的请求转发到 Flask**。

### Nginx 示例

在对应 `server` 里加一个 `location`，优先匹配 `/api/like`，关缓存并反向代理到 Flask（端口按你实际改）：

```nginx
location /api/like {
    proxy_pass http://127.0.0.1:5000;   # 改成你的 Flask 地址
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # 禁止 Nginx 缓存此接口，让每次 GET 都回源到 Flask
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    proxy_buffering off;
    proxy_cache off;
}
```

确保没有别的 `location`（如 `location /api/` 或 `location /`）先匹配到 `/api/like` 并直接返回或缓存。

### Cloudflare 等 CDN

- 在 CDN 里为 `/api/like` 或对应 API 域名设置 **Cache Level: Bypass**（或等效的「不缓存」），让 GET 回源到你的服务器。
- 或在该 URL 的 **Page Rule / Cache Rule** 里关闭缓存，并确保回源到运行 Flask 的地址。

### 改完后如何确认

再次在浏览器里请求 GET `/api/like`，看 Response Headers 是否出现 **`X-Served-By: flask`**。有则说明已回源到 Flask，CORS 由 Flask 正常返回。

### 没有 Nginx / Cloudflare 时

若前面确实没有 Nginx/Cloudflare，GET 仍可能被**浏览器缓存**或**部署环境自带的代理/缓存**拦截。

1. **先排除浏览器缓存**  
   - 无痕/隐私模式打开博客，再点一次爱心，看 GET 是否仍有跨域。  
   - 或在 DevTools → Network 勾选 **Disable cache**，刷新后再试。  
   - 或清空该站点的「缓存/网站数据」后再试。

2. **确认 GET 是否真的到了 Flask**  
   - 在浏览器地址栏直接访问：`http://api.samwell.wang:5000/api/like?slug=samwell`（把域名和端口改成你的）。  
   - 看响应头里是否有 **`X-Served-By: flask`**。  
   - 若**直接访问也没有**：说明当前 5000 端口上的不是这份 Flask，或前面还有别的进程/代理在响应。

3. **部署在 PaaS（Railway / Render / Fly / 其他）**  
   - 到该平台文档里查「如何关闭某路径的缓存」或「Cache: Bypass」，对 `/api/like` 关掉缓存，并确保流量回源到你的 Flask 进程。

4. **前端加防缓存参数（绕过缓存用）**  
   - 博客项目里的 `like-button.tsx` 已在 GET 请求 URL 上加了 `_t=时间戳`，后端只认 `slug`，会忽略 `_t`。这样每次 GET 的 URL 不同，浏览器或中间缓存不易命中，更容易回源到 Flask。若改完后 GET 正常，说明之前是缓存导致；若仍无 `X-Served-By: flask`，再按上面 2、3 步查部署环境。
