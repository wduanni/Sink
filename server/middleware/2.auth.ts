export default eventHandler((event) => {
  const method = getMethod(event)
  // ① 预检请求不要鉴权，直接放行
  if (method === 'OPTIONS') {
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setHeader(event, 'Access-Control-Allow-Headers', '*')
    setHeader(event, 'Access-Control-Allow-Methods', '*')
    setResponseStatus(event, 204)
    // 注意这里要 return 一个响应，不要什么都不干，否则还会往下走然后 404
    return '' // 空 body 即可
  }
  const authHeader =
    getHeader(event, 'authorization') || getHeader(event, 'Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  const path = event.path || getRequestURL(event).pathname
  const siteToken = useRuntimeConfig(event).siteToken
  if (path.startsWith('/api/') && !path.startsWith('/api/_') && token !== siteToken) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
