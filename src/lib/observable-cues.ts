/**
 * 🚨 CRITICAL FIX: Observable Cues Detection
 * 
 * FUNDAMENTAL PRINCIPLE:
 * - Sales Rep Cues = Evaluate what the REP does (role === "user")
 * - HCP Cues = Context signals from HCP that rep should respond to (role === "assistant")
 * - ONLY the sales rep is being evaluated!
 * - HCP cues are observable signals (frustration, time pressure, etc.) that appear
 *   below the HCP's message so the rep can see and adapt their response
 */

export type CueType =
  // SALES REP CUES (Evaluation - what the rep does)
  | "question-quality"
  | "active-listening"
  | "value-articulation"
  | "objection-handling"
  | "discovery"
  | "closing"
  | "relationship-building"
  | "adaptability"
  | "approach-shift"
  | "pacing-adjustment"
  // HCP CUES (Context signals - what the rep should respond to)
  | "time-pressure"
  | "frustration"
  | "confusion"
  | "low-engagement"
  | "workload-stress"
  | "skepticism"
  | "interest"
  | "concern";

export type CueVariant = "positive" | "negative" | "informational";

export interface ObservableCue {
  type: CueType;
  label: string;
  description: string;
  confidence: "high" | "medium" | "low";
  variant: CueVariant;
}

/**
 * Detect observable cues from conversation messages
 * 
 * @param content - Message content
 * @param role - "user" (sales rep) or "assistant" (HCP)
 * @returns Array of detected cues
 */
