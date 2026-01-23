/**
 * Behavioral Metrics Specification (v1)
 * Single source of truth for 8 Signal Intelligence metrics
 * Frontend-only, deterministic scoring framework
 */

// CANONICAL LIST: All 8 Behavioral Metrics (MUST be used everywhere)
export const BEHAVIORAL_METRIC_IDS = [
  'question_quality',
  'listening_responsiveness',
  'making_it_matter',
  'customer_engagement_signals',
  'objection_navigation',
  'conversation_control_structure',
  'commitment_gaining',
  'adaptability',
] as const;

export type BehavioralMetricId = typeof BEHAVIORAL_METRIC_IDS[number];

export interface ComponentSpec {
  name: string;
  description: string;
  weight: number;
  indicators: string[];
  heuristics: string;
}

export interface MetricSpec {
  id: BehavioralMetricId;
  metric: string;
  optional: boolean;
  score_formula: 'average' | 'weighted_average';
  components: ComponentSpec[];
}

export const METRICS_SPEC: MetricSpec[] = [
  {
    id: 'question_quality',
    metric: 'Question Quality',
    optional: false,
    score_formula: 'weighted_average',
    components: [
      {
        name: 'open_closed_ratio',
        description: 'Balance of open vs. closed questions',
        weight: 0.25,
        indicators: [
          'Uses "how", "what", "why" to open dialogue',
          'Avoids excessive yes/no questions',
          'Encourages elaboration'
        ],
        heuristics: 'Open questions start with how/what/why/tell me/walk me through/help me understand. Closed questions start with do/does/did/is/are/can/will/has/have. Score by ratio open/(open+closed): ≥0.70→5, ≥0.55→4, ≥0.40→3, ≥0.25→2, else→1'
      },
      {
        name: 'relevance_to_goals',
        description: 'Questions align with customer priorities',
        weight: 0.25,
        indicators: [
          'References customer-stated goals',
          'Explores priorities mentioned earlier',
          'Connects to business objectives'
        ],
        heuristics: 'Build rolling set of customer goal tokens (words following need/goal/priority/concern/issue/challenge/want/trying/struggle). Score by % of rep questions reusing ≥1 goal token: ≥0.60→5, ≥0.45→4, ≥0.30→3, ≥0.15→2, else→1'
      },
      {
        name: 'sequencing_logic',
        description: 'Questions flow logically without abrupt jumps',
        weight: 0.25,
        indicators: [
          'Uses transitions between topics',
          'Builds on previous answers',
          'Avoids random topic switches'
        ],
        heuristics: 'Penalize abrupt jumps. For each rep question after customer answer, compute token overlap. If overlap <0.10 and no bridge phrase (got it/that makes sense/building on that/to understand that better) → count as jump. jumpRate = jumps/totalQuestions: ≤0.10→5, ≤0.20→4, ≤0.35→3, ≤0.50→2, else→1'
      },
      {
        name: 'follow_up_depth',
        description: 'Asks follow-up questions to deepen understanding',
        weight: 0.25,
        indicators: [
          'Probes deeper on customer responses',
          'Uses "tell me more" or "help me understand"',
          'References prior statements'
        ],
        heuristics: 'Follow-up if rep question references prior customer turn via keyword overlap ≥0.20 OR phrases (you mentioned/when you said/say more about/help me understand more). followups/totalQuestions: ≥0.60→5, ≥0.40→4, ≥0.25→3, ≥0.10→2, else→1'
      }
    ]
  },
  {
    id: 'listening_responsiveness',
    metric: 'Listening & Responsiveness',
    optional: false,
    score_formula: 'average',
    components: [
      {
        name: 'paraphrasing',
        description: 'Reflects back customer statements',
        weight: 0.33,
        indicators: [
          'Uses "what I\'m hearing is..."',
          'Summarizes customer points',
          'Checks understanding'
        ],
        heuristics: 'Detect paraphrase phrases (what I\'m hearing/it sounds like/if I understand/so you\'re saying) OR overlap with prior customer tokens ≥0.30. paraphraseCount/customerTurns: ≥0.50→5, ≥0.35→4, ≥0.20→3, ≥0.10→2, else→1'
      },
      {
        name: 'acknowledgment_of_concerns',
        description: 'Acknowledges customer concerns when raised',
        weight: 0.33,
        indicators: [
          'Says "I hear you" or "I understand"',
          'Validates concerns before responding',
          'Shows empathy'
        ],
        heuristics: 'Concern detected if customer turn contains: worried/concern/hesitant/problem/issue/not sure/don\'t like/no/can\'t/won\'t/too busy/budget. Applicable only if concern occurs. Score by % of concern turns acknowledged within next 1 rep turn using phrases (I hear you/I understand/that makes sense/I can see why/you\'re right/fair point): ≥0.80→5, ≥0.60→4, ≥0.40→3, ≥0.20→2, else→1. If no concerns, applicable=false.'
      },
      {
        name: 'adjustment_to_new_info',
        description: 'Adapts approach when customer shares new information',
        weight: 0.34,
        indicators: [
          'Incorporates new details into discussion',
          'Shifts focus based on revelations',
          'References newly shared information'
        ],
        heuristics: 'Detect "new info" when customer introduces novel tokens (not seen in previous customer turns) AND rep references ≥1 of those tokens in next 1-2 rep turns. adjustRate: ≥0.70→5, ≥0.55→4, ≥0.40→3, ≥0.25→2, else→1'
      }
    ]
  },
  {
    id: 'making_it_matter',
    metric: 'Making It Matter',
    optional: false,
    score_formula: 'weighted_average',
    components: [
      {
        name: 'outcome_based_language',
        description: 'Focuses on outcomes and results, not features',
        weight: 0.33,
        indicators: [
          'Uses "so that", "which means", "so you can"',
          'Emphasizes impact on patients/workflow',
          'Connects features to benefits'
        ],
        heuristics: 'Outcome terms: improve/reduce/increase/impact/outcome/results/patients/workflow/time/burden/adherence/access/efficiency/safety. Score by % of rep statements (non-questions) containing ≥1 outcome term OR connector phrases (so that/which means/so you can): ≥0.60→5, ≥0.45→4, ≥0.30→3, ≥0.15→2, else→1'
      },
      {
        name: 'link_to_customer_priorities',
        description: 'Ties value proposition to customer-stated priorities',
        weight: 0.34,
        indicators: [
          'References customer goals in pitch',
          'Connects solution to stated needs',
          'Uses customer language'
        ],
        heuristics: 'Reuse of customer goal tokens (from question_quality metric) in rep statements. Score by %: ≥0.50→5, ≥0.35→4, ≥0.20→3, ≥0.10→2, else→1'
      },
      {
        name: 'no_feature_dumping',
        description: 'Avoids overwhelming with feature lists',
        weight: 0.33,
        indicators: [
          'Presents features selectively',
          'Avoids long bullet-point lists',
          'Connects each feature to benefit'
        ],
        heuristics: 'Detect "feature dump" when rep statement length >220 chars AND contains list-y separators (comma repeated ≥4 OR bullet • OR dash - occurrences ≥3) AND lacks benefit connector (so that/which means/so you can). dumpRate = dumps/repStatements: ≤0.05→5, ≤0.12→4, ≤0.25→3, ≤0.40→2, else→1'
      }
    ]
  },
  {
    id: 'customer_engagement_signals',
    metric: 'Customer Engagement Signals',
    optional: false,
    score_formula: 'weighted_average',
    components: [
      {
        name: 'customer_talk_time',
        description: 'Customer speaks appropriate amount (45-65% ideal)',
        weight: 0.25,
        indicators: [
          'Balanced dialogue',
          'Customer elaborates freely',
          'Rep doesn\'t dominate'
        ],
        heuristics: 'Use timestamps if present else turn counts. customerShare: 0.45-0.65→5, 0.35-0.45 or 0.65-0.75→4, 0.25-0.35 or 0.75-0.85→3, 0.15-0.25 or 0.85-0.92→2, else→1'
      },
      {
        name: 'customer_question_quality',
        description: 'Customer asks thoughtful, specific questions',
        weight: 0.25,
        indicators: [
          'Customer seeks clarification',
          'Asks detailed questions',
          'Shows active interest'
        ],
        heuristics: 'Count customer questions. Simple proxy: 3+ questions→5, 2→4, 1→3, 0→2 (not 1 unless other disengagement is strong)'
      },
      {
        name: 'forward_looking_cues',
        description: 'Customer expresses interest in next steps',
        weight: 0.25,
        indicators: [
          'Mentions "next steps" or "follow up"',
          'Asks about timelines',
          'Proposes future actions'
        ],
        heuristics: 'Detect customer phrases: next/follow up/send/schedule/I will/let\'s/when can we/trial/pilot/talk again. 2+ cues→5, 1 cue→4, 0 cues→3 (neutral default) unless energy_shifts=1 then set to 2'
      },
      {
        name: 'energy_shifts',
        description: 'Customer maintains or increases engagement',
        weight: 0.25,
        indicators: [
          'Responses stay substantive',
          'Avoids disengagement cues',
          'Energy remains positive'
        ],
        heuristics: 'Detect disengagement phrases: okay/sure/fine/whatever/I have to go/another meeting/short on time OR shrinking customer responses (last 1/3 avg length < first 1/3 by ≥50%). Strong disengagement→1-2, mild→3, stable/positive→4-5'
      }
    ]
  },
  {
    id: 'objection_navigation',
    metric: 'Objection Navigation',
    optional: true,
    score_formula: 'average',
    components: [
      {
        name: 'acknowledge_before_response',
        description: 'Acknowledges objection before responding',
        weight: 0.33,
        indicators: [
          'Says "I understand" before rebutting',
          'Validates concern first',
          'Avoids immediate defensiveness'
        ],
        heuristics: 'After objection, next rep turn contains acknowledgment phrase before any rebuttal markers (but/however/actually). Rate thresholds: ≥0.80→5, ≥0.60→4, ≥0.40→3, ≥0.20→2, else→1. Only applicable if objection detected (not interested/no budget/too expensive/can\'t/won\'t/don\'t/concern/hesitant/problem/issue).'
      },
      {
        name: 'explore_underlying_concern',
        description: 'Asks questions to understand root cause',
        weight: 0.34,
        indicators: [
          'Probes deeper on objection',
          'Seeks to understand "why"',
          'Asks clarifying questions'
        ],
        heuristics: 'Rep asks clarifying question within next 2 rep turns after objection. Rate: ≥0.70→5, ≥0.55→4, ≥0.40→3, ≥0.25→2, else→1'
      },
      {
        name: 'calm_demeanor',
        description: 'Maintains composure and professionalism',
        weight: 0.33,
        indicators: [
          'Avoids defensive language',
          'Stays calm and measured',
          'Uses steadying phrases'
        ],
        heuristics: 'Proxy: rep avoids immediate rebuttal (but/however/actually) in first response AND includes steadying phrase (fair point/that makes sense/I hear you). Both present→5, one present→3-4, none→1-2'
      }
    ]
  },
  {
    id: 'conversation_control_structure',
    metric: 'Conversation Control & Structure',
    optional: false,
    score_formula: 'weighted_average',
    components: [
      {
        name: 'purpose_setting',
        description: 'Sets clear agenda at start',
        weight: 0.25,
        indicators: [
          'States meeting purpose early',
          'Outlines agenda',
          'Sets expectations'
        ],
        heuristics: 'Rep sets agenda early (first 3 rep turns) with phrases: today I\'d like/agenda/goal/what I\'d like to cover. Present early→5, present later→3, absent→1'
      },
      {
        name: 'topic_management',
        description: 'Manages topic flow with smooth transitions',
        weight: 0.25,
        indicators: [
          'Uses transition phrases',
          'Connects topics logically',
          'Avoids abrupt shifts'
        ],
        heuristics: 'Uses transitions/bridges (building on that/to connect this/since you said) and low jumpRate (reuse overlap ≥0.10). Excellent→5, moderate→3-4, poor→1-2'
      },
      {
        name: 'time_management',
        description: 'Respects time constraints and adapts',
        weight: 0.25,
        indicators: [
          'Acknowledges time limits',
          'Adjusts pace when needed',
          'Offers to continue later if needed'
        ],
        heuristics: 'Detects customer time cue (have to go/another meeting/short on time) and rep adapts (offers next step/shortens pitch) within next 1 rep turn. Cue+adapt→5, cue only→2, no cue→applicable=true score=3 (neutral baseline)'
      },
      {
        name: 'summarizing',
        description: 'Recaps key points near end',
        weight: 0.25,
        indicators: [
          'Summarizes discussion',
          'Confirms alignment',
          'Reviews next steps'
        ],
        heuristics: 'Rep recap near end (last 3 rep turns) with: to recap/summary/what we covered/next steps. Present→5, partial→3, absent→1'
      }
    ]
  },
  {
    id: 'commitment_gaining',
    metric: 'Commitment Gaining',
    optional: false,
    score_formula: 'weighted_average',
    components: [
      {
        name: 'next_step_specificity',
        description: 'Proposes concrete, specific next steps',
        weight: 0.33,
        indicators: [
          'Includes dates/times',
          'Defines concrete actions',
          'Avoids vague "follow up"'
        ],
        heuristics: 'Detect next step phrases: schedule/follow up/send/connect/align/next step/set up/confirm. Includes time/date or concrete action ("send X by Friday", "meet next week"). Specific next step→5, vague next step→3, none→1'
      },
      {
        name: 'mutual_agreement',
        description: 'Gains explicit customer agreement',
        weight: 0.33,
        indicators: [
          'Customer says "yes" or "sounds good"',
          'Confirms alignment',
          'Gets verbal commitment'
        ],
        heuristics: 'Customer explicitly agrees (yes/sounds good/that works/okay let\'s) after next step is proposed. Yes→5, weak/ambiguous→3, none→1'
      },
      {
        name: 'ownership_clarity',
        description: 'Clarifies who does what',
        weight: 0.34,
        indicators: [
          'States "I\'ll send..."',
          'Confirms "You\'ll review..."',
          'Defines roles clearly'
        ],
        heuristics: 'Identifies who does what (I\'ll send/you\'ll review/we will). Clear roles→5, partial→3, none→1'
      }
    ]
  },
  {
    id: 'adaptability',
    metric: 'Adaptability',
    optional: false,
    score_formula: 'average',
    components: [
      {
        name: 'approach_shift',
        description: 'Changes strategy when needed',
        weight: 0.25,
        indicators: [
          'Pivots after resistance',
          'Tries different angles',
          'Adjusts value proposition'
        ],
        heuristics: 'Rep changes strategy after resistance/objection (asks more questions/reframes value/proposes smaller step). Strong match cue→response→5, partial→3-4, cue ignored→1-2. If no cues exist, applicable=false.'
      },
      {
        name: 'tone_adjustment',
        description: 'Adjusts tone to match customer mood',
        weight: 0.25,
        indicators: [
          'Becomes calmer when needed',
          'Shows empathy appropriately',
          'Matches customer energy'
        ],
        heuristics: 'Rep becomes calmer/empathetic after concern. Strong match→5, partial→3-4, ignored→1-2. If no cues, applicable=false.'
      },
      {
        name: 'depth_adjustment',
        description: 'Adjusts detail level appropriately',
        weight: 0.25,
        indicators: [
          'Simplifies when confused',
          'Adds detail when interested',
          'Shortens when time-pressed'
        ],
        heuristics: 'Rep reduces detail when time constraint or increases detail when confusion. Strong match→5, partial→3-4, ignored→1-2. If no cues, applicable=false.'
      },
      {
        name: 'pacing_adjustment',
        description: 'Adjusts conversation pace',
        weight: 0.25,
        indicators: [
          'Speeds up when time-limited',
          'Slows down when confused',
          'Matches customer pace'
        ],
        heuristics: 'Rep shortens/quickens or slows down appropriately. Strong match→5, partial→3-4, ignored→1-2. If no cues, applicable=false.'
      }
    ]
  }
];
