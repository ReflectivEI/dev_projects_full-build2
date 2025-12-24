import { signalFrameworkPrompt } from "./signal_intel";

// Minimal Cloudflare Workers type shims (avoids requiring @cloudflare/workers-types in this repo).
type KVNamespace = {
    get: (key: string, options?: { type: "json" | "text" | "arrayBuffer" | "stream" }) => Promise<any>;
    put: (key: string, value: string, options?: { expiration?: number; expirationTtl?: number; metadata?: any }) => Promise<void>;
    delete: (key: string) => Promise<void>;
};

type ExecutionContext = {
    waitUntil: (promise: Promise<any>) => void;
    passThroughOnException?: () => void;
};

interface Env {
    SESS: KVNamespace;
    PROVIDER_URL?: string;
    PROVIDER_MODEL?: string;
    PROVIDER_KEY?: string;
    PROVIDER_KEYS?: string;
    CORS_ORIGINS?: string;
}

type Role = "user" | "assistant" | "stakeholder";

type ChatMessage = { id?: string; role: Role; content: string; timestamp?: number; feedback?: { eqScore?: number; suggestions?: string[]; frameworks?: string[] } };
type SqlRecord = { id: string; naturalLanguage: string; sqlQuery: string; explanation?: string; timestamp: number };
type RoleplaySession = {
    id: string;
    scenarioId: string;
    difficulty: string;
    messages: ChatMessage[];
};

type SessionState = {
    chatMessages: ChatMessage[];
    sqlQueries: SqlRecord[];
    roleplay: RoleplaySession | null;
    signals?: any[];
    lastDailyFocus?: { title: string; focus: string; microTask: string; reflection: string; timestamp: string };
    lastPromptBundle?: { conversationStarters: string[]; suggestedTopics: string[]; timestamp: string };
};

const DEFAULT_STATE: SessionState = { chatMessages: [], sqlQueries: [], roleplay: null, signals: [] };
const ALLOWED_ORIGINS = new Set([
    "https://reflectivai-app-prod.pages.dev",
    "https://production.reflectivai-app-prod.pages.dev",
]);

