/**
 * Observable Cues Detection
 * Detects behavioral signals in conversation text without inferring sentiment or intent
 * Uses simple phrase matching to identify observable patterns
 */

export type ObservableCue = {
  type: string;        // e.g. "time_pressure", "confusion", "disinterest", "engagement"
  label: string;       // human-readable label
  description?: string;
  source: "rep" | "hcp";
};

/**
 * Detect observable cues in a message
 * @param text - The message content
 * @param role - The speaker role ("user" = rep, "assistant" = HCP)
 * @returns Array of detected cues
 */
export function detectObservableCues(text: string, role: "user" | "assistant"): ObservableCue[] {
  const cues: ObservableCue[] = [];
  const lowerText = text.toLowerCase();
  const source = role === "user" ? "rep" : "hcp";

  // HCP Cues
  if (role === "assistant") {
    // Time pressure cues
    if (
      lowerText.includes("have to go") ||
      lowerText.includes("another meeting") ||
      lowerText.includes("short on time") ||
      lowerText.includes("running late") ||
      lowerText.includes("need to wrap up") ||
      lowerText.includes("only have a few minutes")
    ) {
      cues.push({
        type: "time_pressure",
        label: "Time Pressure",
        description: "HCP indicates time constraints",
        source,
      });
    }

    // Confusion cues
    if (
      lowerText.includes("don't understand") ||
      lowerText.includes("not sure what you mean") ||
      lowerText.includes("confused") ||
      lowerText.includes("can you clarify") ||
      lowerText.includes("what do you mean by")
    ) {
      cues.push({
        type: "confusion",
        label: "Confusion",
        description: "HCP seeks clarification",
        source,
      });
    }

    // Disinterest cues (only when combined with short responses)
    const isShortResponse = text.trim().split(/\s+/).length <= 3;
    if (
      isShortResponse &&
      (lowerText === "okay." ||
        lowerText === "fine." ||
        lowerText === "whatever." ||
        lowerText === "sure." ||
        lowerText === "ok.")
    ) {
      cues.push({
        type: "disinterest",
        label: "Disinterest",
        description: "HCP provides minimal response",
        source,
      });
    }

    // Engagement cues
    if (
      lowerText.includes("tell me more") ||
      lowerText.includes("how does that work") ||
      lowerText.includes("interesting") ||
      lowerText.includes("that's helpful") ||
      lowerText.includes("i'd like to know") ||
      lowerText.includes("can you explain") ||
      lowerText.includes("what about") ||
      lowerText.includes("how would")
    ) {
      cues.push({
        type: "engagement",
        label: "Engagement",
        description: "HCP shows active interest",
        source,
      });
    }

    // Objection cues
    if (
      lowerText.includes("but") ||
      lowerText.includes("however") ||
      lowerText.includes("concern") ||
      lowerText.includes("worried about") ||
      lowerText.includes("not sure about") ||
      lowerText.includes("problem with")
    ) {
      cues.push({
        type: "objection",
        label: "Objection",
        description: "HCP raises concern or objection",
        source,
      });
    }
  }

  // Rep Cues
  if (role === "user") {
    // Approach shift cues
    if (
      lowerText.includes("let's look at it this way") ||
      lowerText.includes("alternatively") ||
      lowerText.includes("another way to think about") ||
      lowerText.includes("from a different angle") ||
      lowerText.includes("let me try a different approach")
    ) {
      cues.push({
        type: "approach_shift",
        label: "Approach Shift",
        description: "Rep pivots strategy",
        source,
      });
    }

    // Empathic tone cues
    if (
      lowerText.includes("i understand") ||
      lowerText.includes("i hear you") ||
      lowerText.includes("that makes sense") ||
      lowerText.includes("i appreciate") ||
      lowerText.includes("that's a valid concern")
    ) {
      cues.push({
        type: "empathy",
        label: "Empathy",
        description: "Rep shows understanding",
        source,
      });
    }

    // Pacing adjustment cues
    if (
      lowerText.includes("to keep it brief") ||
      lowerText.includes("long story short") ||
      lowerText.includes("i'll send details later") ||
      lowerText.includes("let me summarize") ||
      lowerText.includes("in short")
    ) {
      cues.push({
        type: "pacing_adjustment",
        label: "Pacing Adjustment",
        description: "Rep adjusts conversation pace",
        source,
      });
    }

    // Question asking (discovery)
    if (
      lowerText.includes("?") &&
      (lowerText.includes("what") ||
        lowerText.includes("how") ||
        lowerText.includes("why") ||
        lowerText.includes("when") ||
        lowerText.includes("where") ||
        lowerText.includes("tell me about"))
    ) {
      cues.push({
        type: "discovery_question",
        label: "Discovery Question",
        description: "Rep asks open-ended question",
        source,
      });
    }
  }

  // Deduplicate by type (keep first occurrence)
  const seen = new Set<string>();
  return cues.filter((cue) => {
    if (seen.has(cue.type)) return false;
    seen.add(cue.type);
    return true;
  });
}

/**
 * Get a color class for a cue type (for badge styling)
 */
export function getCueColor(cueType: string): string {
  const colorMap: Record<string, string> = {
    time_pressure: "bg-amber-100 text-amber-900",
    confusion: "bg-blue-100 text-blue-900",
    disinterest: "bg-gray-100 text-gray-900",
    engagement: "bg-green-100 text-green-900",
    objection: "bg-red-100 text-red-900",
    approach_shift: "bg-purple-100 text-purple-900",
    empathy: "bg-teal-100 text-teal-900",
    pacing_adjustment: "bg-indigo-100 text-indigo-900",
    discovery_question: "bg-cyan-100 text-cyan-900",
  };
  return colorMap[cueType] ?? "bg-gray-100 text-gray-900";
}
