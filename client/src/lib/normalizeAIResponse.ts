/**
 * P0 FIX: Normalize AI responses to handle ANY format (JSON, markdown, plain text)
 * NEVER throws - always returns displayable text
 */
export function normalizeAIResponse(raw: unknown): { text: string; json?: any } {
  const s = typeof raw === "string" ? raw : raw ? JSON.stringify(raw) : "";
  if (!s) return { text: "" };

  // Strategy 1: Direct JSON parse
  try {
    const j = JSON.parse(s);
    if (j && typeof j === "object") {
      const text = j.answer || j.text || j.message || j.content || JSON.stringify(j);
      return { text, json: j };
    }
  } catch {}

  // Strategy 2: Extract from markdown code block ```json ... ```
  const codeBlock = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlock?.[1]) {
    const inner = codeBlock[1].trim();
    try {
      const j = JSON.parse(inner);
      if (j && typeof j === "object") {
        const text = j.answer || j.text || j.message || j.content || inner;
        return { text, json: j };
      }
    } catch {
      if (inner) return { text: inner };
    }
  }

  // Strategy 3: Find first JSON-like object anywhere in response
  const jsonLike = s.match(/\{[\s\S]*\}/);
  if (jsonLike?.[0]) {
    try {
      const j = JSON.parse(jsonLike[0]);
      if (j && typeof j === "object") {
        const text = j.answer || j.text || j.message || j.content || s;
        return { text, json: j };
      }
    } catch {}
  }

  // FINAL FALLBACK: Raw text is ALWAYS valid
  return { text: s };
}