export default {
    async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const isApi = pathname.startsWith("/api/") || pathname === "/health" || pathname === "/summary";
        const hasAccessAssertion = !!req.headers.get("cf-access-jwt-assertion");

        const headers = cors(env, req);

        // CORS preflight
        if (req.method === "OPTIONS") {
            return new Response(null, { status: 200, headers });
        }

        // Allow unauthenticated API access when Cloudflare Access assertion is missing (UI still guarded upstream).
        if (isApi && !hasAccessAssertion) {
            headers.set("x-access-bypass", "true");
        }

        let sessionId = getSessionId(req);
        if (!req.headers.get("x-session-id")) {
            headers.set("x-session-id", sessionId);
        }

        try {
            if (pathname === "/health" && req.method === "GET") {
                return json({ status: "ok", worker: "parity-v2", time: Date.now() }, headers);
            }

            // Chat
            if (pathname === "/api/chat/messages" && req.method === "GET") {
                const state = await loadState(env, sessionId);
                return json({ messages: state.chatMessages }, headers);
            }

            if (pathname === "/api/chat/send" && req.method === "POST") {
                const body = await readJson(req);
                sessionId = getSessionId(req, body);
                headers.set("x-session-id", sessionId);
                const message = String(body?.message || body?.content || "").trim();
                if (!message) return badRequest("message required", headers);
                const context = body?.context;
                const state = await loadState(env, sessionId);
                const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message, timestamp: Date.now() };
                state.chatMessages.push(userMsg);
                console.log(`[chat] send`, {
                    sessionId,
                    diseaseState: context?.diseaseState || context?.disease_state || context?.disease,
                    specialty: context?.specialty,
                    hcpCategory: context?.hcpCategory || context?.hcp_category,
                    influenceDriver: context?.influenceDriver || context?.influence_driver,
                    discEnabled: !!(context?.discEnabled ?? context?.disc_enabled),
                });

                const aiReply = await chatReply(env, state.chatMessages, context);
                const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: aiReply.content, timestamp: Date.now() };
                state.chatMessages.push(aiMsg);

                state.signals = [...(Array.isArray(state.signals) ? state.signals : []), ...(Array.isArray(aiReply.signals) ? aiReply.signals : [])].slice(-50);
                await saveState(env, sessionId, state, ctx);
                return json({ messages: state.chatMessages, signals: aiReply.signals }, headers);
            }

            if (pathname === "/api/chat/clear" && req.method === "POST") {
                await saveState(env, sessionId, { ...DEFAULT_STATE }, ctx);
                return json({ ok: true }, headers);
            }

            if (pathname === "/api/chat/summary" && (req.method === "GET" || req.method === "POST")) {
                let overrideSession: string | undefined;
                if (req.method === "POST") {
                    const body = await readJson(req);
                    overrideSession = body?.sessionId || body?.session;
                } else {
                    overrideSession = url.searchParams.get("sessionId") || url.searchParams.get("session") || undefined;
                }
                if (overrideSession) {
                    sessionId = String(overrideSession);
                    headers.set("x-session-id", sessionId);
                }
                const state = await loadState(env, sessionId);
                const summary = await summarizeSession(env, state.chatMessages, state.signals);
                return json(summary, headers);
            }

            // Back-compat alias (some UIs call /summary)
            if (pathname === "/summary" && (req.method === "GET" || req.method === "POST")) {
                let overrideSession: string | undefined;
                if (req.method === "POST") {
                    const body = await readJson(req);
                    overrideSession = body?.sessionId || body?.session;
                } else {
                    overrideSession = url.searchParams.get("sessionId") || url.searchParams.get("session") || undefined;
                }
                if (overrideSession) {
                    sessionId = String(overrideSession);
                    headers.set("x-session-id", sessionId);
                }
                const state = await loadState(env, sessionId);
                const summary = await summarizeSession(env, state.chatMessages, state.signals);
                return json(summary, headers);
            }

            // SQL
            if (pathname === "/api/sql/history" && req.method === "GET") {
                const state = await loadState(env, sessionId);
                return json({ queries: state.sqlQueries }, headers);
            }

            if (pathname === "/api/sql/translate" && req.method === "POST") {
                const body = await readJson(req);
                const question = String(body?.question || body?.naturalLanguage || "").trim();
                if (!question) return badRequest("question required", headers);
                const { sqlQuery, explanation } = await translateSql(env, question);
                const entry: SqlRecord = {
                    id: crypto.randomUUID(),
                    naturalLanguage: question,
                    sqlQuery,
                    explanation,
                    timestamp: Date.now(),
                };
                const state = await loadState(env, sessionId);
                state.sqlQueries.unshift(entry);
                state.sqlQueries = state.sqlQueries.slice(0, 50);
                await saveState(env, sessionId, state, ctx);
                return json(entry, headers);
            }

            // Roleplay
            if (pathname === "/api/roleplay/session" && req.method === "GET") {
                const state = await loadState(env, sessionId);
                return json({ session: state.roleplay }, headers);
            }

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
                        { role: "stakeholder", content: "Good to see you. What would you like to discuss today?", timestamp: Date.now() },
                    ],
                };
                const state = await loadState(env, sessionId);
                state.roleplay = roleplay;
                await saveState(env, sessionId, state, ctx);
                return json({ session: roleplay }, headers);
            }

            if (pathname === "/api/roleplay/respond" && req.method === "POST") {
                const body = await readJson(req);
                const msg = String(body?.message || "").trim();
                if (!msg) return badRequest("message required", headers);
                const state = await loadState(env, sessionId);
                if (!state.roleplay) return badRequest("no active session", headers);
                state.roleplay.messages.push({ role: "user", content: msg, timestamp: Date.now() });
                const reply = await roleplayReply(env, state.roleplay.messages);
                state.roleplay.messages.push({ role: "assistant", content: reply.reply, timestamp: Date.now() });
                await saveState(env, sessionId, state, ctx);
                return json({ session: state.roleplay, eqAnalysis: reply.eqAnalysis, reply: reply.reply, signals: reply.signals || [] }, headers);
            }

            if (pathname === "/api/roleplay/end" && req.method === "POST") {
                const state = await loadState(env, sessionId);
                if (!state.roleplay) return badRequest("no active session", headers);
                const analysis = await analyzeConversation(env, state.roleplay.messages);
                const normalizedAnalysis = normalizeEndAnalysis(analysis);
                const session = state.roleplay;
                state.roleplay = null;
                await saveState(env, sessionId, state, ctx);
                return json({ analysis: normalizedAnalysis, session }, headers);
            }

            if (pathname === "/api/roleplay/eq-analysis" && req.method === "POST") {
                const state = await loadState(env, sessionId);
                if (!state.roleplay) return badRequest("no active session", headers);
                const eqAnalysis = await liveEqAnalysis(env, state.roleplay.messages);
                return json({ eqAnalysis }, headers);
            }

            // Knowledge
            if (pathname === "/api/knowledge/ask" && req.method === "POST") {
                const body = await readJson(req);
                const question = String(body?.question || "").trim();
                if (!question) return badRequest("question required", headers);
                const answer = await knowledgeAnswer(env, question, body?.articleContext);
                return json({ answer, relatedTopics: ["Evidence", "Guidelines", "Patient impact"] }, headers);
            }

            if (pathname === "/api/dashboard/insights" && req.method === "GET") {
                const insights = await dashboardInsights(env);
                return json(insights, headers);
            }

            if (pathname === "/api/daily-focus" && req.method === "GET") {
                const state = await loadState(env, sessionId);
                const role = url.searchParams.get("role") || undefined;
                const specialty = url.searchParams.get("specialty") || undefined;
                const focus = await dailyFocus(env, {
                    date: new Date().toISOString().slice(0, 10),
                    role,
                    specialty,
                    recentMessages: state.chatMessages.slice(-30),
                    recentSignals: sanitizeSignals(state.signals).slice(-15),
                    previousFocus: state.lastDailyFocus?.focus,
                });
                // Contract: always return { title, focus, microTask, reflection } as strings.
                // Backward compatibility: if legacy fields exist (e.g., category/timestamp), map deterministically.
                const legacyCategory = (focus as any)?.category;
                const title = String(focus?.title || legacyCategory || "Today’s Focus");
                const focusText = String(focus?.focus || "");
                const microTask = String((focus as any)?.microTask || "");
                const reflection = String((focus as any)?.reflection || "");

                state.lastDailyFocus = {
                    title,
                    focus: focusText,
                    microTask,
                    reflection,
                    timestamp: String((focus as any)?.timestamp || new Date().toISOString()),
                };
                await saveState(env, sessionId, state, ctx);
                return json({ title, focus: focusText, microTask, reflection }, headers);
            }

            if (pathname === "/api/coach/prompts" && (req.method === "GET" || req.method === "POST")) {
                const body = req.method === "POST" ? await readJson(req) : undefined;
                const diseaseState = (body?.diseaseState || body?.disease_state || url.searchParams.get("diseaseState") || "").toString();
                const specialty = (body?.specialty || url.searchParams.get("specialty") || "").toString();
                const hcpCategory = (body?.hcpCategory || body?.hcp_category || url.searchParams.get("hcpCategory") || "").toString();
                const influenceDriver = (body?.influenceDriver || body?.influence_driver || url.searchParams.get("influenceDriver") || "").toString();

                const state = await loadState(env, sessionId);
                console.log(`[coach] prompts`, { sessionId, diseaseState, specialty, hcpCategory, influenceDriver });

                const bundle = await coachPromptBundle(env, {
                    date: new Date().toISOString().slice(0, 10),
                    diseaseState,
                    specialty,
                    hcpCategory,
                    influenceDriver,
                    recentMessages: state.chatMessages.slice(-24),
                    recentSignals: sanitizeSignals(state.signals).slice(-10),
                    previous: state.lastPromptBundle,
                });

                state.lastPromptBundle = bundle;
                await saveState(env, sessionId, state, ctx);
                return json(bundle, headers);
            }

            // Frameworks
            if (pathname === "/api/frameworks/advice" && req.method === "POST") {
                const body = await readJson(req);
                const frameworkName = body?.frameworkName || body?.frameworkId || "Framework";
                const situation = body?.situation || "";
                const advice = await frameworkAdvice(env, frameworkName, situation);
                return json({ advice, practiceExercise: "Role-play this scenario using the framework.", tips: ["Lead with empathy", "Stay concise", "Reinforce evidence"] }, headers);
            }

            // Heuristics
            if (pathname === "/api/heuristics/customize" && req.method === "POST") {
                const body = await readJson(req);
                const templateName = body?.templateName || "Template";
                const templatePattern = body?.templatePattern || "";
                const userSituation = body?.userSituation || "";
                const customizedTemplate = await customizeHeuristic(env, templateName, templatePattern, userSituation);
                return json({ customizedTemplate }, headers);
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

            return new Response("Not Found", { status: 404, headers });
        } catch (err: any) {
            return json({ error: "server_error", message: String(err?.message || err) }, headers, 500);
        }
    },
};

