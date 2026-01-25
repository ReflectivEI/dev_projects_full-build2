// Cloudflare Pages Functions - SPA fallback
export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // If requesting a file with extension, serve it directly
  if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
    return next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  const indexUrl = new URL('/index.html', request.url);
  const response = await env.ASSETS.fetch(indexUrl);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
