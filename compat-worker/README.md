# ReflectivAI API Compatibility Worker

This Cloudflare Worker implements the `/api/*` endpoints required by the ReflectivAI frontend without modifying frontend code. It provides deterministic, KV-backed responses for chat, SQL, role-play, knowledge, frameworks, heuristics, and modules endpoints. Configure `CORS_ORIGINS` for allowed origins and bind `SESS` KV for session state. Deploy with `wrangler publish` to serve as the standalone API layer.