function cors(env: Env, req: Request): Headers {
    const h = new Headers();
    const origin = req.headers.get("Origin") || "";
    const allowed = origin ? ALLOWED_ORIGINS.has(origin) : false;
    h.set("Access-Control-Allow-Origin", allowed ? origin : "*");
    h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    h.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
    // Let browsers read `x-session-id` so the frontend can persist a stable session.
    h.set("Access-Control-Expose-Headers", "x-session-id");
    h.set("Access-Control-Allow-Credentials", "false");
    h.set("Vary", "Origin");
    return h;
}

function getSessionId(req: Request, body?: any): string {
    const url = new URL(req.url);

    const accessEmail = req.headers.get("cf-access-authenticated-user-email")?.trim();
    const accessUser = req.headers.get("cf-access-user")?.trim();
    const accessDerived = accessEmail || accessUser;

    return (
        req.headers.get("x-session-id") ||
        url.searchParams.get("sessionId") ||
        url.searchParams.get("session") ||
        body?.sessionId ||
        body?.session ||
        (accessDerived ? `sess:${accessDerived}` : undefined) ||
        crypto.randomUUID()
    );
}

async function loadState(env: Env, sessionId: string): Promise<SessionState> {
    if (!env.SESS) return structuredClone(DEFAULT_STATE);
    const raw = await env.SESS.get(`sess:${sessionId}`);
    if (!raw) return structuredClone(DEFAULT_STATE);
    try {
        const parsed = JSON.parse(raw) as SessionState;
        parsed.chatMessages = sanitizeChatMessages(parsed.chatMessages);
        if (parsed.roleplay) {
            parsed.roleplay.messages = sanitizeChatMessages(parsed.roleplay.messages);
        }
        parsed.signals = sanitizeSignals(parsed.signals);
        console.log(`[sess] load`, { sessionId, messages: parsed.chatMessages.length, sql: parsed.sqlQueries.length });
        return parsed;
    } catch {
        return structuredClone(DEFAULT_STATE);
    }
}

function sanitizeSignals(signals: any): any[] {
    const arr = Array.isArray(signals) ? signals : [];
    const now = new Date().toISOString();
    return arr
        .map((s) => {
            if (!s || typeof s !== "object") return null;
            const type = coerceSignalType((s as any).type);
            const signal = typeof (s as any).signal === "string" ? (s as any).signal.trim() : "";
            const interpretation = typeof (s as any).interpretation === "string" ? (s as any).interpretation.trim() : "";
            const suggestedResponse = typeof (s as any).suggestedResponse === "string" ? (s as any).suggestedResponse.trim() : undefined;
            const evidence = typeof (s as any).evidence === "string" ? (s as any).evidence.trim() : undefined;
            if (!signal && !interpretation) return null;
            return {
                id: typeof (s as any).id === "string" && (s as any).id.trim() ? (s as any).id.trim() : crypto.randomUUID(),
                type,
                signal,
                interpretation,
                ...(suggestedResponse ? { suggestedResponse } : {}),
                ...(evidence ? { evidence } : {}),
                timestamp: typeof (s as any).timestamp === "string" && (s as any).timestamp.trim() ? (s as any).timestamp.trim() : now,
            };
        })
        .filter(Boolean)
        .slice(-100);
}

