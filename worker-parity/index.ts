import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, Session } from "./types";
import {
    handleAnalyze,
    handleChat,
    handleCoachChat,
    handleCoachFeedback,
    handleCoachPlaybooks,
    handleCoachPrompts,
    handleFeedback,
    handlePlaybooks,
    handleReflect,
    handleReset,
    handleSavePlaybook,
    handleSaveSession,
} from "./handlers";
import { coachPromptBundle } from "./coach-prompts";
import { sanitizeSignals } from "./utils";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("/*", cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
}));

// Health check
app.get("/health", (c) => c.json({ ok: true }));

// Session endpoints
app.get("/api/session/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    const session = await c.env.SESSIONS.get(sessionId, "json") as Session | null;
    return c.json(session || { sessionId, chatMessages: [], signals: [] });
});

app.post("/api/session/:sessionId", async (c) => {
    return handleSaveSession(c);
});

// Chat endpoints
app.post("/api/chat", async (c) => {
    return handleChat(c);
});

app.post("/api/analyze", async (c) => {
    return handleAnalyze(c);
});

app.post("/api/reflect", async (c) => {
    return handleReflect(c);
});

app.post("/api/feedback", async (c) => {
    return handleFeedback(c);
});

app.post("/api/reset", async (c) => {
    return handleReset(c);
});

// Playbook endpoints
app.get("/api/playbooks", async (c) => {
    return handlePlaybooks(c);
});

app.post("/api/playbooks", async (c) => {
    return handleSavePlaybook(c);
});

// Coach endpoints
app.post("/api/coach/chat", async (c) => {
    return handleCoachChat(c);
});

app.all("/api/coach/prompts", async (c) => {
    return handleCoachPrompts(c);
});

app.post("/api/coach/feedback", async (c) => {
    return handleCoachFeedback(c);
});

