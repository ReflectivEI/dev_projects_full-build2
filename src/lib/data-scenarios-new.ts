// NEW SCENARIO STRUCTURE - Disease-State and Fictitious Products Only
// Internal policy: ReflectivAI role-play scenarios will not reference licensed 
// pharmaceutical brands unless explicitly approved and supplied by the client.

import type { Scenario } from "@/types/schema";

export const scenarios: Scenario[] = [
  // ============================================================================
  // FOUNDATION LAYER: Disease-State Scenarios
  // Early modules • Lower pressure • Focus on noticing, interpreting, navigating
  // Ideal for onboarding or baseline assessment
  // ============================================================================
  
  {
    id: "hiv_prep_opportunity",
    title: "HIV Prevention: Identifying PrEP Candidates",
    description: "Internal medicine physician underutilizes PrEP despite patient population at risk",
    category: "hiv",
    stakeholder: "Dr. Maya Patel - Internal Medicine MD, Urban Clinic",
    objective: "Create awareness of PrEP gaps and establish systematic screening approach",
    context: "This time-pressed IM physician has inconsistent screening for HIV risk factors. STI testing volume suggests missed PrEP opportunities. Clinic believes few true PrEP candidates exist despite evidence to the contrary.",
    openingScene: "Dr. Patel glances at her watch as you enter. She's between patients, typing notes rapidly. 'I have about 10 minutes,' she says without looking up. 'What's this about?'",
    hcpMood: "time-pressured, skeptical",
    challenges: [
      "Belief that few patients are true PrEP candidates",
      "Renal safety and monitoring workload concerns",
      "Limited time for detailed discussions",
      "Prior auth burden for prevention medications"
    ],
    keyMessages: [
      "Quantify at-risk patient pool from STI volume",
      "Review evidence-based screening criteria",
      "Propose nurse-led screening and lab cadence",
      "Streamlined quarterly follow-up protocol"
    ],
    impact: [
      "Reduce new HIV infections in at-risk population",
      "Improve clinic PrEP initiation rates",
      "Establish standardized screening workflow",
      "Protect high-risk patients proactively"
    ],
    suggestedPhrasing: [
      "I noticed your STI testing volume suggests there may be patients who could benefit from PrEP. Can we review the data together?",
      "What if we set up a nurse-led protocol to handle screening and follow-ups? This could reduce your workload significantly.",
      "The latest guidelines make it easier to identify candidates. Would you like to see the screening criteria?"
    ],
    difficulty: "beginner"
  },

  {
    id: "hiv_treatment_landscape",
    title: "HIV Treatment: Optimizing Stable Patients",
    description: "HIV clinic with declining optimization velocity; perception that most patients are stable",
    category: "hiv",
    stakeholder: "Michael Chen, PA-C - Academic HIV Center",
    objective: "Reinforce importance of ongoing treatment optimization and establish review criteria",
    context: "Hospital-affiliated ID clinic where optimization efforts have slowed. Strong perception that most patients are already on optimal regimens.",
    openingScene: "Michael leans back in his chair, arms crossed but with an open expression. 'I'm always interested in better outcomes for my patients. What data do you have on long-term outcomes?'",
    hcpMood: "curious, data-driven",
    challenges: [
      "Reluctance to change stable, suppressed patients",
      "Perception of complete optimization",
      "Limited awareness of newer treatment benefits",
      "Competing clinical priorities"
    ],
    keyMessages: [
      "Long-term durability and resistance barrier data",
      "Simplified regimens improve adherence",
      "Create candidate list by labs/adherence flags",
      "Schedule optimization review day"
    ],
    impact: [
      "Improve long-term treatment outcomes",
      "Reduce pill burden for eligible patients",
      "Proactive resistance prevention",
      "Enhanced patient satisfaction"
    ],
    suggestedPhrasing: [
      "Even with stable, suppressed patients, there may be opportunities to simplify regimens. Can we review which patients might benefit?",
      "What if we scheduled a quarterly optimization day to systematically review candidates?",
      "The resistance barrier data is compelling for long-term durability. Would you like to see the latest studies?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "onc_biomarker_discussion",
    title: "Oncology: Biomarker-Driven Treatment Selection",
    description: "Solid-tumor center evaluating biomarker testing; P&T scrutinizes cost and outcomes",
    category: "oncology",
    stakeholder: "Dr. Robert Chen - Hematology/Oncology, Community Practice",
    objective: "Define biomarker-driven patient selection with clear clinical benefit",
    context: "Center focuses on cost-per-response and resource utilization. Need to demonstrate clear value proposition for biomarker testing.",
    challenges: [
      "Resource constraints for testing",
      "P&T cost scrutiny",
      "Competition with established treatment protocols",
      "Uncertainty about patient selection criteria"
    ],
    keyMessages: [
      "Biomarker-driven patient selection criteria",
      "Clear clinical benefit vs standard of care",
      "Testing workflow integration",
      "Evidence-based treatment algorithms"
    ],
    impact: [
      "Expand treatment options for biomarker+ patients",
      "Improve progression-free survival",
      "Establish clear testing pathway",
      "Enhance tumor board decision-making"
    ],
    suggestedPhrasing: [
      "For your biomarker-positive patients, the clinical data shows a clear benefit. Would you like to review the subset analysis?",
      "The testing workflow is designed to fit within your existing process. Can I walk you through it?",
      "This aligns with current guidelines. Would it help to present this to your tumor board?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "cv_heart_failure_gdmt",
    title: "Cardiology: Heart Failure GDMT Optimization",
    description: "HFrEF clinic with suboptimal four-pillar guideline-directed medical therapy adoption",
    category: "cardiology",
    stakeholder: "Dr. Amanda Lewis - Cardiologist, Academic Heart Failure Center",
    objective: "Implement systematic GDMT optimization and reduce treatment gaps",
    context: "Top-tier HF program with suboptimal four-pillar GDMT adoption. Handoff gaps and copay barriers compromise outcomes.",
    challenges: [
      "Copay barriers for newer therapies",
      "Handoff gaps to PCP after discharge",
      "Inconsistent four-pillar implementation",
      "Day-30 refill gaps"
    ],
    keyMessages: [
      "Discharge GDMT checklist implementation",
      "Copay assistance enrollment process",
      "Start therapies before discharge when eligible",
      "Systematic optimization protocol"
    ],
    impact: [
      "Reduce 30-day HF readmissions",
      "Improve complete GDMT at discharge",
      "Eliminate day-30 refill gaps",
      "Better mortality outcomes"
    ],
    suggestedPhrasing: [
      "Starting therapies before discharge captures patients while they're still in the system. What would it take to add this to your discharge protocol?",
      "A pharmacy tech can handle copay assistance enrollment. Would that help?",
      "The evidence for complete GDMT is compelling. Can I share the protocol that other HF centers are using?"
    ],
    difficulty: "advanced"
  },

  // ============================================================================
  // APPLICATION LAYER: Fictitious-Product Scenarios
  // Later modules • Value articulation • Commitment moments
  // Still clearly non-promotional
  // ============================================================================

  {
    id: "hiv_prep_novel_agent",
    title: "Novel PrEP Agent: Renal Safety Profile",
    description: "Discussing a once-daily oral PrEP option with improved renal safety profile",
    category: "hiv",
    stakeholder: "Sarah Thompson, NP - HIV Specialty Clinic",
    objective: "Address renal safety concerns and establish appropriate patient selection criteria",
    context: "High-performing NP concerned about renal monitoring burden. A novel agent with improved renal safety profile may address workflow concerns while maintaining efficacy.",
    openingScene: "Sarah looks up from a stack of lab reports with a tired smile. 'I'm always interested in options that are easier on the kidneys, but I need to see the data first.'",
    hcpMood: "interested but cautious",
    challenges: [
      "Need for robust renal safety data",
      "Monitoring protocol requirements",
      "Patient selection criteria",
      "Workflow integration concerns"
    ],
    keyMessages: [
      "Renal safety profile vs existing options",
      "Simplified monitoring requirements",
      "Patient selection criteria",
      "Clinical trial efficacy data"
    ],
    impact: [
      "Expand PrEP access to patients with renal concerns",
      "Reduce monitoring burden",
      "Maintain high efficacy standards",
      "Improve patient adherence"
    ],
    suggestedPhrasing: [
      "The renal safety data shows significant advantages in patients with baseline concerns. Would you like to review the comparative analysis?",
      "The monitoring protocol is streamlined compared to current options. Can I walk you through it?",
      "For patients with renal risk factors, this may be an appropriate alternative. What patient selection criteria would be most helpful?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "onc_adc_integration",
    title: "Antibody-Drug Conjugate: Pathway Integration",
    description: "Discussing integration of a novel ADC with established IO backbone",
    category: "oncology",
    stakeholder: "Lisa Martinez, NP - Community Oncology Infusion Center",
    objective: "Establish clear pathway position and toxicity management protocols",
    context: "Community practice with conservative adoption patterns. Novel ADC offers potential benefit but requires clear integration plan and AE management protocols.",
    openingScene: "Lisa reviews an infusion schedule, looking concerned. 'We're already stretched thin with our current protocols. How does this fit into our workflow?'",
    hcpMood: "cautious, resource-conscious",
    challenges: [
      "Staffing limitations for AE management",
      "Pathway integration complexity",
      "Infusion chair time constraints",
      "Need for clear patient selection criteria"
    ],
    keyMessages: [
      "Biomarker-driven patient selection",
      "Standardized AE management protocols",
      "Infusion workflow integration",
      "Clinical benefit data"
    ],
    impact: [
      "Expand treatment options for appropriate patients",
      "Improve patient outcomes",
      "Manageable toxicity profile with protocols",
      "Clear pathway positioning"
    ],
    suggestedPhrasing: [
      "The infusion protocol is designed to fit within your existing workflow. Can I show you how other community practices have integrated it?",
      "Standardized AE protocols can help your team manage toxicities confidently. Would you like to review them?",
      "For biomarker-positive patients, the clinical benefit is clear. Can we discuss patient selection criteria?"
    ],
    difficulty: "advanced"
  },

  {
    id: "cv_arni_conversion",
    title: "ARNI Therapy: Optimizing HFrEF Patients",
    description: "Discussing conversion from ACE/ARB to ARNI in eligible HFrEF patients",
    category: "cardiology",
    stakeholder: "Karen Mitchell, NP - Rural Heart Failure Clinic",
    objective: "Establish conversion protocol and address safety concerns",
    context: "Rural practice with high HFrEF burden. ARNI underutilized due to conversion complexity concerns and limited specialist support.",
    openingScene: "Karen looks up from patient charts, interested but hesitant. 'I've heard about ARNI benefits, but I'm not sure about the conversion process in our setting.'",
    hcpMood: "interested, seeking guidance",
    challenges: [
      "Conversion protocol uncertainty",
      "Limited specialist support in rural setting",
      "Patient education needs",
      "Monitoring requirements"
    ],
    keyMessages: [
      "Evidence-based conversion protocol",
      "Safety monitoring guidelines",
      "Patient education materials",
      "Clinical benefit data"
    ],
    impact: [
      "Improve HFrEF outcomes in rural population",
      "Reduce HF hospitalizations",
      "Build provider confidence",
      "Expand access to guideline-directed therapy"
    ],
    suggestedPhrasing: [
      "The conversion protocol is straightforward with clear safety guidelines. Would you like to review it step-by-step?",
      "I have patient education materials that explain the transition in simple terms. Can I share them?",
      "The clinical benefit data is compelling for eligible patients. Would you like to see the outcomes?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "vac_adult_immunization",
    title: "Adult Immunization: Program Optimization",
    description: "ID practice serving high-risk adults with suboptimal vaccination rates",
    category: "vaccines",
    stakeholder: "Dr. Evelyn Harper - Infectious Diseases Specialist",
    objective: "Implement systematic vaccination program with standing orders and reminders",
    context: "ID practice serving long-term care and high-risk adult populations. Coverage rates below target. Late program start and weak reminder systems contribute to missed opportunities.",
    openingScene: "Dr. Harper looks up from paperwork, rubbing her temples. 'We know vaccination is important, but we're struggling with the logistics. What can you suggest?'",
    hcpMood: "frustrated but open",
    challenges: [
      "Late program initiation timing",
      "Weak reminder-recall systems",
      "Standing order implementation gaps",
      "Staff workflow constraints"
    ],
    keyMessages: [
      "Early program launch timeline",
      "SMS reminder system implementation",
      "Standing orders in LTC facilities",
      "Staff workflow optimization"
    ],
    impact: [
      "Improve vaccination coverage rates",
      "Reduce preventable infections",
      "Streamline clinic workflow",
      "Better protection for high-risk patients"
    ],
    suggestedPhrasing: [
      "Starting earlier in the season captures more patients. Can we plan for an August launch next year?",
      "SMS reminders significantly improve show rates. Would you like to see the data?",
      "Standing orders in your LTC facilities could automate much of this. Can I share implementation examples?"
    ],
    difficulty: "beginner"
  }
];