async function saveState(env: Env, sessionId: string, state: SessionState, ctx: ExecutionContext) {
    if (!env.SESS) return;
    const payload = JSON.stringify(state);
    console.log(`[sess] save`, { sessionId, messages: state.chatMessages.length, sql: state.sqlQueries.length });
    const write = env.SESS.put(`sess:${sessionId}`, payload, { expirationTtl: 60 * 60 * 24 });
    ctx.waitUntil(write);
    await write;
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

function sanitizeChatMessages(messages: any): ChatMessage[] {
    if (!Array.isArray(messages)) return [];
    return messages
        .map((m, idx) => {
            const role: Role = m?.role === "assistant" || m?.role === "stakeholder" ? m.role : "user";
            const content = typeof m?.content === "string" ? m.content : "";
            const timestamp = typeof m?.timestamp === "number" ? m.timestamp : Date.now() - (messages.length - idx);
            return {
                id: m?.id || crypto.randomUUID(),
                role,
                content,
                timestamp,
                feedback: m?.feedback,
            } satisfies ChatMessage;
        })
        .filter((m) => !!m.content);
}

async function providerChat(env: Env, messages: Array<{ role: string; content: string }>, opts?: { maxTokens?: number; temperature?: number; responseFormat?: any; }) {
    const key = selectKey(env);
    if (!key) throw new Error("Provider key not configured");

    const isGroq = key.startsWith("gsk_");
    const url =
        env.PROVIDER_URL ||
        (isGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions");
    const model = env.PROVIDER_MODEL || (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o");

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

function safeJsonParse<T = any>(raw: string): T {
    // First try direct parse
    try {
        return JSON.parse(raw) as T;
    } catch {
        // Attempt to extract the first JSON object/array in the string
        const trimmed = String(raw || "").trim();
        const objStart = trimmed.indexOf("{");
        const arrStart = trimmed.indexOf("[");
        const start = objStart === -1 ? arrStart : arrStart === -1 ? objStart : Math.min(objStart, arrStart);
        if (start === -1) throw new Error("No JSON found in model response");
        const open = trimmed[start];
        const close = open === "[" ? "]" : "}";
        const end = trimmed.lastIndexOf(close);
        if (end === -1 || end <= start) throw new Error("Malformed JSON in model response");
        const slice = trimmed.slice(start, end + 1);
        return JSON.parse(slice) as T;
    }
}

async function providerChatJson<T = any>(
    env: Env,
    messages: Array<{ role: string; content: string }>,
    opts?: { maxTokens?: number; temperature?: number }
): Promise<T> {
    const raw = await providerChat(env, messages, {
        maxTokens: opts?.maxTokens,
        temperature: opts?.temperature,
        responseFormat: { type: "json_object" },
    });
    return safeJsonParse<T>(raw);
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

async function chatReply(env: Env, history: ChatMessage[], context?: any) {
    const msgs = history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    let content = "I’m having trouble responding right now.";
    let signals: any[] = [];
    try {
        const diseaseState = context?.diseaseState || context?.disease_state || context?.disease || "";
        const specialty = context?.specialty || "";
        const hcpCategory = context?.hcpCategory || context?.hcp_category || "";
        const influenceDriver = context?.influenceDriver || context?.influence_driver || "";
        const discEnabled = !!(context?.discEnabled ?? context?.disc_enabled);

        const sys = `${signalFrameworkPrompt}
You are ReflectivAI AI Coach for pharma/biotech sales.

Hard requirements:
- Be explicitly tailored to the provided context (disease state, specialty, HCP category, influence driver) when present.
    - If any context field is provided, explicitly reference it in your reply at least once (so dropdown changes materially affect coaching).
- Signal Intelligence: only output OBSERVABLE interaction signals; no personality/intent/emotion inference.
- If DISC is not enabled, do not mention DISC.

Context:
- diseaseState: ${String(diseaseState)}
- specialty: ${String(specialty)}
- hcpCategory: ${String(hcpCategory)}
- influenceDriver: ${String(influenceDriver)}
- discEnabled: ${discEnabled ? "true" : "false"}

Return JSON ONLY with fields:
{
  "reply": string,
  "signals": Array<{"type":"verbal"|"conversational"|"engagement"|"contextual","signal":string,"evidence":string,"interpretation":string,"suggestedResponse"?:string}>
}
Rules for signals:
- 0-3 items max
- evidence must quote or closely paraphrase an excerpt from the conversation
- interpretation must be a hypothesis framed with uncertainty (e.g., "may indicate...")
- do not invent facts not present in the messages
`;

        const parsed = await providerChatJson<{ reply?: string; signals?: any[] }>(
            env,
            [{ role: "system", content: sys }, ...msgs],
            { maxTokens: 800, temperature: 0.6 }
        );
        content = typeof parsed?.reply === "string" && parsed.reply.trim() ? parsed.reply.trim() : "I’m having trouble responding right now.";
        signals = Array.isArray(parsed?.signals) ? parsed.signals : [];
    } catch (e: any) {
        content = `Sorry, I couldn’t reach the model: ${e.message}`;
    }
    return { content, signals: normalizeSignals(signals) };
}

type NormalizedSignalType = "verbal" | "conversational" | "engagement" | "contextual";

function coerceSignalType(type: unknown): NormalizedSignalType {
    const normalized = typeof type === "string" ? type.toLowerCase().trim() : "";
    if (normalized === "verbal" || normalized === "conversational" || normalized === "engagement" || normalized === "contextual") {
        return normalized as NormalizedSignalType;
    }
    return "contextual";
}

function normalizeSignals(raw: unknown) {
    const now = new Date().toISOString();
    const arr = Array.isArray(raw) ? raw : [];
    return arr
        .map((s: any) => {
            const type = coerceSignalType(s?.type);
            const signal = typeof s?.signal === "string" ? s.signal.trim() : "";
            const interpretation = typeof s?.interpretation === "string" ? s.interpretation.trim() : "";
            const suggestedResponse = typeof s?.suggestedResponse === "string" ? s.suggestedResponse.trim() : undefined;
            const evidence = typeof s?.evidence === "string" ? s.evidence.trim() : undefined;
            const id = typeof s?.id === "string" && s.id.trim() ? s.id.trim() : crypto.randomUUID();
            const timestamp = typeof s?.timestamp === "string" && s.timestamp.trim() ? s.timestamp.trim() : now;
            if (!signal && !interpretation) return null;
            return {
                id,
                type,
                signal,
                interpretation,
                ...(suggestedResponse ? { suggestedResponse } : {}),
                ...(evidence ? { evidence } : {}),
                timestamp,
            };
        })
        .filter((v): v is { id: string; type: NormalizedSignalType; signal: string; interpretation: string; suggestedResponse?: string; evidence?: string; timestamp: string } => v != null)
        .slice(0, 5);
}

async function summarizeSession(
    env: Env,
    messages: ChatMessage[],
    recentSignals?: any[]
): Promise<{
    summary: string;
    keyTakeaways: string[];
    skillsDiscussed: string[];
    actionItems: string[];
    nextSteps: string;
    objectionsSurfaced: string[];
    signalIntelligenceHighlights: Array<{ type: NormalizedSignalType; signal: string; evidence?: string; interpretation: string; suggestedResponse?: string }>;
}> {
    const safeEmpty = {
        summary: "No messages yet.",
        keyTakeaways: [],
        skillsDiscussed: [],
        actionItems: [],
        nextSteps: "Start a new coaching conversation and ask for a call plan or objection handling help.",
        objectionsSurfaced: [],
        signalIntelligenceHighlights: [],
    };
    if (!messages.length) return safeEmpty;
    try {
        const transcript = messages
            .slice(-60)
            .map((m, idx) => `${idx + 1}. ${m.role}: ${m.content}`)
            .join("\n");
        const sig = Array.isArray(recentSignals) ? recentSignals.slice(-10) : [];

        const sys = `${signalFrameworkPrompt}
You are generating a Session Summary for a pharma sales coaching conversation.

Hard requirements:
- Base everything on the provided transcript (do not invent facts).
- Include objections only if explicitly present.
- Signal Intelligence highlights must be grounded in observable signals and include evidence snippets.
- No personality/intent/emotion inference.

Return JSON ONLY with fields:
{
  "summary": string,
  "keyTakeaways": string[],
  "skillsDiscussed": string[],
  "actionItems": string[],
  "nextSteps": string,
  "objectionsSurfaced": string[],
  "signalIntelligenceHighlights": Array<{"type":"verbal"|"conversational"|"engagement"|"contextual","signal":string,"evidence":string,"interpretation":string,"suggestedResponse"?:string}>
}
Constraints:
- keyTakeaways: 3-6 items
- skillsDiscussed: 3-8 items (short labels)
- actionItems: 3-6 items (imperative)
- objectionsSurfaced: 0-5 items
- signalIntelligenceHighlights: 0-5 items
`;

        const user = `Transcript:\n${transcript}\n\nRecentSignals (may be empty, use only if consistent with transcript):\n${JSON.stringify(sig)}`;
        const parsed = await providerChatJson<any>(env, [{ role: "system", content: sys }, { role: "user", content: user }], {
            maxTokens: 900,
            temperature: 0.35,
        });

        const out = {
            summary: typeof parsed?.summary === "string" ? parsed.summary.trim() : safeEmpty.summary,
            keyTakeaways: Array.isArray(parsed?.keyTakeaways) ? parsed.keyTakeaways.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 10) : [],
            skillsDiscussed: Array.isArray(parsed?.skillsDiscussed) ? parsed.skillsDiscussed.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 15) : [],
            actionItems: Array.isArray(parsed?.actionItems) ? parsed.actionItems.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 10) : [],
            nextSteps: typeof parsed?.nextSteps === "string" && parsed.nextSteps.trim() ? parsed.nextSteps.trim() : safeEmpty.nextSteps,
            objectionsSurfaced: Array.isArray(parsed?.objectionsSurfaced) ? parsed.objectionsSurfaced.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 10) : [],
            signalIntelligenceHighlights: normalizeSignals(Array.isArray(parsed?.signalIntelligenceHighlights) ? parsed.signalIntelligenceHighlights : []),
        };
        if (!out.keyTakeaways.length && messages.length) out.keyTakeaways = ["Capture the HCP’s core constraint in one sentence.", "Lead with value before details.", "Confirm a next step and owner."];
        if (!out.actionItems.length && messages.length) out.actionItems = ["Draft 3 discovery questions for the next call.", "Prepare one evidence-backed value statement.", "Practice a 15-second next-step close."];
        if (!out.skillsDiscussed.length && messages.length) out.skillsDiscussed = ["Active Listening", "Discovery", "Objection Handling"];
        return out;
    } catch (e: any) {
        return {
            ...safeEmpty,
            summary: `Summary unavailable: ${e?.message || String(e)}`,
        };
    }
}

async function translateSql(env: Env, question: string) {
    try {
        const prompt = `You are an expert SQL translator for pharma sales. Return JSON with fields sqlQuery and explanation. Question: ${question}`;
        const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 400 });
        const parsed = safeJsonParse<any>(content);
        return { sqlQuery: parsed.sqlQuery || parsed.sql || "-- unable to generate", explanation: parsed.explanation };
    } catch (e: any) {
        return { sqlQuery: "-- demo sql\nSELECT * FROM sales_calls LIMIT 10;", explanation: e.message };
    }
}

