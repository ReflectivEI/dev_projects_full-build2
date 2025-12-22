// ReflectivAI API Compatibility Worker
// Implements /api/* routes expected by the frontend without modifying frontend code.

export interface Env {
  SESS: KVNamespace;
  CORS_ORIGINS?: string;
}

type Role = "user" | "assistant" | "stakeholder";

type ChatMessage = {
  role: Role;
  content: string;
  timestamp?: string;
};

type SQLQuery = {
  id: string;
  naturalLanguage: string;
  sqlQuery: string;
  explanation?: string;
  timestamp: string;
};

type RoleplaySession = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  stakeholderName: string;
  stakeholderRole: string;
  difficulty: string;
  messages: ChatMessage[];
};

type State = {
  chatMessages: ChatMessage[];
  sqlQueries: SQLQuery[];
  roleplaySession: RoleplaySession | null;
};

const DEFAULT_STATE: State = {
  chatMessages: [],
  sqlQueries: [],
  roleplaySession: null,
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env, req) });
    }

    const headers = cors(env, req);

    try {
      // Route handling
      if (path === "/api/chat/messages" && req.method === "GET") {
        const state = await loadState(env, req);
        return json({ messages: state.chatMessages }, headers);
      }

      if (path === "/api/chat/send" && req.method === "POST") {
        const body = await readJson(req);
        const message = String(body?.message || "").trim();
        if (!message) return badRequest("message is required", headers);

        const state = await loadState(env, req);
        const ts = new Date().toISOString();
        state.chatMessages.push({ role: "user", content: message, timestamp: ts });
        state.chatMessages.push({
          role: "assistant",
          content: generateAssistantReply(message),
          timestamp: ts,
        });
        await saveState(env, req, state);
        return json({ messages: state.chatMessages }, headers);
      }

      if (path === "/api/chat/clear" && req.method === "POST") {
        const state = await loadState(env, req);
        state.chatMessages = [];
        await saveState(env, req, state);
        return json({ success: true, messages: [] }, headers);
      }

      if (path === "/api/chat/summary" && req.method === "POST") {
        const state = await loadState(env, req);
        const summary = buildChatSummary(state.chatMessages);
        return json(summary, headers);
      }

      if (path === "/api/sql/history" && req.method === "GET") {
        const state = await loadState(env, req);
        return json({ queries: state.sqlQueries }, headers);
      }

      if (path === "/api/sql/translate" && req.method === "POST") {
        const body = await readJson(req);
        const question = String(body?.question || "").trim();
        if (!question) return badRequest("question is required", headers);

        const state = await loadState(env, req);
        const sqlEntry: SQLQuery = {
          id: crypto.randomUUID(),
          naturalLanguage: question,
          sqlQuery: buildSql(question),
          explanation: "Deterministic SQL translation for demo purposes.",
          timestamp: new Date().toISOString(),
        };
        state.sqlQueries.unshift(sqlEntry);
        state.sqlQueries = state.sqlQueries.slice(0, 50);
        await saveState(env, req, state);
        return json(sqlEntry, headers);
      }

      if (path === "/api/roleplay/session" && req.method === "GET") {
        const state = await loadState(env, req);
        return json({ session: state.roleplaySession }, headers);
      }

      if (path === "/api/roleplay/start" && req.method === "POST") {
        const body = await readJson(req);
        const scenarioId = String(body?.scenarioId || "").trim();
        const difficulty = String(body?.difficulty || "").trim() || "intermediate";
        if (!scenarioId) return badRequest("scenarioId is required", headers);

        const state = await loadState(env, req);
        const session: RoleplaySession = {
          id: crypto.randomUUID(),
          scenarioId,
          scenarioTitle: `Scenario ${scenarioId}`,
          stakeholderName: "Dr. Jordan Lee",
          stakeholderRole: "HCP",
          difficulty,
          messages: [
            {
              role: "stakeholder",
              content: "Good to see you. What would you like to discuss today?",
              timestamp: new Date().toISOString(),
            },
          ],
        };
        state.roleplaySession = session;
        await saveState(env, req, state);
        return json({ session }, headers);
      }

      if (path === "/api/roleplay/respond" && req.method === "POST") {
        const body = await readJson(req);
        const message = String(body?.message || "").trim();
        if (!message) return badRequest("message is required", headers);

        const state = await loadState(env, req);
        if (!state.roleplaySession) return badRequest("no active session", headers);

        const ts = new Date().toISOString();
        state.roleplaySession.messages.push({ role: "user", content: message, timestamp: ts });
        const stakeholderResponse = buildStakeholderReply(message);
        state.roleplaySession.messages.push({ role: "assistant", content: stakeholderResponse, timestamp: ts });
        const eqAnalysis = buildEqAnalysis();
        await saveState(env, req, state);
        return json({ stakeholderResponse, eqAnalysis }, headers);
      }

      if (path === "/api/roleplay/end" && req.method === "POST") {
        const state = await loadState(env, req);
        const session = state.roleplaySession;
        if (!session) return badRequest("no active session", headers);

        const analysis = buildRoleplayAnalysis();
        const messages = session.messages;
        state.roleplaySession = null;
        await saveState(env, req, state);
        return json({ messages, analysis }, headers);
      }

      if (path === "/api/knowledge/ask" && req.method === "POST") {
        const body = await readJson(req);
        const question = String(body?.question || "").trim();
        if (!question) return badRequest("question is required", headers);
        return json({
          answer: `Here is a concise answer to: ${question}`,
          relatedTopics: ["Evidence", "Guidelines", "Patient impact"],
        }, headers);
      }

      if (path === "/api/frameworks/advice" && req.method === "POST") {
        const body = await readJson(req);
        const frameworkName = String(body?.frameworkName || body?.frameworkId || "Framework");
        const situation = String(body?.situation || "");
        return json({
          advice: `Apply ${frameworkName} to this situation: ${situation}`,
          practiceExercise: "Role-play the conversation focusing on the key pillars of the framework.",
          tips: ["Lead with empathy", "Stay concise", "Reinforce evidence"],
        }, headers);
      }

      if (path === "/api/heuristics/customize" && req.method === "POST") {
        const body = await readJson(req);
        const templateName = String(body?.templateName || "Template");
        const pattern = String(body?.templatePattern || "");
        const situation = String(body?.userSituation || "");
        return json({
          customizedTemplate: `${templateName}: ${pattern}`,
          example: `For this situation (${situation}), use the above structure with concrete data points and reassurance.`,
          tips: ["Acknowledge concern", "Share peer example", "Offer next step"],
        }, headers);
      }

      if (path === "/api/modules/exercise" && req.method === "POST") {
        const body = await readJson(req);
        const moduleTitle = String(body?.moduleTitle || "Module");
        return json({
          title: `${moduleTitle} Exercise`,
          instructions: "Select the best option for each question.",
          content: [
            {
              question: `What is the best next step in ${moduleTitle}?`,
              options: ["Ask an open question", "Push for commitment", "Share pricing first", "Avoid objections"],
              correctAnswer: "Ask an open question",
              explanation: "Open questions uncover needs before proposing solutions.",
            },
          ],
        }, headers);
      }

      return new Response("Not Found", { status: 404, headers });
    } catch (err: any) {
      return json({ error: "server_error", message: String(err?.message || err) }, headers, 500);
    }
  },
};

