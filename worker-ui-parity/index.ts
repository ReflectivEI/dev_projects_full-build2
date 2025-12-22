import { signalFrameworkPrompt } from "../worker-parity/signal_intel";

interface Env {
  SESS: KVNamespace;
  PROVIDER_URL?: string;
  PROVIDER_MODEL?: string;
  PROVIDER_KEY?: string;
  PROVIDER_KEYS?: string;
  CORS_ORIGINS?: string;
}

type Role = "user" | "assistant" | "stakeholder";

type Message = { id: string; role: Role; content: string; timestamp: number; feedback?: any };
type SqlRecord = { id: string; naturalLanguage: string; sqlQuery: string; explanation?: string; timestamp: number };
type RoleplaySession = {
  id: string;
  scenarioId: string;
  difficulty: string;
  messages: Message[];
};

type SessionState = {
  chatMessages: Message[];
  sqlQueries: SqlRecord[];
  roleplay: RoleplaySession | null;
};

const DEFAULT_STATE: SessionState = { chatMessages: [], sqlQueries: [], roleplay: null };

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env, req) });
    }

    const sessionId = getSessionId(req);
    const headers = cors(env, req);
    if (!req.headers.get("x-session-id")) {
      headers.set("x-session-id", sessionId);
    }

    try {
      // Chat send
      if (pathname === "/api/chat/send" && req.method === "POST") {
        const body = await readJson(req);
        const message = String(body?.message || body?.content || "").trim();
        if (!message) return badRequest("message required", headers);
        const state = await loadState(env, sessionId);
        const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: message, timestamp: Date.now() };
        state.chatMessages.push(userMsg);
        const aiReply = await chatReply(env, state.chatMessages);
        const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: aiReply.content, timestamp: Date.now() };
        state.chatMessages.push(aiMsg);
        await saveState(env, sessionId, state, ctx);
        return json({ messages: state.chatMessages, signals: aiReply.signals }, headers);
      }

      // Chat summary (UI uses POST; worker-parity had GET)
      if (pathname === "/api/chat/summary" && req.method === "POST") {
        const state = await loadState(env, sessionId);
        const summary = await summarize(env, state.chatMessages);
        return json(summary, headers);
      }

      // Dashboard insights (not present in worker-parity)
      if (pathname === "/api/dashboard/insights" && req.method === "GET") {
        // TODO: Implement parity with Replit insights logic
        return json({
          dailyTip: "Lead with patient impact before cost.",
          focusArea: "Objection Handling",
          suggestedExercise: { title: "Price Objection Drill", description: "Practice a 2-line value response to cost pushback." },
          motivationalQuote: "Clarity builds confidence—keep it crisp.",
        }, headers);
      }

      // Modules / Exercises
      if (pathname === "/api/modules/exercise" && req.method === "POST") {
        const body = await readJson(req);
        const moduleTitle = body?.moduleTitle || "Module";
        const moduleDescription = body?.moduleDescription || "";
        const exerciseType = body?.exerciseType || "quiz";
        const result = await moduleExercise(env, moduleTitle, moduleDescription, exerciseType);
        return json(result, headers);
      }

      // Roleplay start
      if (pathname === "/api/roleplay/start" && req.method === "POST") {
        const body = await readJson(req);
        const scenarioId = String(body?.scenarioId || "").trim();
        const difficulty = String(body?.difficulty || "intermediate");
        if (!scenarioId) return badRequest("scenarioId required", headers);
        const roleplay: RoleplaySession = {
          id: crypto.randomUUID(),
          scenarioId,
          difficulty,
          messages: [
            { id: crypto.randomUUID(), role: "stakeholder", content: "Good to see you. What would you like to discuss today?", timestamp: Date.now() },
          ],
        };
        const state = await loadState(env, sessionId);
        state.roleplay = roleplay;
        await saveState(env, sessionId, state, ctx);
        return json({ session: roleplay }, headers);
      }

      // Roleplay respond
      if (pathname === "/api/roleplay/respond" && req.method === "POST") {
        const body = await readJson(req);
        const msg = String(body?.message || "").trim();
        if (!msg) return badRequest("message required", headers);
        const state = await loadState(env, sessionId);
        if (!state.roleplay) return badRequest("no active session", headers);
        state.roleplay.messages.push({ id: crypto.randomUUID(), role: "user", content: msg, timestamp: Date.now() });
        const reply = await roleplayReply(env, state.roleplay.messages);
        state.roleplay.messages.push({ id: crypto.randomUUID(), role: "assistant", content: reply.reply, timestamp: Date.now() });
        await saveState(env, sessionId, state, ctx);
        return json({ session: state.roleplay, eqAnalysis: reply.eqAnalysis, reply: reply.reply }, headers);
      }

      // Roleplay end
      if (pathname === "/api/roleplay/end" && req.method === "POST") {
        const state = await loadState(env, sessionId);
        if (!state.roleplay) return badRequest("no active session", headers);
        const analysis = await analyzeConversation(env, state.roleplay.messages);
        const session = state.roleplay;
        state.roleplay = null;
        await saveState(env, sessionId, state, ctx);
        return json({ analysis, session }, headers);
      }

      return new Response("Not Found", { status: 404, headers });
    } catch (err: any) {
      return json({ error: "server_error", message: String(err?.message || err) }, headers, 500);
    }
  },
};