async function roleplayReply(env: Env, messages: ChatMessage[]) {
    try {
        const mapped = messages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
        }));

        const sys = `You are the HCP in a pharma role-play conversation. Respond as a realistic stakeholder.

Hard requirements:
- Keep reply concise (1-4 short paragraphs).
- Stay within the scenario implied by the conversation; do not invent clinical claims.
- Generate 0-3 observable signals from the rep's last message (type: "verbal"|"conversational"|"engagement"|"contextual").

Return JSON ONLY:
{
  "reply": string,
  "eqAnalysis": {
    "score": number,
    "strengths": string[],
    "improvements": string[],
    "frameworksUsed": string[]
  },
  "signals": Array<{"type":string,"signal":string,"interpretation":string,"evidence"?:string,"suggestedResponse"?:string}>
}
No code fences, no extra keys.`;

        const parsed = await providerChatJson<any>(env, [{ role: "system", content: sys }, ...mapped], { maxTokens: 800, temperature: 0.6 });
        const reply = typeof parsed?.reply === "string" && parsed.reply.trim() ? parsed.reply.trim() : "Acknowledged. Let's continue.";
        const eq = parsed?.eqAnalysis && typeof parsed.eqAnalysis === "object" ? parsed.eqAnalysis : null;

        const eqAnalysis = {
            score: typeof eq?.score === "number" ? eq.score : 80,
            strengths: Array.isArray(eq?.strengths) ? eq.strengths.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 6) : ["Empathy", "Clarity"],
            improvements: Array.isArray(eq?.improvements) ? eq.improvements.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 6) : ["Ask more discovery questions"],
            frameworksUsed: Array.isArray(eq?.frameworksUsed) ? eq.frameworksUsed.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim()).slice(0, 6) : ["active-listening"],
        };

        const signals = normalizeSignals(parsed?.signals || []);

        return { reply, eqAnalysis, signals };
    } catch (e: any) {
        return {
            reply: `Acknowledged. Let's continue. (${e.message})`,
            eqAnalysis: {
                score: 75,
                strengths: ["Empathy"],
                improvements: ["More discovery"],
                frameworksUsed: ["rapport-building"],
            },
            signals: [],
        };
    }
}

async function analyzeConversation(env: Env, messages: ChatMessage[]) {
    try {
        const prompt = `Provide a concise roleplay analysis JSON with fields overallScore, eqScore, technicalScore, strengths[], areasForImprovement[], frameworksApplied[], recommendations[]. Messages: ${messages.map((m) => `${m.role}: ${m.content}`).join(" | ")}`;
        const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 500 });
        return safeJsonParse<any>(content);
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

async function knowledgeAnswer(env: Env, question: string, articleContext?: string) {
    try {
        const prompt = `Answer the question concisely with factual rigor. If articleContext is provided, ground to it. Question: ${question} Context: ${articleContext || "none"}`;
        const answer = await providerChat(env, [{ role: "system", content: prompt }], { maxTokens: 300 });
        return answer.trim();
    } catch (e: any) {
        return `Unable to retrieve answer: ${e.message}`;
    }
}

