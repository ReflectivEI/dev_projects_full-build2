// Enhanced scenario data with situational cue fields
// These scenarios include new fields for roleplay cues and environmental context

export interface EnhancedScenario {
  id: string;
  title: string;
  diseaseState: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stakeholder: string;
  objective: string;
  context: string;
  challenges: string[];
  keyMessages: string[];
  impact: string;
  // NEW FIELDS for situational cues
  initialCue?: string;
  environmentalContext?: string;
  hcpMood?: string;
  potentialInterruptions?: string[];
}

export const enhancedScenarios: EnhancedScenario[] = [
  // HIV/PrEP Scenarios
  {
    id: 'hiv-descovy-share',
    title: 'Descovy for PrEP Share Growth',
    diseaseState: 'HIV/PrEP',
    difficulty: 'intermediate',
    stakeholder: 'Dr. Sarah Chen - ID Specialist',
    objective: 'Increase Descovy prescriptions for PrEP-eligible patients',
    context: 'Dr. Chen has a busy HIV clinic and currently prescribes mostly Truvada for PrEP. You want to discuss the benefits of Descovy\'s bone and renal safety profile.',
    challenges: [
      'Time constraints in busy clinic',
      'Established Truvada prescribing habits',
      'Cost/access concerns for patients'
    ],
    keyMessages: [
      'Improved bone and renal safety profile',
      'Similar efficacy to Truvada',
      'Appropriate for high-risk populations'
    ],
    impact: 'Increased Descovy PrEP starts by 25% in target accounts',
    initialCue: '*Dr. Chen is reviewing lab results on her computer as you enter, a stack of patient charts beside her*',
    environmentalContext: 'Busy HIV clinic between patient appointments, 10-15 minutes available',
    hcpMood: 'Professional but time-conscious, slightly distracted by pending cases',
    potentialInterruptions: ['Nurse with urgent lab question', 'Pager for patient callback', 'Phone call from pharmacy']
  },
  {
    id: 'hiv-access-barriers',
    title: 'Navigating PrEP Access Barriers',
    diseaseState: 'HIV/PrEP',
    difficulty: 'advanced',
    stakeholder: 'Dr. Michael Torres - Community Health Center Director',
    objective: 'Address access and affordability concerns for underserved populations',
    context: 'Dr. Torres runs a community health center serving primarily uninsured and underinsured patients. He\'s skeptical about PrEP accessibility for his patient population.',
    challenges: [
      'Limited insurance coverage in patient population',
      'Prior authorization burdens',
      'Skepticism about pharma intentions'
    ],
    keyMessages: [
      'Patient assistance programs available',
      'Prior authorization support resources',
      'Clinical outcomes data in underserved populations'
    ],
    impact: 'Established patient support program partnership reaching 200+ patients',
    initialCue: '*Dr. Torres leans back in his chair with arms folded, expression neutral but watchful*',
    environmentalContext: 'Small administrative office at community health center, fluorescent lighting, worn furniture',
    hcpMood: 'Protective of patients, somewhat skeptical of pharma reps, values authenticity',
    potentialInterruptions: ['Front desk staff with insurance questions', 'Community health worker needing guidance']
  },
  {
    id: 'oncology-adc-integration',
    title: 'ADC Integration in Solid Tumors',
    diseaseState: 'Oncology',
    difficulty: 'advanced',
    stakeholder: 'Dr. Jennifer Walsh - Medical Oncologist',
    objective: 'Discuss ADC sequencing and integration into treatment protocols',
    context: 'Dr. Walsh is an experienced medical oncologist at a large academic center. She has used several ADCs but is cautious about toxicity management.',
    challenges: [
      'Complex toxicity profile concerns',
      'Sequencing questions with other therapies',
      'Limited real-world data in her patient population'
    ],
    keyMessages: [
      'Updated toxicity management guidelines',
      'Sequencing data from recent trials',
      'Real-world outcomes from similar centers'
    ],
    impact: 'ADC utilization increased by 40% in appropriate patients at academic center',
    initialCue: '*Dr. Walsh is studying imaging results on a wall-mounted display, half-finished coffee on desk*',
    environmentalContext: 'Academic medical center office, multiple diplomas and research posters on walls',
    hcpMood: 'Intellectually curious, evidence-focused, values peer data',
    potentialInterruptions: ['Fellow with patient question', 'Tumor board notification', 'Pharmacy consult request']
  },
  {
    id: 'cardiology-hfref-gdmt',
    title: 'HFrEF GDMT Optimization',
    diseaseState: 'Cardiovascular',
    difficulty: 'intermediate',
    stakeholder: 'Dr. Robert Kim - Interventional Cardiologist',
    objective: 'Encourage earlier initiation of guideline-directed medical therapy',
    context: 'Dr. Kim focuses primarily on interventional procedures and often refers heart failure management to other specialists. You want to discuss the importance of early GDMT.',
    challenges: [
      'Procedure-focused practice',
      'Referral patterns to heart failure specialists',
      'Unfamiliarity with newer HF medications'
    ],
    keyMessages: [
      'Mortality benefits of early GDMT initiation',
      'Simplified dosing for busy practices',
      'Coordination with heart failure team'
    ],
    impact: 'GDMT initiation rate increased 35% among post-intervention patients',
    initialCue: '*Dr. Kim glances at his smartwatch as you enter, still in scrubs from a recent procedure*',
    environmentalContext: 'Busy cath lab break room, equipment humming nearby, limited time',
    hcpMood: 'Efficient, action-oriented, prefers concise clinical data',
    potentialInterruptions: ['STEMI alert', 'Fellow with procedural question', 'Cath lab nurse with case update']
  },
  {
    id: 'vaccines-flu-optimization',
    title: 'Adult Flu Vaccination Optimization',
    diseaseState: 'Vaccines',
    difficulty: 'beginner',
    stakeholder: 'Dr. Amanda Foster - Family Medicine',
    objective: 'Increase high-dose flu vaccine uptake in 65+ patients',
    context: 'Dr. Foster runs a busy primary care practice with a large senior population. She currently uses standard-dose flu vaccine for all patients.',
    challenges: [
      'Cost perception of high-dose vaccine',
      'Vaccine hesitancy in some patients',
      'Workflow integration for age-appropriate dosing'
    ],
    keyMessages: [
      'Superior efficacy in 65+ population',
      'Coverage and reimbursement support',
      'CDC/ACIP recommendation updates'
    ],
    impact: 'High-dose flu coverage reached 80% in 65+ patients at practice',
    initialCue: '*Dr. Foster is making notes on a patient chart, looks up with a welcoming smile*',
    environmentalContext: 'Primary care office during afternoon clinic, receptionist voices audible',
    hcpMood: 'Open and collaborative, values patient-centered discussions',
    potentialInterruptions: ['Medical assistant with vitals question', 'Patient phone message']
  },
  {
    id: 'neurology-migraine-cgrp',
    title: 'CGRP Therapy in Chronic Migraine',
    diseaseState: 'Neurology',
    difficulty: 'intermediate',
    stakeholder: 'Dr. Lisa Park - Headache Specialist',
    objective: 'Position CGRP inhibitor as preventive therapy option',
    context: 'Dr. Park is a headache specialist who uses multiple preventive therapies. She has limited experience with newer CGRP agents.',
    challenges: [
      'Established prescribing patterns with older preventives',
      'Insurance prior authorization concerns',
      'Patient selection criteria questions'
    ],
    keyMessages: [
      'Clinical efficacy across migraine subtypes',
      'Safety and tolerability profile',
      'Prior authorization support resources'
    ],
    impact: 'CGRP initiation increased 50% in chronic migraine patients failing 2+ preventives',
    initialCue: '*Dr. Park has a patient education model of the brain on her desk, listens intently*',
    environmentalContext: 'Specialty headache clinic, dimmed lights (accommodating light-sensitive patients)',
    hcpMood: 'Thoughtful, patient-focused, appreciates mechanism discussions',
    potentialInterruptions: ['Infusion nurse with medication question', 'Patient family member with concern']
  }
];

// Helper function to get scenario by ID with full cue context
export function getScenarioById(id: string): EnhancedScenario | undefined {
  return enhancedScenarios.find(s => s.id === id);
}

// Get scenario context for API call
export function getScenarioContext(scenario: EnhancedScenario) {
  return {
    id: scenario.id,
    title: scenario.title,
    stakeholder: scenario.stakeholder,
    environmentalContext: scenario.environmentalContext,
    hcpMood: scenario.hcpMood,
    potentialInterruptions: scenario.potentialInterruptions,
    challenges: scenario.challenges,
    initialCue: scenario.initialCue,
    difficulty: scenario.difficulty
  };
}
