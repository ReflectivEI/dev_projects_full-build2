# ReflectivAI UI Parity Worker

Purpose: isolated worker that mirrors the UI-facing API contract (chat, summary, dashboard insights, modules/exercise, roleplay start/respond/end) without touching existing workers. This is not deployed.

## Status
- Not deployed
- No secrets set
- Lives in `worker-ui-parity/`

## What a human must do
1) Set secrets in Cloudflare (PROVIDER_URL, PROVIDER_MODEL, PROVIDER_KEY/PROVIDER_KEYS, CORS_ORIGINS) and bind KV `SESS`.
2) Deploy manually with Wrangler from this folder.
3) Point Cloudflare Pages `VITE_WORKER_URL` to the deployed worker URL.

## Rollback
- Repoint `VITE_WORKER_URL` to the previous worker if anything misbehaves.

No commands have been executed by this agent.
