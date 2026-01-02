import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, Session } from "./types";
import { coachPromptBundle } from "./coach-prompts";
import { sanitizeSignals } from "./utils";
import { signalFrameworkPrompt } from "./signal_intel";

const app = new Hono<{ Bindings: Env }>();

// CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health
app.get("/health", (c) => c.json({ ok: true }));

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const sessionId =
      url.searchParams.get("sessionId") ||
      req.headers.get("x-session-id") ||
      "";

    // Status
    if (
      req.method === "GET" &&
      (pathname === "/health" ||
        pathname === "/status" ||
        pathname === "/api/status")
    ) {
      return json(
        {
          ok: true,
          service: "reflectivai-signal-intelligence",
          timestamp: new Date().toISOString(),
        },
        headers
      );
    }

    // Session
    if (pathname === "/api/session" && req.method === "GET") {
      const state = await loadState(env, sessionId);
      return json(state, headers);
    }

    if (pathname === "/api/session" && req.method === "POST") {
      const body = await readJson(req);
      await saveState(env, sessionId, body, ctx);
      return json({ ok: true }, headers);
    }

    // Chat (NO scoring, NO EI)
    if (pathname === "/api/chat" && req.method === "POST") {
      const body = await readJson(req);
      const state = await loadState(env, sessionId);

      if (body.message) {
        state.chatMessages.push({
          role: "user",
          content: body.message,
          timestamp: new Date().toISOString(),
        });
      }

      const messages = [
        {
          role: "system",
          content:
            "You are ReflectivAI. You support structured practice conversations only. Do not assess emotion, intent, or performance.",
        },
        ...state.chatMessages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const response = await callOpenAI(env, messages);

      state.chatMessages.push({
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      });

      await saveState(env, sessionId, state, ctx);
      return json({ response }, headers);
    }

    // ANALYZE → Signal Intelligence ONLY
    if (pathname === "/api/analyze" && req.method === "POST") {
      const body = await readJson(req);
      const state = await loadState(env, sessionId);

      const messages = [
        { role: "system", content: signalFrameworkPrompt },
        {
          role: "user",
          content: body.conversation || "",
        },
      ];

      const response = await callOpenAI(env, messages);

      try {
        const signals = JSON.parse(response);
        state.signals.push({
          signals,
          timestamp: new Date().toISOString(),
        });
        await saveState(env, sessionId, state, ctx);
        return json(signals, headers);
      } catch {
        return json({ error: "Signal parse failure" }, headers, 400);
      }
    }

    // REFLECT → Signal-based reflection (no coaching directives)
    if (pathname === "/api/reflect" && req.method === "POST") {
      const state = await loadState(env, sessionId);

      const prompt = `
You are ReflectivAI.
Using only the signals below, provide structured reflection prompts.
Do not judge. Do not score. Do not prescribe.

Signals:
${JSON.stringify(sanitizeSignals(state.signals).slice(-5))}
`;

      const response = await callOpenAI(env, [
        { role: "user", content: prompt },
      ]);

      return json({ reflection: response }, headers);
    }

    // FEEDBACK (user-entered only)
    if (pathname === "/api/feedback" && req.method === "POST") {
      const body = await readJson(req);
      const state = await loadState(env, sessionId);

      state.feedback = state.feedback || [];
      state.feedback.push({
        ...body,
        timestamp: new Date().toISOString(),
      });

      await saveState(env, sessionId, state, ctx);
      return json({ ok: true }, headers);
    }

    // RESET
    if (pathname === "/api/reset" && req.method === "POST") {
      const state = {
        sessionId,
        chatMessages: [],
        signals: [],
        feedback: [],
        playbooks: [],
        coachFeedback: [],
      };
      await saveState(env, sessionId, state, ctx);
      return json({ ok: true }, headers);
    }

    // PLAYBOOKS
    if (pathname === "/api/playbooks" && req.method === "GET") {
      const state = await loadState(env, sessionId);
      return json({ playbooks: state.playbooks || [] }, headers);
    }

    if (pathname === "/api/playbooks" && req.method === "POST") {
      const body = await readJson(req);
      const state = await loadState(env, sessionId);

      state.playbooks = state.playbooks || [];
      state.playbooks.push({
        ...body,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      });

      await saveState(env, sessionId, state, ctx);
      return json({ ok: true }, headers);
    }

    // COACH CHAT (Signal-grounded, no scoring)
    if (pathname === "/api/coach/chat" && req.method === "POST") {
      const body = await readJson(req);
      const state = await loadState(env, sessionId);

      if (body.message) {
        state.chatMessages.push({
          role: "user",
          content: body.message,
          timestamp: new Date().toISOString(),
        });
      }

      const prompt = `
You are ReflectivAI Coach.
Ground responses only in observable Signal Intelligence.
Offer options, not directives.

Recent Signals:
${JSON.stringify(sanitizeSignals(state.signals).slice(-3))}
`;

      const messages = [
        { role: "system", content: prompt },
        ...state.chatMessages.slice(-20).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const response = await callOpenAI(env, messages);

      state.chatMessages.push({
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      });

      await saveState(env, sessionId, state, ctx);
      return json({ response }, headers);
    }

    // COACH PROMPTS
    if (pathname === "/api/coach/prompts") {
      const body = req.method === "POST" ? await readJson(req) : {};
      const state = await loadState(env, sessionId);

      const bundle = await coachPromptBundle(env, {
        date: new Date().toISOString().slice(0, 10),
        diseaseState: body.diseaseState || "",
        specialty: body.specialty || "",
        hcpCategory: body.hcpCategory || "",
        influenceDriver: body.influenceDriver || "",
        recentMessages: state.chatMessages.slice(-24),
        recentSignals: sanitizeSignals(state.signals).slice(-10),
        previous: state.lastPromptBundle,
      });

      state.lastPromptBundle = bundle;
      await saveState(env, sessionId, state, ctx);
      return json(bundle, headers);
    }

    return json({ error: "Not found" }, headers, 404);
  },
};

// ---------- helpers ----------

async function loadState(env: Env, sessionId: string) {
  const state = await env.SESSIONS.get(sessionId, "json");
  return (
    state || {
      sessionId,
      chatMessages: [],
      signals: [],
      feedback: [],
      playbooks: [],
      coachFeedback: [],
    }
  );
}

async function saveState(
  env: Env,
  sessionId: string,
  state: any,
  ctx: ExecutionContext
) {
  ctx.waitUntil(env.SESSIONS.put(sessionId, JSON.stringify(state)));
}

async function callOpenAI(env: Env, messages: any[]) {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      }),
    }
  );

  const data: any = await response.json();
  return data.choices[0].message.content;
}

function json(data: any, headers: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
