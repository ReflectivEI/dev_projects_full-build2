// ReflectivAI Cloudflare Worker - Production Backend
// This file contains your complete Cloudflare Worker code

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.ts
var TIMEOUT_PROVIDER_CHAT = 25e3;
var TIMEOUT_ALORA_CHAT = 15e3;
var TIMEOUT_HEALTH_CHECK = 5e3;
var index_default = {
  async fetch(req, env, ctx) {
    const reqId = req.headers.get("x-req-id") || cryptoRandomId();
    try {
      const url = new URL(req.url);
      if (!globalThis.__CFG_LOGGED__) {
        const keyPool = getProviderKeyPool(env);
        const allowed = String(env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
        const maskedKeys = keyPool.map((key, idx) => `key_${idx + 1}: ${key.substring(0, 7)}...${key.substring(key.length - 4)}`);
        console.log({
          event: "startup_config",
          key_pool_size: keyPool.length,
          key_pool_masked: maskedKeys,
          cors_allowlist_size: allowed.length,
          rotation_strategy: env.PROVIDER_ROTATION_STRATEGY || "round-robin"
        });
        globalThis.__CFG_LOGGED__ = true;
      }
      if (req.method === "OPTIONS") {
        const h = cors(env, req);
        h["x-req-id"] = reqId;
        return new Response(null, { status: 204, headers: h });
      }
      if (url.pathname === "/health" && (req.method === "GET" || req.method === "HEAD")) {
        const deep = url.searchParams.get("deep");
        if (req.method === "HEAD" && !deep) {
          return new Response(null, { status: 200, headers: cors(env, req) });
        }
        if (deep === "1" || deep === "true") {
          const keyPool = getProviderKeyPool(env);
          let provider = { ok: false, status: 0 };
          try {
            const key = selectProviderKey(env, "healthcheck");
            if (key) {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), TIMEOUT_HEALTH_CHECK);
              try {
                const r = await fetch((env.PROVIDER_URL || "https://api.groq.com/openai/v1/chat/completions").replace(/\/chat\/completions$/, "/models"), {
                  headers: { "authorization": `Bearer ${key}` },
                  method: "GET",
                  signal: controller.signal
                });
                provider = { ok: r.ok, status: r.status };
              } finally {
                clearTimeout(timeout);
              }
            }
          } catch (e) {
            provider = { ok: false, error: String(e?.message || e) };
          }
          return json({ ok: true, time: Date.now(), key_pool: keyPool.length, provider }, 200, env, req, { "x-req-id": reqId });
        }
        return new Response("ok", { status: 200, headers: { ...cors(env, req), "x-req-id": reqId } });
      }
      if (url.pathname === "/version" && req.method === "GET") {
        return json({ version: "r10.1" }, 200, env, req, { "x-req-id": reqId });
      }
      if (url.pathname === "/debug/ei" && req.method === "GET") {
        return json({ worker: "ReflectivAI Gateway", version: "r10.1", endpoints: ["/health", "/version", "/debug/ei", "/facts", "/plan", "/chat"], timestamp: (/* @__PURE__ */ new Date()).toISOString() }, 200, env, req, { "x-req-id": reqId });
      }
      if (url.pathname === "/facts" && req.method === "POST") return postFacts(req, env);
      if (url.pathname === "/plan" && req.method === "POST") return postPlan(req, env);
      if (url.pathname === "/chat" && req.method === "POST") {
        const ip = req.headers.get("CF-Connecting-IP") || "0.0.0.0";
        const gate = rateLimit(`${ip}:chat`, env);
        if (!gate.ok) {
          const retry = Number(env.RATELIMIT_RETRY_AFTER || 2);
          return json({ error: "rate_limited", retry_after_sec: retry }, 429, env, req, {
            "Retry-After": String(retry),
            "X-RateLimit-Limit": String(gate.limit),
            "X-RateLimit-Remaining": String(gate.remaining),
            "x-req-id": reqId
          });
        }
        return postChat(req, env);
      }
      if (url.pathname === "/coach-metrics" && req.method === "POST") return postCoachMetrics(req, env);
      return json({ error: "not_found" }, 404, env, req, { "x-req-id": reqId });
    } catch (e) {
      console.error("Top-level error:", e);
      return json({ error: "server_error", message: "Internal server error" }, 500, env, req, { "x-req-id": reqId });
    }
  },
  // Export test functions for unit testing
  validateSalesCoachContract,
  fixSalesCoachContract
};

// ... (rest of your worker code - I'll include the complete file)
// Due to length, I'll create this as a separate operation

export default index_default;