export function detectObservableCues(
  content: string,
  role: "user" | "assistant"
): ObservableCue[] {
  const cues: ObservableCue[] = [];
  const lower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;

  // ========================================================================
  // SALES REP CUES (role === "user")
  // These evaluate what the SALES REP does
  // ========================================================================
  if (role === "user") {
    // Question Quality - Rep asks open-ended questions
    if (
      lower.includes("how") ||
      lower.includes("what") ||
      lower.includes("why") ||
      lower.includes("tell me more") ||
      lower.includes("can you describe") ||
      lower.includes("help me understand")
    ) {
      cues.push({
        type: "question-quality",
        label: "Question Quality",
        description: "Rep asked open-ended question",
        confidence: "high",
        variant: "positive",
      });
    }

    // Active Listening - Rep paraphrases or acknowledges
    if (
      lower.includes("i hear") ||
      lower.includes("what i'm hearing") ||
      lower.includes("it sounds like") ||
      lower.includes("if i understand correctly") ||
      lower.includes("so you're saying") ||
      lower.includes("let me make sure i understand")
    ) {
      cues.push({
        type: "active-listening",
        label: "Active Listening",
        description: "Rep demonstrated active listening",
        confidence: "high",
        variant: "positive",
      });
    }

    // Value Articulation - Rep connects to outcomes
    if (
      lower.includes("this helps you") ||
      lower.includes("this enables") ||
      lower.includes("the benefit is") ||
      lower.includes("this means you can") ||
      lower.includes("impact on your") ||
      lower.includes("result in")
    ) {
      cues.push({
        type: "value-articulation",
        label: "Value Articulation",
        description: "Rep articulated value/outcomes",
        confidence: "high",
        variant: "positive",
      });
    }

    // Objection Handling - Rep acknowledges concerns
    if (
      lower.includes("i understand that") ||
      lower.includes("that's a fair point") ||
      lower.includes("i appreciate that concern") ||
      lower.includes("that's a valid concern") ||
      lower.includes("i hear your concern")
    ) {
      cues.push({
        type: "objection-handling",
        label: "Objection Handling",
        description: "Rep acknowledged concern/objection",
        confidence: "high",
        variant: "positive",
      });
    }

    // Discovery - Rep explores needs
    if (
      lower.includes("what are your priorities") ||
      lower.includes("what's most important") ||
      lower.includes("what challenges") ||
      lower.includes("what's your biggest concern") ||
      lower.includes("walk me through")
    ) {
      cues.push({
        type: "discovery",
        label: "Discovery",
        description: "Rep explored needs/priorities",
        confidence: "high",
        variant: "positive",
      });
    }

    // Closing - Rep proposes next steps
    if (
      lower.includes("next step") ||
      lower.includes("shall we") ||
      lower.includes("would you like to") ||
      lower.includes("can we schedule") ||
      lower.includes("let's move forward") ||
      lower.includes("does that work for you")
    ) {
      cues.push({
        type: "closing",
        label: "Closing",
        description: "Rep proposed next steps/commitment",
        confidence: "high",
        variant: "positive",
      });
    }

    // Relationship Building - Rep builds rapport
    if (
      lower.includes("i appreciate your time") ||
      lower.includes("thank you for sharing") ||
      lower.includes("i value your perspective") ||
      lower.includes("i understand your situation")
    ) {
      cues.push({
        type: "relationship-building",
        label: "Relationship Building",
        description: "Rep built rapport/trust",
        confidence: "high",
        variant: "positive",
      });
    }

    // Adaptability - Rep pivots approach
    if (
      lower.includes("let me try a different approach") ||
      lower.includes("let's look at it this way") ||
      lower.includes("alternatively") ||
      lower.includes("another way to think about")
    ) {
      cues.push({
        type: "approach-shift",
        label: "Approach Shift",
        description: "Rep adapted strategy",
        confidence: "high",
        variant: "positive",
      });
    }

    // Pacing Adjustment - Rep adjusts pace
    if (
      lower.includes("to keep it brief") ||
      lower.includes("long story short") ||
      lower.includes("in summary") ||
      lower.includes("let me send details later")
    ) {
      cues.push({
        type: "pacing-adjustment",
        label: "Pacing Adjustment",
        description: "Rep adjusted conversation pace",
        confidence: "high",
        variant: "positive",
      });
    }
  }

  // ========================================================================
  // HCP CUES (role === "assistant")
  // These are CONTEXT SIGNALS that the rep should respond to
  // These appear BELOW the HCP's message so the rep can see and adapt
  // ========================================================================
  if (role === "assistant") {
    // Time Pressure - HCP indicates time constraints
    if (
      lower.includes("have to go") ||
      lower.includes("another meeting") ||
      lower.includes("short on time") ||
      lower.includes("running late") ||
      lower.includes("only have a few minutes") ||
      lower.includes("another patient") ||
      lower.includes("need to wrap up")
    ) {
      cues.push({
        type: "time-pressure",
        label: "Time Pressure",
        description: "HCP shows time constraints (glances at clock, mentions schedule)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Frustration - HCP shows frustration signals
    if (
      lower.includes("frustrated") ||
      lower.includes("this is difficult") ||
      lower.includes("not helpful") ||
      lower.includes("already tried") ||
      lower.includes("doesn't work") ||
      (lower.includes("sigh") || lower.includes("*sighs*")) ||
      wordCount < 8 && (lower.includes("fine") || lower.includes("whatever"))
    ) {
      cues.push({
        type: "frustration",
        label: "Frustration",
        description: "HCP shows frustration (sighing, short responses, crossed arms)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Confusion - HCP needs clarification
    if (
      lower.includes("don't understand") ||
      lower.includes("not sure i follow") ||
      lower.includes("confused") ||
      lower.includes("unclear") ||
      lower.includes("can you clarify") ||
      lower.includes("what do you mean") ||
      lower.includes("explain that again")
    ) {
      cues.push({
        type: "confusion",
        label: "Confusion",
        description: "HCP needs clarification (delayed responses, asks for explanation)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Low Engagement - HCP shows disinterest
    if (
      (wordCount < 5 &&
        (lower.trim() === "okay" ||
          lower.trim() === "fine" ||
          lower.trim() === "sure" ||
          lower.trim() === "ok" ||
          lower.trim() === "yeah")) ||
      lower.includes("not really interested") ||
      lower.includes("don't see the value")
    ) {
      cues.push({
        type: "low-engagement",
        label: "Low Engagement",
        description: "HCP shows minimal engagement (short responses, multitasking, avoiding eye contact)",
        confidence: "medium",
        variant: "informational",
      });
    }

    // Workload Stress - HCP expresses workload concerns
    if (
      lower.includes("too many prior auth") ||
      lower.includes("overwhelmed with paperwork") ||
      lower.includes("administrative burden") ||
      lower.includes("too much paperwork") ||
      lower.includes("already swamped") ||
      lower.includes("don't have time for more")
    ) {
      cues.push({
        type: "workload-stress",
        label: "Workload Stress",
        description: "HCP expresses workload concerns (shoulders hunched, mentions being overwhelmed)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Skepticism - HCP shows doubt
    if (
      lower.includes("i doubt") ||
      lower.includes("not convinced") ||
      lower.includes("heard that before") ||
      lower.includes("prove it") ||
      lower.includes("show me evidence") ||
      lower.includes("skeptical")
    ) {
      cues.push({
        type: "skepticism",
        label: "Skepticism",
        description: "HCP shows skepticism (flat vocal delivery, body turned away)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Interest - HCP shows positive engagement
    if (
      lower.includes("tell me more") ||
      lower.includes("that's interesting") ||
      lower.includes("how does that work") ||
      lower.includes("i'd like to know") ||
      lower.includes("sounds promising")
    ) {
      cues.push({
        type: "interest",
        label: "Interest",
        description: "HCP shows interest (leaning forward, asking follow-up questions)",
        confidence: "high",
        variant: "positive",
      });
    }

    // Concern - HCP raises specific concern
    if (
      lower.includes("concerned about") ||
      lower.includes("worry about") ||
      lower.includes("what about") ||
      lower.includes("but what if")
    ) {
      cues.push({
        type: "concern",
        label: "Concern",
        description: "HCP raises specific concern",
        confidence: "high",
        variant: "informational",
      });
    }
  }

  // Deduplicate by type
  const seen = new Set<CueType>();
  return cues.filter((cue) => {
    if (seen.has(cue.type)) return false;
    seen.add(cue.type);
    return true;
  });
}