async function dashboardInsights(env: Env) {
    const presets = getInsightPresets();
    const fallbackPreset = presets[Math.floor(Date.now() / (1000 * 60)) % presets.length];
    try {
        const prompt = `Return JSON ONLY with fields: {
            "dailyTip": string (2-4 sentences, actionable EI coaching for life sciences, include why it matters),
            "focusArea": string (one of: "Active Listening", "Emotional Intelligence", "Discovery", "Objection Handling", "Storytelling"),
            "suggestedExercise": { "title": string (<=80 chars), "description": string (2-4 steps, practical action for next call) },
            "motivationalQuote": string (short, emotionally intelligent, no attribution)
        }
        Keep tone: specific, pharma/biotech stakeholder-facing, concise but substantive.
        Do NOT include attribution. Do NOT wrap in code fences.`;

        const res = await providerChat(env, [{ role: "system", content: prompt }], {
            responseFormat: { type: "json_object" },
            maxTokens: 700,
            temperature: 0.65,
        });
        const parsed = safeJsonParse<any>(res);
        const out = normalizeInsights(parsed, undefined, presets, fallbackPreset);
        (out as any).source = "ai";
        return out;
    } catch (e: any) {
        const out = normalizeInsights(fallbackPreset, `fallback: ${e.message}`, presets, fallbackPreset);
        (out as any).source = "preset";
        return out;
    }
}

function normalizeInsights(raw: any, error?: string, presets?: Array<any>, fallbackPreset?: any) {
    const preset = fallbackPreset || (presets?.length ? presets[0] : undefined);
    const safe = {
        dailyTip:
            typeof raw?.dailyTip === "string" && raw.dailyTip.trim()
                ? raw.dailyTip.trim()
                : preset?.dailyTip || "Lead with empathy and clarity in every stakeholder conversation.",
        focusArea:
            typeof raw?.focusArea === "string" && raw.focusArea.trim()
                ? raw.focusArea.trim()
                : preset?.focusArea || "Emotional Intelligence",
        suggestedExercise:
            raw?.suggestedExercise && typeof raw.suggestedExercise === "object"
                ? {
                    title:
                        typeof raw.suggestedExercise.title === "string" && raw.suggestedExercise.title.trim()
                            ? raw.suggestedExercise.title.trim()
                            : preset?.suggestedExercise?.title || "Mindful Moment",
                    description:
                        typeof raw.suggestedExercise.description === "string" && raw.suggestedExercise.description.trim()
                            ? raw.suggestedExercise.description.trim()
                            : preset?.suggestedExercise?.description || "Take 5 minutes post-call to jot 3 highlights and 1 improvement.",
                }
                : {
                    title: preset?.suggestedExercise?.title || "Mindful Moment",
                    description: preset?.suggestedExercise?.description || "Take 5 minutes post-call to jot 3 highlights and 1 improvement.",
                },
        motivationalQuote:
            typeof raw?.motivationalQuote === "string" && raw.motivationalQuote.trim()
                ? raw.motivationalQuote.trim()
                : preset?.motivationalQuote || "Growth happens outside your comfort zone.",
    } as any;

    // Strengthen outputs by falling back to preset if too short or missing detail
    if (safe.dailyTip.length < 140 && preset?.dailyTip) {
        safe.dailyTip = preset.dailyTip;
    }
    if (safe.suggestedExercise.description.length < 160 && preset?.suggestedExercise?.description) {
        safe.suggestedExercise = preset.suggestedExercise;
    }
    if (safe.motivationalQuote.length < 80 && preset?.motivationalQuote) {
        safe.motivationalQuote = preset.motivationalQuote;
    }

    if (error) {
        safe.error = error;
    }
    return safe;
}

function getInsightPresets() {
    return [
        {
            dailyTip: "Take time today to research your client's recent activities and news to tailor your engagement to their immediate needs.",
            focusArea: "Active Listening",
            suggestedExercise: {
                title: "5-Minute Sales Story Reflection",
                description: "After each client interaction, jot the main points without notes. This boosts recall and reinforces active listening.",
            },
            motivationalQuote: "Success is not just about making sales; it's about building relationships where value is mutual and lasting.",
        },
        {
            dailyTip: "Lead with the clinical why before the product what; keep it to one sentence.",
            focusArea: "Storytelling",
            suggestedExercise: {
                title: "One-Sentence Value",
                description: "Draft a single sentence linking the therapy to the HCP’s patient outcome priority. Rehearse it twice.",
            },
            motivationalQuote: "Clarity beats complexity in every conversation.",
        },
        {
            dailyTip: "Surface objections early: ask what could prevent adoption, then address it calmly.",
            focusArea: "Objection Handling",
            suggestedExercise: {
                title: "Objection Map",
                description: "List the top 2 objections you expect. Write one empathetic acknowledgment and one data-backed response for each.",
            },
            motivationalQuote: "Objections are signals, not setbacks.",
        },
        {
            dailyTip: "End every call with a mutual micro-commitment: timing, data, or a follow-up stakeholder.",
            focusArea: "Discovery",
            suggestedExercise: {
                title: "Next-Step Close",
                description: "Before ending the call, confirm one concrete next step and who owns it. Keep it under 15 seconds.",
            },
            motivationalQuote: "Small consistent steps create momentum.",
        },
        {
            dailyTip: "Check emotional temperature: name the sentiment you observe, then ask a gentle check-in question.",
            focusArea: "Emotional Intelligence",
            suggestedExercise: {
                title: "Feel-Name-Ask",
                description: "Practice: ‘It sounds like there’s concern about X—did I get that right?’ Pause and listen fully.",
            },
            motivationalQuote: "Listening with intent changes the outcome.",
        },
    ];
}