function cors(env: Env, req: Request): Headers {
  const reqOrigin = req.headers.get("Origin") || "";
  const allowlist = String(env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let allowOrigin = "*";
  if (reqOrigin && allowlist.length) {
    if (allowlist.includes(reqOrigin)) allowOrigin = reqOrigin;
  } else if (reqOrigin && !allowlist.length) {
    allowOrigin = reqOrigin;
  }

  const h = new Headers();
  h.set("Access-Control-Allow-Origin", allowOrigin);
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
  h.set("Access-Control-Allow-Credentials", "false");
  h.set("Vary", "Origin");
  return h;
}

async function loadState(env: Env, req: Request): Promise<State> {
  const key = sessionKey(req);
  if (!env.SESS) return { ...DEFAULT_STATE };
  try {
    const raw = await env.SESS.get(key);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as State;
    return {
      chatMessages: parsed.chatMessages || [],
      sqlQueries: parsed.sqlQueries || [],
      roleplaySession: parsed.roleplaySession || null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function saveState(env: Env, req: Request, state: State): Promise<void> {
  if (!env.SESS) return;
  const key = sessionKey(req);
  await env.SESS.put(key, JSON.stringify(state), { expirationTtl: 60 * 60 * 24 });
}

function sessionKey(req: Request): string {
  const url = new URL(req.url);
  const session = req.headers.get("x-session-id") || url.searchParams.get("session") || "anon";
  return `sess:${session}`;
}

async function readJson(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function json(body: unknown, headers: HeadersInit, status = 200): Response {
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers: h });
}

function badRequest(message: string, headers: HeadersInit): Response {
  return json({ error: "bad_request", message }, headers, 400);
}

function buildSql(question: string): string {
  const cleaned = question.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();
  return `SELECT * FROM sales_data WHERE MATCH(question) AGAINST ('${cleaned}') LIMIT 20;`;
}

function generateAssistantReply(message: string): string {
  return `Understood. Here are tailored next steps based on your request: ${message}`;
}

function buildChatSummary(messages: ChatMessage[]) {
  const last = messages[messages.length - 1]?.content || "the recent discussion";
  return {
    summary: `Summary of conversation about ${last}`,
    keyTakeaways: ["Clarified objective", "Outlined next steps", "Provided references"],
    skillsDiscussed: ["Active Listening", "Objection Handling"],
    actionItems: ["Follow up with tailored message", "Share supporting data"],
    nextSteps: "Try the Role-Play Simulator to practice these techniques.",
  };
}

function buildStakeholderReply(message: string): string {
  return `Thanks for sharing. Can you expand on: ${message}?`;
}

function buildEqAnalysis() {
  return {
    score: 82,
    strengths: ["Empathy", "Clarity"],
    improvements: ["Ask more discovery questions"],
    frameworksUsed: ["active-listening", "rapport-building"],
  };
}

function buildRoleplayAnalysis() {
  return {
    overallScore: 84,
    eqScore: 81,
    technicalScore: 86,
    strengths: ["Good rapport", "Clear value communication"],
    areasForImprovement: ["More open-ended questions", "Deeper discovery"],
    frameworksApplied: ["disc", "active-listening"],
    recommendations: ["Practice DISC adjustments", "Prepare data follow-ups"],
  };
}