// --- helpers (copied from worker-parity, minimal edits only where required for contract alignment) ---
function cors(env: Env, req: Request): Headers {
  const h = new Headers();
  const origin = req.headers.get("Origin") || "";
  const allowlist = (env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowed = origin && allowlist.length ? allowlist.includes(origin) : !!origin;
  h.set("Access-Control-Allow-Origin", allowed ? origin || "*" : "*");
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
  h.set("Access-Control-Allow-Credentials", "false");
  h.set("Vary", "Origin");
  return h;
}

function getSessionId(req: Request): string {
  const url = new URL(req.url);
  return req.headers.get("x-session-id") || url.searchParams.get("session") || crypto.randomUUID();
}

async function loadState(env: Env, sessionId: string): Promise<SessionState> {
  if (!env.SESS) return structuredClone(DEFAULT_STATE);
  const raw = await env.SESS.get(`sess:${sessionId}`);
  if (!raw) return structuredClone(DEFAULT_STATE);
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

async function saveState(env: Env, sessionId: string, state: SessionState, ctx: ExecutionContext) {
  if (!env.SESS) return;
  const payload = JSON.stringify(state);
  ctx.waitUntil(env.SESS.put(`sess:${sessionId}`, payload, { expirationTtl: 60 * 60 * 24 }));
}

async function readJson(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function json(body: any, headers: HeadersInit, status = 200): Response {
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers: h });
}

function badRequest(message: string, headers: HeadersInit) {
  return json({ error: "bad_request", message }, headers, 400);
}

function selectKey(env: Env): string | null {
  const pool = (env.PROVIDER_KEYS || "")
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  if (env.PROVIDER_KEY) return env.PROVIDER_KEY;
  return null;
}

async function providerChat(env: Env, messages: Array<{ role: string; content: string }>, opts?: { maxTokens?: number; temperature?: number; responseFormat?: any; }) {
  const url = env.PROVIDER_URL || "https://api.openai.com/v1/chat/completions";
  const model = env.PROVIDER_MODEL || "gpt-4o";
  const key = selectKey(env);
  if (!key) throw new Error("Provider key not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: opts?.maxTokens || 512,
        temperature: opts?.temperature ?? 0.2,
        response_format: opts?.responseFormat,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Provider ${res.status}: ${text}`);
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

async function chatReply(env: Env, history: Message[]) {
  const msgs = history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
  let content = "I’m having trouble responding right now.";
  let signals: any[] = [];
  try {
    const prompt = `${signalFrameworkPrompt}\nRespond as the AI Coach. After your reply add a JSON block of 1-3 signals: [{"type":"verbal","signal":"...","interpretation":"...","suggestedResponse":"..."}] separated by a line '===SIGNALS==='.`;
    const full = await providerChat(env, [{ role: "system", content: prompt }, ...msgs]);
    const marker = "===SIGNALS===";
    const idx = full.indexOf(marker);
    if (idx !== -1) {
      content = full.slice(0, idx).trim();
      const sigRaw = full.slice(idx + marker.length).trim();
      const match = sigRaw.match(/\[[\s\S]*\]/);
      if (match) {
        signals = JSON.parse(match[0]);
      }
    } else {
      content = full.trim();
    }
  } catch (e: any) {
    content = `Sorry, I couldn’t reach the model: ${e.message}`;
  }
  return { content, signals };
}

async function summarize(env: Env, messages: Message[]): Promise<any> {
  if (!messages.length) {
    return {
      summary: "No messages yet.",
      keyTakeaways: [],
      skillsDiscussed: [],
      actionItems: [],
      nextSteps: "Start a conversation to generate insights.",
    };
  }
  try {
    const userContent = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const prompt = `Summarize this coaching conversation with 3 key takeaways and next step. Return JSON with fields summary, keyTakeaways, skillsDiscussed, actionItems, nextSteps.\n\n${userContent}`;
    const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 200 });
    return JSON.parse(content);
  } catch (e: any) {
    return {
      summary: `Summary unavailable: ${e.message}`,
      keyTakeaways: [],
      skillsDiscussed: [],
      actionItems: [],
      nextSteps: "Try again later.",
    };
  }
}

async function moduleExercise(env: Env, title: string, description: string, type: string) {
  try {
    const prompt = `Generate a short ${type} exercise for module ${title}. Include JSON with fields title,instructions,content:[{question,options,correctAnswer,explanation}]`;
    const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 500 });
    const parsed = JSON.parse(content);
    return parsed;
  } catch (e: any) {
    return {
      title: `${title} Exercise`,
      instructions: description || "Select the best answer",
      content: [
        {
          question: `What is the best next step in ${title}?`,
          options: ["Acknowledge concern", "Push harder", "Ignore objection", "Avoid cost talk"],
          correctAnswer: "Acknowledge concern",
          explanation: "Acknowledging builds trust before addressing objections.",
        },
      ],
    };
  }
}

async function roleplayReply(env: Env, messages: Message[]) {
  try {
    const prompt = `You are the HCP in a pharma role-play. Keep responses concise. After replying, append a JSON eqAnalysis with score,strengths,improvements,frameworksUsed separated by a line '===EQ==='. Messages: ${messages.map((m) => `${m.role}: ${m.content}`).join(" | ")}`;
    const full = await providerChat(env, [{ role: "system", content: prompt }], { maxTokens: 500 });
    const marker = "===EQ===";
    let reply = full.trim();
    let eqAnalysis = null;
    const idx = full.indexOf(marker);
    if (idx !== -1) {
      reply = full.slice(0, idx).trim();
      const eqRaw = full.slice(idx + marker.length).trim();
      const match = eqRaw.match(/\{[\s\S]*\}/);
      if (match) {
        eqAnalysis = JSON.parse(match[0]);
      }
    }
    if (!eqAnalysis) {
      eqAnalysis = {
        score: 80,
        strengths: ["Empathy", "Clarity"],
        improvements: ["Ask more discovery questions"],
        frameworksUsed: ["active-listening"],
      };
    }
    return { reply, eqAnalysis };
  } catch (e: any) {
    return {
      reply: `Acknowledged. Let's continue. (${e.message})`,
      eqAnalysis: {
        score: 75,
        strengths: ["Empathy"],
        improvements: ["More discovery"],
        frameworksUsed: ["rapport-building"],
      },
    };
  }
}

async function analyzeConversation(env: Env, messages: Message[]) {
  try {
    const prompt = `Provide a concise roleplay analysis JSON with fields overallScore, eqScore, technicalScore, strengths[], areasForImprovement[], frameworksApplied[], recommendations[]. Messages: ${messages.map((m) => `${m.role}: ${m.content}`).join(" | ")}`;
    const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 500 });
    return JSON.parse(content);
  } catch (e: any) {
    return {
      overallScore: 82,
      eqScore: 78,
      technicalScore: 85,
      strengths: ["Clear value communication", "Good rapport"],
      areasForImprovement: ["Ask more open-ended questions"],
      frameworksApplied: ["disc", "active-listening"],
      recommendations: ["Practice DISC adjustments", "Prepare data follow-ups"],
    };
  }
}
