# ReflectivAI Cloudflare Worker

## Quick Start

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Create Worker Files

1. Copy your complete worker code to `src/index.js`
2. Copy `wrangler.toml.template` to `wrangler.toml`
3. Update `wrangler.toml` with your configuration

### 4. Create KV Namespace (Optional)

```bash
wrangler kv:namespace create "SESS"
```

Copy the namespace ID and update `wrangler.toml`.

### 5. Set Secrets

```bash
# Add your Groq API keys
wrangler secret put PROVIDER_API_KEY
wrangler secret put GROQ_KEY_1
wrangler secret put GROQ_KEY_2
```

### 6. Deploy

```bash
wrangler deploy
```

### 7. Test

```bash
# Test health endpoint
curl https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev/health

# Test version
curl https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev/version

# View logs
wrangler tail
```

## Environment Variables

### Secrets (via wrangler secret put)

- `PROVIDER_API_KEY` - Primary Groq API key
- `GROQ_KEY_1` - Additional Groq key (optional)
- `GROQ_KEY_2` - Additional Groq key (optional)
- `GROQ_KEY_3` - Additional Groq key (optional)

### Public Variables (in wrangler.toml)

- `PROVIDER_URL` - Groq API endpoint
- `PROVIDER_MODEL` - LLM model name
- `MAX_OUTPUT_TOKENS` - Max response length
- `CORS_ORIGINS` - Allowed origins (comma-separated)
- `RATELIMIT_WINDOW_MINUTES` - Rate limit window
- `RATELIMIT_MAX_REQUESTS` - Max requests per window
- `DEBUG_MODE` - Enable debug logging

## API Endpoints

- `GET /health` - Health check
- `GET /health?deep=true` - Deep health check (tests Groq API)
- `GET /version` - Worker version
- `GET /debug/ei` - Debug info
- `POST /facts` - Fetch facts
- `POST /plan` - Generate plan
- `POST /chat` - Send chat message
- `POST /coach-metrics` - Record metrics

## Monitoring

```bash
# View real-time logs
wrangler tail

# View deployments
wrangler deployments list

# View secrets
wrangler secret list
```

## Troubleshooting

See [CLOUDFLARE_WORKER_DEPLOYMENT.md](../CLOUDFLARE_WORKER_DEPLOYMENT.md) for detailed troubleshooting.

## Support

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/
- Groq API Docs: https://console.groq.com/docs
