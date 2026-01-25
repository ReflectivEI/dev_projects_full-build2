// Cloudflare Pages _worker.js - SPA fallback
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static assets directly
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|txt|xml|pdf)$/)) {
      return env.ASSETS.fetch(request);
    }
    
    // Serve assets directory
    if (url.pathname.startsWith('/assets/')) {
      return env.ASSETS.fetch(request);
    }
    
    // For all other routes, serve index.html (SPA routing)
    const indexRequest = new Request(new URL('/', request.url), request);
    const response = await env.ASSETS.fetch(indexRequest);
    
    return new Response(response.body, {
      status: 200,
      statusText: 'OK',
      headers: response.headers,
    });
  },
};