async function dailyFocus(
    env: Env,
    args: {
        date: string;
        role?: string;
        specialty?: string;
        recentMessages: ChatMessage[];
        recentSignals: any[];
        previousFocus?: string;
    }
) {
    const presets = getFocusPresets();
    const fallbackPreset = presets[Math.floor(Date.now() / (1000 * 60 * 10)) % presets.length];
    try {
        const transcript = (args.recentMessages || [])
            .slice(-24)
            .map((m, idx) => `${idx + 1}. ${m.role}: ${m.content}`)
            .join("\n");

                const sys = `You are ReflectivAI, an AI Sales Coach for life sciences/pharma.

Task: Generate "Today's Focus" for ${args.date}.

Inputs you may use:
- Optional role/context: ${args.role ? String(args.role) : "(none)"}
- Optional specialty context: ${args.specialty ? String(args.specialty) : "(none)"}
- Recent session transcript (may be empty)
- Recent Signal Intelligence items (may be empty)
- Previous focus (avoid repeating)

Hard requirements:
- Must feel sales + EI intelligent (not generic).
- Ground to transcript/signals when available; otherwise generate a plausible focus for pharma sales.
- Avoid repeating previous focus phrasing.

Return JSON ONLY with fields:
{
    "title": string,
    "focus": string,
    "microTask": string,
    "reflection": string
}
Constraints:
- title: 3-7 words
- focus: 2-4 sentences, <= 520 chars total
- microTask: 1 sentence, concrete action
- reflection: a single question
- No code fences, no extra keys.
`;

        const user = `PreviousFocus: ${args.previousFocus || "(none)"}
\nRecentSignals: ${JSON.stringify(Array.isArray(args.recentSignals) ? args.recentSignals : [])}
\nTranscript:\n${transcript || "(no recent messages)"}`;

        const parsed = await providerChatJson<any>(env, [{ role: "system", content: sys }, { role: "user", content: user }], {
            maxTokens: 700,
            temperature: 0.85,
        });

        const out = normalizeFocus(parsed, undefined, presets, fallbackPreset);
        (out as any).source = "ai";

        const prev = typeof args.previousFocus === "string" ? args.previousFocus.trim().toLowerCase() : "";
        if (prev && typeof out?.focus === "string" && out.focus.trim().toLowerCase() === prev) {
            const altPreset = presets.find((p) => typeof p?.focus === "string" && p.focus.trim().toLowerCase() !== prev) || fallbackPreset;
            out.title = altPreset?.title || out.title;
            out.focus = altPreset?.focus || out.focus;
            out.microTask = altPreset?.microTask || out.microTask;
            out.reflection = altPreset?.reflection || out.reflection;
            (out as any).source = "preset";
        }
        return out;
    } catch (e: any) {
        const out = normalizeFocus(fallbackPreset, `fallback: ${e.message}`, presets, fallbackPreset);
        (out as any).source = "preset";
        return out;
    }
}

async function coachPromptBundle(
    env: Env,
    args: {
        date: string;
        diseaseState: string;
        specialty: string;
        hcpCategory: string;
        influenceDriver: string;
        recentMessages: ChatMessage[];
        recentSignals: any[];
        previous?: { conversationStarters: string[]; suggestedTopics: string[]; timestamp: string };
    }
): Promise<{ conversationStarters: string[]; suggestedTopics: string[]; timestamp: string }> {
    const transcript = (args.recentMessages || [])
        .slice(-18)
        .map((m, idx) => `${idx + 1}. ${m.role}: ${m.content}`)
        .join("\n");

    const sys = `You are ReflectivAI AI Coach. Generate context-aware prompts for a pharma sales professional.

Context:
- diseaseState: ${args.diseaseState || "(none)"}
- specialty: ${args.specialty || "(none)"}
- hcpCategory: ${args.hcpCategory || "(none)"}
- influenceDriver: ${args.influenceDriver || "(none)"}
- date: ${args.date}

Hard requirements:
- Generate 3 Conversation Starters (short, actionable, phrased as the user speaking to the coach).
- Generate Suggested Topics (6 items) that are different from the starters (no overlap or near-duplicates).
- Use transcript/signals when available; otherwise still be specific to the context.
- Avoid generic advice ("ask open-ended questions") unless highly tailored.
- No compliance violations; do not request PHI.

Return JSON ONLY:
{
  "conversationStarters": string[3],
  "suggestedTopics": string[6]
}
No extra keys, no code fences.
`;

    const user = `PreviousBundle (avoid repeating): ${JSON.stringify(args.previous || null)}
\nRecentSignals: ${JSON.stringify(Array.isArray(args.recentSignals) ? args.recentSignals : [])}
\nTranscript:\n${transcript || "(no recent messages)"}`;

    const parsed = await providerChatJson<any>(env, [{ role: "system", content: sys }, { role: "user", content: user }], {
        maxTokens: 700,
        temperature: 0.9,
    });

    const starters = Array.isArray(parsed?.conversationStarters)
        ? parsed.conversationStarters.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim())
        : [];
    const topics = Array.isArray(parsed?.suggestedTopics)
        ? parsed.suggestedTopics.filter((x: any) => typeof x === "string" && x.trim()).map((s: string) => s.trim())
        : [];

    const norm = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();

    const isNearDuplicate = (a: string, b: string) => {
        const na = norm(a);
        const nb = norm(b);
        if (!na || !nb) return false;
        if (na === nb) return true;
        if (na.length >= 12 && (na.includes(nb) || nb.includes(na))) return true;
        return false;
    };

    const uniqNear = (arr: string[]) => {
        const out: string[] = [];
        for (const item of arr) {
            if (!item) continue;
            if (out.some((x) => isNearDuplicate(x, item))) continue;
            out.push(item);
        }
        return out;
    };

    const cleanedStarters = uniqNear(starters).slice(0, 3);
    const cleanedTopics = uniqNear(topics).filter((t) => !cleanedStarters.some((s) => isNearDuplicate(s, t)));

    return {
        conversationStarters: cleanedStarters,
        suggestedTopics: cleanedTopics.slice(0, 6),
        timestamp: new Date().toISOString(),
    };
}

function normalizeFocus(raw: any, error?: string, presets?: Array<any>, fallbackPreset?: any) {
    const preset = fallbackPreset || (presets?.length ? presets[0] : undefined);
    const safe = {
        title:
            typeof raw?.title === "string" && raw.title.trim()
                ? raw.title.trim().slice(0, 60)
                : preset?.title || "Customer Listening",
        focus:
            typeof raw?.focus === "string" && raw.focus.trim()
                ? raw.focus.trim().slice(0, 520)
                : preset?.focus || "Use open-ended questions and mirror one key phrase to show you heard their concern.",
        microTask:
            typeof raw?.microTask === "string" && raw.microTask.trim()
                ? raw.microTask.trim().slice(0, 220)
                : preset?.microTask || "In your next interaction, mirror one key phrase and pause for a full 2 seconds before responding.",
        reflection:
            typeof raw?.reflection === "string" && raw.reflection.trim()
                ? raw.reflection.trim().slice(0, 220)
                : preset?.reflection || "What did the HCP care most about that I almost missed?",
        timestamp: new Date().toISOString(),
    } as any;
    if (error) safe.error = error;
    return safe;
}

