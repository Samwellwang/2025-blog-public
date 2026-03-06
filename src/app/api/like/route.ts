/**
 * 爱心计数代理：转发到 Flask 后端，避免浏览器直连跨域/缓存问题。
 * 前端请求同源 /api/like?slug=xxx，由本路由转发到 LIKE_API_BACKEND。
 */
const BACKEND =
	process.env.LIKE_API_BACKEND || process.env.NEXT_PUBLIC_LIKE_API_BACKEND || 'http://api.samwell.wang:5000'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function backendUrl(slug: string): string {
	return `${BACKEND.replace(/\/$/, '')}/api/like?slug=${encodeURIComponent(slug)}`
}

export async function GET(request: Request) {
	const slug = new URL(request.url).searchParams.get('slug')?.trim()
	if (!slug) {
		return Response.json({ error: 'missing slug' }, { status: 400 })
	}
	try {
		const res = await fetch(backendUrl(slug), { method: 'GET', cache: 'no-store' })
		const data = await res.json().catch(() => ({}))
		return Response.json(data, { status: res.status })
	} catch (e) {
		return Response.json({ error: 'proxy failed' }, { status: 502 })
	}
}

export async function POST(request: Request) {
	const slug = new URL(request.url).searchParams.get('slug')?.trim()
	if (!slug) {
		return Response.json({ error: 'missing slug' }, { status: 400 })
	}
	const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
	try {
		const res = await fetch(backendUrl(slug), {
			method: 'POST',
			headers: forwarded ? { 'X-Forwarded-For': forwarded } : undefined
		})
		const data = await res.json().catch(() => ({}))
		return Response.json(data, { status: res.status })
	} catch (e) {
		return Response.json({ error: 'proxy failed' }, { status: 502 })
	}
}