app.get("/api/coach/playbooks", async (c) => {
    return handleCoachPlaybooks(c);
});

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

        const sessionId = url.searchParams.get("sessionId") || req.headers.get("x-session-id") || "";

        if (pathname === "/health" && req.method === "GET") {
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/status" && req.method === "GET") {
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/session" && req.method === "GET") {
            const state = await loadState(env, sessionId);
            return json(state, headers);
        }

        if (pathname === "/api/session" && req.method === "POST") {
            const body = await readJson(req);
            await saveState(env, sessionId, body, ctx);
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/chat" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[chat] sessionId: ${sessionId}, body:`, body);

            if (body.message) {
                state.chatMessages.push({
                    role: "user",
                    content: body.message,
                    timestamp: new Date().toISOString(),
                });
            }

            const systemPrompt = buildSystemPrompt(state);
            const messages = [
                { role: "system", content: systemPrompt },
                ...state.chatMessages.map((m: any) => ({ role: m.role, content: m.content })),
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

        if (pathname === "/api/analyze" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[analyze] sessionId: ${sessionId}, body:`, body);

            const prompt = `Analyze this sales conversation and extract key signals:\n${body.conversation}\n\nProvide a JSON response with: sentiment, topics, objections, opportunities`;
            const response = await callOpenAI(env, [{ role: "user", content: prompt }]);

            try {
                const signals = JSON.parse(response);
                state.signals.push({
                    ...signals,
                    timestamp: new Date().toISOString(),
                });
                await saveState(env, sessionId, state, ctx);
                return json(signals, headers);
            } catch (e) {
                return json({ error: "Failed to parse analysis" }, headers);
            }
        }

        if (pathname === "/api/reflect" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[reflect] sessionId: ${sessionId}, body:`, body);

            const prompt = `Based on this conversation history and signals, provide coaching insights:\n${JSON.stringify(state.chatMessages.slice(-10))}\n${JSON.stringify(state.signals.slice(-5))}`;
            const response = await callOpenAI(env, [{ role: "user", content: prompt }]);

            return json({ insights: response }, headers);
        }

        if (pathname === "/api/feedback" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[feedback] sessionId: ${sessionId}, body:`, body);

            state.feedback = state.feedback || [];
            state.feedback.push({
                ...body,
                timestamp: new Date().toISOString(),
            });

            await saveState(env, sessionId, state, ctx);
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/reset" && req.method === "POST") {
            const state = {
                sessionId,
                chatMessages: [],
                signals: [],
                feedback: [],
                playbooks: [],
            };
            await saveState(env, sessionId, state, ctx);
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/playbooks" && req.method === "GET") {
            const state = await loadState(env, sessionId);
            return json({ playbooks: state.playbooks || [] }, headers);
        }

        if (pathname === "/api/playbooks" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[playbooks] sessionId: ${sessionId}, body:`, body);

            state.playbooks = state.playbooks || [];
            state.playbooks.push({
                ...body,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            });

            await saveState(env, sessionId, state, ctx);
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/coach/chat" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[coach/chat] sessionId: ${sessionId}, body:`, body);

            if (body.message) {
                state.chatMessages.push({
                    role: "user",
                    content: body.message,
                    timestamp: new Date().toISOString(),
                });
            }

            const systemPrompt = buildCoachSystemPrompt(state);
            const messages = [
                { role: "system", content: systemPrompt },
                ...state.chatMessages.slice(-20).map((m: any) => ({ role: m.role, content: m.content })),
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

        // --- STATUS HEALTH CHECK (supports both paths) ---
if (
  req.method === "GET" &&
  (pathname === "/status" || pathname === "/api/status")
) {
  return json({
    ok: true,
    service: "reflectivai-api-parity",
    timestamp: new Date().toISOString(),
  });
}

// --- COACH PROMPTS ---
if (pathname === "/api/coach/prompts" && (req.method === "GET" || req.method === "POST")) {
  const body = req.method === "POST" ? await readJson(req) : undefined;
  const diseaseState = (body?.diseaseState || body?.disease_state || url.searchParams.get("diseaseState") || "").toString();
  const specialty = (body?.specialty || url.searchParams.get("specialty") || "").toString();
  const hcpCategory = (body?.hcpCategory || body?.hcp_category || url.searchParams.get("hcpCategory") || "").toString();
  const influenceDriver = (body?.influenceDriver || body?.influence_driver || url.searchParams.get("influenceDriver") || "").toString();

  const state = await loadState(env, sessionId);
  console.log(`[coach] prompts`, { sessionId, diseaseState, specialty, hcpCategory, influenceDriver });

  let bundle;
  try {
    bundle = await coachPromptBundle(env, {
      date: new Date().toISOString().slice(0, 10),
      diseaseState,
      specialty,
      hcpCategory,
      influenceDriver,
      recentMessages: state.chatMessages.slice(-24),
      recentSignals: sanitizeSignals(state.signals).slice(-10),
      previous: state.lastPromptBundle,
    });
  } catch {
    bundle = {
      conversationStarters: [
        "What challenges are you seeing with your accounts right now?",
        "What feedback have you been hearing from customers recently?"
      ],
      suggestedTopics: [
        "Account planning",
        "Objection handling",
        "Clinical conversations"
      ],
      timestamp: new Date().toISOString()
    };
  }

  return json(bundle);
}

            state.lastPromptBundle = bundle;
            await saveState(env, sessionId, state, ctx);
            return json(bundle, headers);
        }

        if (pathname === "/api/coach/feedback" && req.method === "POST") {
            const body = await readJson(req);
            const state = await loadState(env, sessionId);
            console.log(`[coach/feedback] sessionId: ${sessionId}, body:`, body);

            state.coachFeedback = state.coachFeedback || [];
            state.coachFeedback.push({
                ...body,
                timestamp: new Date().toISOString(),
            });

            await saveState(env, sessionId, state, ctx);
            return json({ ok: true }, headers);
        }

        if (pathname === "/api/coach/playbooks" && req.method === "GET") {
            const diseaseState = url.searchParams.get("diseaseState") || "";
            const specialty = url.searchParams.get("specialty") || "";
            console.log(`[coach/playbooks]`, { diseaseState, specialty });

            const playbooks = await getCoachPlaybooks(env, diseaseState, specialty);
            return json({ playbooks }, headers);
        }

        return json({ error: "Not found" }, { ...headers }, 404);
    },
};

async function loadState(env: Env, sessionId: string) {
    const state = await env.SESSIONS.get(sessionId, "json");
    return state || {
        sessionId,
        chatMessages: [],
        signals: [],
        feedback: [],
        playbooks: [],
        coachFeedback: [],
    };
}

async function saveState(env: Env, sessionId: string, state: any, ctx: ExecutionContext) {
    ctx.waitUntil(env.SESSIONS.put(sessionId, JSON.stringify(state)));
}

async function callOpenAI(env: Env, messages: any[]) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages,
            temperature: 0.7,
        }),
    });

    const data: any = await response.json();
    return data.choices[0].message.content;
}

function buildSystemPrompt(state: any): string {
    return `You are a sales assistant helping with customer conversations. 
Recent signals: ${JSON.stringify(state.signals.slice(-3))}
Provide helpful, contextual responses.`;
}

function buildCoachSystemPrompt(state: any): string {
    return `You are an expert sales coach helping pharmaceutical sales representatives improve their performance.
Recent signals: ${JSON.stringify(state.signals.slice(-3))}
Provide actionable coaching and insights.`;
}

async function getCoachPlaybooks(env: Env, diseaseState: string, specialty: string) {
    // Placeholder - in production this would query a database or R2
    return [
        {
            id: "1",
            title: "Account Planning Basics",
            diseaseState,
            specialty,
            content: "Guide to effective account planning...",
        },
    ];
}

function json(data: any, headers: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers,
    });
}

async function readJson(req: Request) {
    try {
        return await req.json();
    } catch {
        return {};
    }
}
