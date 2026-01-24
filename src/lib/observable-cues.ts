/**
 * Observable Cues Detection System
 * Enhanced with 10 real-world HCP behavioral cues
 * Last updated: 2026-01-24T10:30:00.000Z
 */

export type CueType =
  // SALES REP CUES (Evaluation - what we score)
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
  | "time-pressure"        // Cue #1: Glances at clock/doorway
  | "frustration"          // Cue #3: Sighing/exhaling
  | "confusion"
  | "low-engagement"       // Cue #2: Short, clipped responses
  | "workload-stress"
  | "skepticism"
  | "interest"
  | "concern"
  | "defensive"            // Cue #4: Arms crossed/hunched
  | "distracted"           // Cue #5: Multitasking
  | "hesitant"             // Cue #6: Delayed responses
  | "uncomfortable"        // Cue #7: Avoiding eye contact
  | "impatient"            // Cue #8: Interrupting
  | "disinterested"        // Cue #9: Flat/monotone delivery
  | "withdrawn";           // Cue #10: Body turned away

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
 * CRITICAL ARCHITECTURE:
 * - Sales Rep messages (role === "user") → EVALUATION cues (scored against metrics)
 * - HCP messages (role === "assistant") → CONTEXT cues (signals for rep to respond to)
 */
export function detectObservableCues(
  message: string,
  role: "user" | "assistant"
): ObservableCue[] {
  const cues: ObservableCue[] = [];
  const lower = message.toLowerCase();
  const wordCount = message.split(/\s+/).length;

  // ========================================================================
  // SALES REP CUES (role === "user")
  // These are EVALUATION signals - what we score the rep on
  // ========================================================================
  if (role === "user") {
    // Question Quality
    if (
      lower.includes("how") ||
      lower.includes("what") ||
      lower.includes("why") ||
      lower.includes("tell me about") ||
      lower.includes("could you explain") ||
      lower.includes("help me understand")
    ) {
      cues.push({
        type: "question-quality",
        label: "Question Quality",
        description: "Rep asks open-ended, probing questions",
        confidence: "high",
        variant: "positive",
      });
    }

    // Active Listening
    if (
      lower.includes("i hear you") ||
      lower.includes("it sounds like") ||
      lower.includes("if i understand correctly") ||
      lower.includes("you mentioned") ||
      lower.includes("let me make sure") ||
      lower.includes("so what you're saying")
    ) {
      cues.push({
        type: "active-listening",
        label: "Active Listening",
        description: "Rep demonstrates understanding and reflection",
        confidence: "high",
        variant: "positive",
      });
    }

    // Value Articulation
    if (
      lower.includes("benefit") ||
      lower.includes("help you") ||
      lower.includes("improve") ||
      lower.includes("solution") ||
      lower.includes("address your") ||
      lower.includes("specifically for")
    ) {
      cues.push({
        type: "value-articulation",
        label: "Value Articulation",
        description: "Rep clearly communicates product value",
        confidence: "high",
        variant: "positive",
      });
    }

    // Objection Handling
    if (
      lower.includes("i understand your concern") ||
      lower.includes("that's a valid point") ||
      lower.includes("let me address that") ||
      lower.includes("many doctors have said") ||
      lower.includes("what if we")
    ) {
      cues.push({
        type: "objection-handling",
        label: "Objection Handling",
        description: "Rep addresses concerns professionally",
        confidence: "high",
        variant: "positive",
      });
    }

    // Discovery
    if (
      lower.includes("current") ||
      lower.includes("challenge") ||
      lower.includes("process") ||
      lower.includes("experience with") ||
      lower.includes("typically")
    ) {
      cues.push({
        type: "discovery",
        label: "Discovery",
        description: "Rep explores HCP's situation and needs",
        confidence: "medium",
        variant: "positive",
      });
    }

    // Closing
    if (
      lower.includes("next step") ||
      lower.includes("would you like") ||
      lower.includes("shall we") ||
      lower.includes("can we schedule") ||
      lower.includes("move forward")
    ) {
      cues.push({
        type: "closing",
        label: "Closing",
        description: "Rep suggests concrete next actions",
        confidence: "high",
        variant: "positive",
      });
    }

    // Relationship Building
    if (
      lower.includes("appreciate") ||
      lower.includes("thank you") ||
      lower.includes("value your") ||
      lower.includes("respect your time") ||
      lower.includes("partnership")
    ) {
      cues.push({
        type: "relationship-building",
        label: "Relationship Building",
        description: "Rep builds rapport and trust",
        confidence: "medium",
        variant: "positive",
      });
    }

    // Adaptability
    if (
      lower.includes("let me adjust") ||
      lower.includes("different approach") ||
      lower.includes("perhaps instead") ||
      lower.includes("another way")
    ) {
      cues.push({
        type: "adaptability",
        label: "Adaptability",
        description: "Rep adjusts strategy based on HCP response",
        confidence: "high",
        variant: "positive",
      });
    }
  }

  // ========================================================================
  // HCP CUES (role === "assistant")
  // These are CONTEXT SIGNALS that the rep should respond to
  // These appear BELOW the HCP's message so the rep can see and adapt
  // ENHANCED WITH 10 REAL-WORLD BEHAVIORAL CUES
  // ========================================================================
  if (role === "assistant") {
    // CUE #1: Time Pressure - Glances at clock/doorway
    if (
      lower.includes("glances at") ||
      lower.includes("looks at clock") ||
      lower.includes("checks watch") ||
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

    // CUE #2: Low Engagement - Short, clipped responses
    if (
      wordCount < 8 &&
      (lower.includes("okay") ||
        lower.includes("sure") ||
        lower.includes("fine") ||
        lower.includes("yeah") ||
        lower.includes("uh-huh"))
    ) {
      cues.push({
        type: "low-engagement",
        label: "Low Engagement",
        description: "HCP gives minimal responses (short answers, lack of elaboration)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #3: Frustration - Sighing/exhaling audibly
    if (
      lower.includes("*sighs*") ||
      lower.includes("sighs") ||
      lower.includes("exhales") ||
      lower.includes("frustrated") ||
      lower.includes("this is difficult") ||
      lower.includes("not helpful") ||
      lower.includes("already tried") ||
      lower.includes("doesn't work")
    ) {
      cues.push({
        type: "frustration",
        label: "Frustration",
        description: "HCP shows frustration (sighing, short responses, crossed arms)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #4: Defensive - Arms crossed/shoulders hunched
    if (
      lower.includes("crosses arms") ||
      lower.includes("arms crossed") ||
      lower.includes("leans back") ||
      lower.includes("shoulders hunched") ||
      lower.includes("defensive posture") ||
      lower.includes("i don't think so") ||
      lower.includes("that won't work") ||
      lower.includes("we've tried that")
    ) {
      cues.push({
        type: "defensive",
        label: "Defensive",
        description: "HCP shows defensive body language (arms crossed, closed posture)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #5: Distracted - Multitasking behavior
    if (
      lower.includes("types") ||
      lower.includes("typing") ||
      lower.includes("checks phone") ||
      lower.includes("looks at screen") ||
      lower.includes("signs forms") ||
      (lower.includes("while") && (lower.includes("looking") || lower.includes("writing")))
    ) {
      cues.push({
        type: "distracted",
        label: "Distracted",
        description: "HCP is multitasking (typing, checking phone, signing forms)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #6: Hesitant - Delayed responses/long pauses
    if (
      lower.includes("pauses") ||
      lower.includes("long pause") ||
      lower.includes("hesitates") ||
      lower.includes("...") ||
      lower.includes("um") ||
      lower.includes("uh") ||
      lower.includes("well...") ||
      lower.includes("i'm not sure")
    ) {
      cues.push({
        type: "hesitant",
        label: "Hesitant",
        description: "HCP shows hesitation (long pauses, delayed responses)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #7: Uncomfortable - Avoidance of eye contact
    if (
      lower.includes("avoids eye contact") ||
      lower.includes("looks away") ||
      lower.includes("looks down") ||
      lower.includes("shifts uncomfortably") ||
      lower.includes("fidgets") ||
      lower.includes("uncomfortable")
    ) {
      cues.push({
        type: "uncomfortable",
        label: "Uncomfortable",
        description: "HCP shows discomfort (avoiding eye contact, fidgeting)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #8: Impatient - Interrupting mid-sentence
    if (
      lower.includes("interrupts") ||
      lower.includes("cuts off") ||
      lower.includes("wait, wait") ||
      lower.includes("hold on") ||
      lower.includes("let me stop you") ||
      lower.includes("i need to")
    ) {
      cues.push({
        type: "impatient",
        label: "Impatient",
        description: "HCP shows impatience (interrupting, redirecting conversation)",
        confidence: "high",
        variant: "informational",
      });
    }

    // CUE #9: Disinterested - Flat/monotone vocal delivery
    if (
      lower.includes("monotone") ||
      lower.includes("flat voice") ||
      lower.includes("disinterested tone") ||
      (wordCount < 10 && !lower.includes("?") && !lower.includes("!"))
    ) {
      cues.push({
        type: "disinterested",
        label: "Disinterested",
        description: "HCP shows lack of interest (flat tone, minimal engagement)",
        confidence: "medium",
        variant: "informational",
      });
    }

    // CUE #10: Withdrawn - Physically turning body away
    if (
      lower.includes("turns away") ||
      lower.includes("body turned") ||
      lower.includes("half-standing") ||
      lower.includes("chair angled") ||
      lower.includes("steps back") ||
      lower.includes("moves toward door")
    ) {
      cues.push({
        type: "withdrawn",
        label: "Withdrawn",
        description: "HCP physically withdraws (turning body away, moving toward exit)",
        confidence: "high",
        variant: "informational",
      });
    }

    // EXISTING CUES (kept for compatibility)
    
    // Confusion - HCP needs clarification
    if (
      lower.includes("don't understand") ||
      lower.includes("not sure i follow") ||
      lower.includes("confused") ||
      lower.includes("unclear") ||
      lower.includes("can you clarify") ||
      lower.includes("what do you mean")
    ) {
      cues.push({
        type: "confusion",
        label: "Confusion",
        description: "HCP needs clarification (furrowed brow, questioning look)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Workload Stress
    if (
      lower.includes("overwhelmed") ||
      lower.includes("too much") ||
      lower.includes("so many patients") ||
      lower.includes("busy day") ||
      lower.includes("swamped")
    ) {
      cues.push({
        type: "workload-stress",
        label: "Workload Stress",
        description: "HCP indicates high workload (mentions being busy, overwhelmed)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Skepticism
    if (
      lower.includes("not convinced") ||
      lower.includes("skeptical") ||
      lower.includes("doubt") ||
      lower.includes("really?") ||
      lower.includes("raises eyebrow") ||
      lower.includes("questionable")
    ) {
      cues.push({
        type: "skepticism",
        label: "Skepticism",
        description: "HCP shows doubt (raised eyebrow, questioning tone)",
        confidence: "high",
        variant: "informational",
      });
    }

    // Interest
    if (
      lower.includes("interesting") ||
      lower.includes("tell me more") ||
      lower.includes("leans forward") ||
      lower.includes("that's helpful") ||
      lower.includes("i'd like to know") ||
      (lower.includes("?") && wordCount > 8)
    ) {
      cues.push({
        type: "interest",
        label: "Interest",
        description: "HCP shows engagement (leaning forward, asking questions)",
        confidence: "high",
        variant: "positive",
      });
    }

    // Concern
    if (
      lower.includes("worried") ||
      lower.includes("concerned") ||
      lower.includes("what about") ||
      lower.includes("side effects") ||
      lower.includes("safety") ||
      lower.includes("risk")
    ) {
      cues.push({
        type: "concern",
        label: "Concern",
        description: "HCP expresses concern (about safety, efficacy, or implementation)",
        confidence: "high",
        variant: "informational",
      });
    }
  }

  return cues;
}

/**
 * Get color class for cue badge display
 */
export function getCueColorClass(variant: CueVariant): string {
  switch (variant) {
    case "positive":
      return "bg-green-100 text-green-800 border-green-200";
    case "negative":
      return "bg-red-100 text-red-800 border-red-200";
    case "informational":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
