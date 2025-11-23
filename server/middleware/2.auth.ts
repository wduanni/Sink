export default eventHandler((event) => {
  const method = getMethod(event)
  // ① 预检请求不要鉴权，直接放行
  if (method === 'OPTIONS') {
    return
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