function getFocusPresets() {
    return [
        {
            title: "Active Listening",
            focus: "Use open-ended questions and mirror one key phrase to show you heard their concern.",
            microTask: "In your next interaction, mirror one key phrase and pause for a full 2 seconds before responding.",
            reflection: "Where did I assume, instead of clarifying?",
        },
        {
            title: "Clinical Why First",
            focus: "Share one clinical insight tied to their patient population before discussing product specifics.",
            microTask: "Write a one-sentence 'clinical why' opener and rehearse it twice before your next call.",
            reflection: "Did I lead with outcomes or features today?",
        },
        {
            title: "Objection Prep",
            focus: "List the top two objections you expect and prep a calm acknowledgment plus a data point for each.",
            microTask: "Draft two empathy-first acknowledgments and pair each with one evidence point you can cite.",
            reflection: "Which objection do I get defensive about, and why?",
        },
        {
            title: "Next Step Close",
            focus: "Close every call with a single, mutual next step and who owns it—keep it under 15 seconds.",
            microTask: "End your next conversation by confirming one next step and who owns it in one sentence.",
            reflection: "What would make the next step feel easier for them?",
        },
        {
            title: "EI Check-In",
            focus: "Name the sentiment you observe in the conversation and ask a gentle check-in question to confirm it.",
            microTask: "Use one 'check-in' question: 'How are you feeling about X right now?' and then listen without interrupting.",
            reflection: "What did I do that increased trust in the last 2 minutes?",
        },
    ];
}

async function frameworkAdvice(env: Env, frameworkName: string, situation: string) {
    try {
        const prompt = `Provide advice using framework ${frameworkName} for this situation: ${situation}. Keep it concise and actionable.`;
        const advice = await providerChat(env, [{ role: "system", content: prompt }], { maxTokens: 250 });
        return advice.trim();
    } catch (e: any) {
        return `Advice unavailable: ${e.message}`;
    }
}

async function customizeHeuristic(env: Env, name: string, pattern: string, situation: string) {
    try {
        const prompt = `Customize the heuristic ${name} with pattern "${pattern}" for situation: ${situation}. Return only the customized template text.`;
        const text = await providerChat(env, [{ role: "system", content: prompt }], { maxTokens: 200 });
        return text.trim();
    } catch (e: any) {
        return `${name}: ${pattern}`;
    }
}

async function moduleExercise(env: Env, title: string, description: string, type: string) {
    try {
        const prompt = `Generate a short ${type} exercise for module ${title}. Include JSON with title,instructions,content:[{prompt,choices,correctAnswer,explanation}]`;
        const content = await providerChat(env, [{ role: "system", content: prompt }], { responseFormat: { type: "json_object" }, maxTokens: 500 });
        return safeJsonParse<any>(content);
    } catch (e: any) {
        return {
            title: `${title} Exercise`,
            instructions: description || "Select the best answer",
            content: [
                {
                    prompt: `What is the best next step in ${title}?`,
                    choices: ["Acknowledge concern", "Push harder", "Ignore objection", "Avoid cost talk"],
                    correctAnswer: "Acknowledge concern",
                    explanation: "Acknowledging builds trust before addressing objections.",
                },
            ],
        };
    }
}

async function liveEqAnalysis(env: Env, messages: ChatMessage[]) {
    try {
        const userMessages = messages.filter(m => m.role === "user");
        if (userMessages.length === 0) {
            return {
                empathy: 0,
                adaptability: 0,
                curiosity: 0,
                resilience: 0,
            };
        }

        const transcript = messages.map((m, idx) => `${idx + 1}. ${m.role}: ${m.content}`).join("\n");
        const sys = `Analyze the sales rep's demonstrated emotional intelligence. Score these 4 metrics (0-5 scale):
- empathy: ability to recognize and respond to HCP concerns
- adaptability: flexibility in adjusting approach based on signals
- curiosity: asking discovery questions vs. pushing agenda
- resilience: composure when facing objections

Return JSON ONLY: {"empathy": number, "adaptability": number, "curiosity": number, "resilience": number}`;

        const parsed = await providerChatJson<any>(env, [{ role: "system", content: sys }, { role: "user", content: transcript }], { maxTokens: 200, temperature: 0.3 });
        
        return {
            empathy: typeof parsed?.empathy === "number" ? Math.min(5, Math.max(0, parsed.empathy)) : 3,
            adaptability: typeof parsed?.adaptability === "number" ? Math.min(5, Math.max(0, parsed.adaptability)) : 3,
            curiosity: typeof parsed?.curiosity === "number" ? Math.min(5, Math.max(0, parsed.curiosity)) : 3,
            resilience: typeof parsed?.resilience === "number" ? Math.min(5, Math.max(0, parsed.resilience)) : 3,
        };
    } catch (e: any) {
        return {
            empathy: 3,
            adaptability: 3,
            curiosity: 3,
            resilience: 3,
        };
    }
}

function normalizeEndAnalysis(analysis: any) {
    // Preserve existing analysis object, add missing fields expected by UI
    const normalized = { ...analysis };
    
    // Add eqScores if missing
    if (!Array.isArray(normalized.eqScores)) {
        normalized.eqScores = [];
    }
    
    // Add salesSkillScores if missing
    if (!Array.isArray(normalized.salesSkillScores)) {
        normalized.salesSkillScores = [];
    }
    
    // Add topStrengths if missing (fallback from strengths if available)
    if (!Array.isArray(normalized.topStrengths)) {
        normalized.topStrengths = Array.isArray(normalized.strengths) ? normalized.strengths : ["Clear communication"];
    }
    
    // Add priorityImprovements if missing (fallback from areasForImprovement if available)
    if (!Array.isArray(normalized.priorityImprovements)) {
        normalized.priorityImprovements = Array.isArray(normalized.areasForImprovement) 
            ? normalized.areasForImprovement 
            : (Array.isArray(normalized.improvements) ? normalized.improvements : ["Ask more discovery questions"]);
    }
    
    // Add nextSteps if missing (fallback from recommendations if available)
    if (!Array.isArray(normalized.nextSteps)) {
        normalized.nextSteps = Array.isArray(normalized.recommendations) 
            ? normalized.recommendations 
            : ["Practice active listening", "Focus on discovery questions"];
    }
    
    return normalized;
}
