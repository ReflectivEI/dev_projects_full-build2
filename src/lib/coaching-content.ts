/**
 * ENTERPRISE COACHING CONTENT LIBRARY
 * 
 * Professional, FDA-compliant coaching guidance for pharmaceutical sales representatives.
 * This content is curated by industry experts and provides actionable, specific advice
 * for each coaching module.
 * 
 * Content is structured to provide:
 * - Clear focus areas for skill development
 * - Business impact and rationale
 * - Concrete next actions
 * - Best practices and common pitfalls
 */

export type CoachingContent = {
  focus: string;
  whyItMatters: string;
  nextAction: string;
  keyPractices: string[];
  commonChallenges: string[];
  developmentTips: string[];
};

type ModuleCoachingVariants = {
  [moduleId: string]: CoachingContent[];
};

/**
 * Each module has 5 coaching variants to provide variety.
 * Content is rotated to simulate dynamic coaching while maintaining quality.
 */
export const COACHING_LIBRARY: ModuleCoachingVariants = {
  'discovery-questions': [
    {
      focus: 'Open-Ended Question Mastery',
      whyItMatters: 'In pharmaceutical sales, open-ended questions uncover the clinical challenges and patient outcomes that matter most to healthcare providers. These insights allow you to position your product as a solution to real problems, not just another option. HCPs respond better when they feel heard and understood.',
      nextAction: 'In your next three customer interactions, start each conversation with "What challenges are you currently facing with [condition]?" and let them speak for at least 2 minutes before responding. Document the clinical pain points they mention.',
      keyPractices: [
        'Use "What," "How," and "Tell me about" to open conversations',
        'Practice active listening - take notes on clinical priorities mentioned',
        'Follow up with clarifying questions before presenting solutions',
        'Connect product benefits directly to stated challenges'
      ],
      commonChallenges: [
        'Jumping to product pitch too quickly without understanding needs',
        'Asking closed yes/no questions that limit information gathering',
        'Not documenting insights for future reference',
        'Failing to connect discovery insights to product positioning'
      ],
      developmentTips: [
        'Record yourself (with permission) and count open vs closed questions',
        'Create a "question bank" of 10 powerful open-ended questions for your therapeutic area',
        'Practice with colleagues - have them play difficult HCP personas',
        'Review call notes to identify patterns in what questions yield best insights'
      ]
    },
    {
      focus: 'Clinical Needs Assessment',
      whyItMatters: 'Understanding the specific patient populations and treatment gaps in each practice allows you to tailor your message with precision. Generic product presentations fail because they don\'t address the unique clinical context of each provider. Needs assessment transforms you from a sales rep into a clinical resource.',
      nextAction: 'Before your next call, research the provider\'s practice demographics and patient mix. During the call, ask: "What percentage of your [condition] patients are currently achieving treatment goals?" Use this to identify gaps your product addresses.',
      keyPractices: [
        'Research practice demographics before each call',
        'Ask about current treatment protocols and outcomes',
        'Identify specific patient populations that are underserved',
        'Quantify treatment gaps with percentages and numbers'
      ],
      commonChallenges: [
        'Making assumptions about practice needs without asking',
        'Not connecting practice demographics to product fit',
        'Failing to quantify the treatment gap',
        'Overlooking non-clinical factors (cost, access, adherence)'
      ],
      developmentTips: [
        'Create a pre-call planning template that includes needs assessment questions',
        'Build a database of practice profiles with key clinical insights',
        'Partner with your MSL team to understand clinical landscape',
        'Use claims data to identify high-potential practices with treatment gaps'
      ]
    },
    {
      focus: 'Uncovering Prescribing Barriers',
      whyItMatters: 'Even when HCPs see clinical value, prescribing barriers (formulary status, prior authorization, patient cost) can prevent adoption. Identifying these barriers early allows you to provide solutions proactively rather than reactively. This positions you as a problem-solver, not just a product promoter.',
      nextAction: 'In your next call, explicitly ask: "What would prevent you from prescribing [product] for an appropriate patient?" Document every barrier mentioned and prepare solutions for the next interaction.',
      keyPractices: [
        'Ask directly about formulary status and access barriers',
        'Inquire about prior authorization requirements and burden',
        'Understand patient cost concerns and copay assistance awareness',
        'Identify administrative barriers (e-prescribing, specialty pharmacy)'
      ],
      commonChallenges: [
        'Avoiding difficult questions about barriers',
        'Not having solutions ready for common barriers',
        'Assuming barriers without asking',
        'Failing to follow up with barrier solutions'
      ],
      developmentTips: [
        'Create a "barrier solution guide" for your territory',
        'Role-play barrier conversations with your manager',
        'Build relationships with access/reimbursement specialists',
        'Track barrier frequency to identify systemic issues'
      ]
    },
    {
      focus: 'Patient-Centered Discovery',
      whyItMatters: 'HCPs make prescribing decisions based on patient outcomes, not product features. When you frame discovery around patient experiences, quality of life, and real-world effectiveness, you align with the provider\'s primary concern: helping their patients. This builds trust and credibility.',
      nextAction: 'In your next interaction, ask: "Can you tell me about a recent patient with [condition] who struggled with their current treatment?" Listen for patient-specific challenges that your product addresses.',
      keyPractices: [
        'Frame questions around patient experiences and outcomes',
        'Ask about quality of life impacts beyond clinical measures',
        'Inquire about adherence challenges patients face',
        'Understand patient preferences and treatment burden'
      ],
      commonChallenges: [
        'Focusing on product features instead of patient outcomes',
        'Not connecting patient stories to product benefits',
        'Overlooking quality of life and adherence factors',
        'Failing to document patient-centered insights'
      ],
      developmentTips: [
        'Study patient journey maps for your therapeutic area',
        'Review patient advocacy organization resources',
        'Practice translating product features into patient outcomes',
        'Collect patient case studies (de-identified) that resonate with HCPs'
      ]
    },
    {
      focus: 'Competitive Landscape Understanding',
      whyItMatters: 'HCPs compare your product to alternatives constantly. Understanding their current prescribing patterns, experiences with competitors, and perceptions of your product\'s differentiation allows you to position effectively. Ignoring the competitive context makes your message irrelevant.',
      nextAction: 'Ask in your next call: "What are you currently prescribing for [condition], and how satisfied are you with the outcomes?" Use this to understand competitive positioning and identify switching opportunities.',
      keyPractices: [
        'Ask about current prescribing patterns without being defensive',
        'Inquire about satisfaction with current treatments',
        'Understand perceived advantages and disadvantages of competitors',
        'Identify specific scenarios where your product offers advantages'
      ],
      commonChallenges: [
        'Being defensive when competitors are mentioned',
        'Making negative claims about competitors',
        'Not understanding why HCPs prefer certain products',
        'Failing to differentiate based on HCP-stated priorities'
      ],
      developmentTips: [
        'Create a competitive positioning matrix based on HCP feedback',
        'Practice responding to competitive objections neutrally',
        'Study competitor clinical data and real-world evidence',
        'Identify your product\'s "white space" - unmet needs competitors don\'t address'
      ]
    }
  ],
  
  'stakeholder-mapping': [
    {
      focus: 'Identifying Key Decision Makers',
      whyItMatters: 'In complex healthcare systems, prescribing decisions involve multiple stakeholders beyond the physician. Identifying who influences formulary decisions, treatment protocols, and prescribing patterns allows you to allocate your time strategically. Focusing only on prescribers while ignoring decision-makers limits your impact.',
      nextAction: 'For your top 3 accounts, create a stakeholder map identifying: prescribers, clinical leaders, pharmacy directors, and administrators. Schedule time to meet with at least one non-prescriber decision-maker this week.',
      keyPractices: [
        'Map organizational structure and decision-making hierarchy',
        'Identify clinical champions who influence peers',
        'Understand pharmacy and therapeutics committee composition',
        'Build relationships with administrative decision-makers'
      ],
      commonChallenges: [
        'Focusing exclusively on prescribers and ignoring system influencers',
        'Not understanding organizational decision-making processes',
        'Failing to maintain relationships with non-prescribing stakeholders',
        'Overlooking informal influencers (respected clinicians, thought leaders)'
      ],
      developmentTips: [
        'Use organizational charts and LinkedIn to map stakeholders',
        'Ask prescribers: "Who else is involved in treatment decisions here?"',
        'Attend hospital committee meetings when possible',
        'Track stakeholder interactions in your CRM with influence ratings'
      ]
    },
    {
      focus: 'Understanding Stakeholder Priorities',
      whyItMatters: 'Different stakeholders have different priorities: clinicians focus on outcomes, administrators on cost, pharmacists on safety and formulary management. Tailoring your message to each stakeholder\'s priorities increases relevance and buy-in. A one-size-fits-all approach fails in complex organizations.',
      nextAction: 'Before your next stakeholder meeting, research their role and prepare 3 talking points aligned with their specific priorities (clinical, financial, operational). Document their stated priorities during the conversation.',
      keyPractices: [
        'Research stakeholder roles and responsibilities before meetings',
        'Ask each stakeholder about their top priorities and challenges',
        'Tailor product messaging to align with stakeholder-specific goals',
        'Provide role-appropriate resources (clinical data, budget impact, safety profiles)'
      ],
      commonChallenges: [
        'Using the same pitch for all stakeholders regardless of role',
        'Not understanding non-clinical priorities (cost, efficiency, safety)',
        'Failing to provide stakeholder-appropriate evidence and resources',
        'Overlooking operational concerns (workflow, training, implementation)'
      ],
      developmentTips: [
        'Create stakeholder-specific value propositions for your product',
        'Develop a library of resources tailored to different roles',
        'Practice role-based messaging with your manager',
        'Study health economics and outcomes research (HEOR) to speak to financial stakeholders'
      ]
    },
    {
      focus: 'Building Cross-Functional Relationships',
      whyItMatters: 'Sustainable product adoption requires support across multiple functions: clinical, pharmacy, nursing, administration. Building relationships across these functions creates a network of advocates who support your product from different angles. Isolated relationships with individual prescribers are fragile.',
      nextAction: 'Identify one non-prescriber stakeholder in your top account (nurse educator, clinical pharmacist, quality improvement lead) and schedule an introductory meeting this week. Focus on understanding their role and challenges.',
      keyPractices: [
        'Engage with nurses, pharmacists, and care coordinators regularly',
        'Provide educational resources for non-prescriber clinical staff',
        'Support quality improvement and patient safety initiatives',
        'Attend multidisciplinary team meetings when invited'
      ],
      commonChallenges: [
        'Limiting interactions to prescribers only',
        'Not providing value to non-prescribing stakeholders',
        'Failing to understand how different roles interact in patient care',
        'Overlooking the influence of nursing and pharmacy staff'
      ],
      developmentTips: [
        'Create a "stakeholder engagement plan" for each major account',
        'Offer lunch-and-learns for multidisciplinary teams',
        'Provide clinical resources that support nursing and pharmacy education',
        'Track engagement across all stakeholder types in your CRM'
      ]
    },
    {
      focus: 'Leveraging Clinical Champions',
      whyItMatters: 'Clinical champions - respected physicians who advocate for your product - are force multipliers. They influence peers, participate in committees, and drive protocol changes. Identifying and supporting champions accelerates adoption across entire systems. Without champions, you\'re fighting an uphill battle alone.',
      nextAction: 'Identify your top clinical champion and ask them: "What would help you advocate for [product] with your colleagues?" Provide the resources, data, or support they need to be effective advocates.',
      keyPractices: [
        'Identify early adopters who see value in your product',
        'Provide champions with clinical data, presentations, and peer-reviewed evidence',
        'Support champions in presenting at grand rounds or committee meetings',
        'Recognize and thank champions for their advocacy'
      ],
      commonChallenges: [
        'Not identifying who the true clinical influencers are',
        'Failing to provide champions with tools to advocate effectively',
        'Overlooking the need to maintain champion relationships',
        'Not expanding beyond initial champions to build broader support'
      ],
      developmentTips: [
        'Ask prescribers: "Who do you turn to for advice on new treatments?"',
        'Track prescribing data to identify early adopters',
        'Create a "champion toolkit" with presentations and clinical summaries',
        'Involve your MSL team to support champion development'
      ]
    },
    {
      focus: 'Navigating Organizational Politics',
      whyItMatters: 'Healthcare organizations have complex political dynamics: competing priorities, budget constraints, historical relationships with competitors. Understanding these dynamics helps you navigate resistance, build coalitions, and time your initiatives strategically. Ignoring politics leads to unexpected roadblocks.',
      nextAction: 'In your next stakeholder conversation, ask: "What are the biggest organizational priorities right now?" and "Are there any initiatives or changes happening that might impact treatment decisions?" Use this to align your strategy.',
      keyPractices: [
        'Understand organizational priorities and strategic initiatives',
        'Identify potential sources of resistance and address them proactively',
        'Build coalitions of support across multiple stakeholders',
        'Time your initiatives to align with organizational readiness'
      ],
      commonChallenges: [
        'Pushing for adoption without understanding organizational readiness',
        'Not identifying sources of resistance early',
        'Failing to build broad-based support before major initiatives',
        'Ignoring budget cycles and decision-making timelines'
      ],
      developmentTips: [
        'Study organizational strategic plans and quality improvement goals',
        'Ask stakeholders about decision-making processes and timelines',
        'Map out potential sources of resistance and plan mitigation strategies',
        'Align product positioning with organizational priorities (cost savings, quality metrics)'
      ]
    }
  ],
  
  'clinical-data': [
    {
      focus: 'Translating Data into Clinical Relevance',
      whyItMatters: 'HCPs are bombarded with clinical data daily. Simply presenting numbers doesn\'t create impact. Translating data into clinically meaningful outcomes - what it means for their patients - makes your message memorable and actionable. Data without context is noise.',
      nextAction: 'Take your product\'s primary endpoint and practice explaining it in one sentence that focuses on patient impact, not statistics. Use this patient-centered framing in your next three calls.',
      keyPractices: [
        'Focus on patient-relevant outcomes, not just statistical significance',
        'Use absolute risk reduction alongside relative risk reduction',
        'Explain NNT (number needed to treat) in practical terms',
        'Connect data points to real-world patient scenarios'
      ],
      commonChallenges: [
        'Overwhelming HCPs with too many data points',
        'Using statistical jargon without clinical translation',
        'Focusing on secondary endpoints that don\'t matter to HCPs',
        'Not connecting data to the specific patients HCPs treat'
      ],
      developmentTips: [
        'Practice the "So what?" test - for every data point, explain why it matters',
        'Create patient case studies that illustrate key data points',
        'Study how medical journals present data in clinical context',
        'Role-play data presentations with colleagues and get feedback'
      ]
    },
    {
      focus: 'Addressing Data Limitations Proactively',
      whyItMatters: 'Every product has data limitations: small sample sizes, short duration, specific populations, lack of head-to-head comparisons. HCPs know this. Addressing limitations proactively builds credibility and trust. Avoiding limitations makes you look evasive and damages trust.',
      nextAction: 'Identify the top 3 limitations of your product\'s clinical data. In your next call, proactively mention one limitation and explain how it should be interpreted. This demonstrates scientific integrity.',
      keyPractices: [
        'Acknowledge study limitations honestly',
        'Explain how limitations should inform clinical decision-making',
        'Provide context for why limitations exist (study design, regulatory requirements)',
        'Offer additional data sources that address limitations (real-world evidence, post-marketing studies)'
      ],
      commonChallenges: [
        'Avoiding discussion of data limitations',
        'Being defensive when HCPs point out limitations',
        'Not understanding the clinical implications of limitations',
        'Failing to provide context or additional supporting evidence'
      ],
      developmentTips: [
        'Create a "limitations and responses" guide for your product',
        'Practice discussing limitations confidently and honestly',
        'Study how medical journals discuss study limitations',
        'Work with your MSL team to understand nuanced data interpretation'
      ]
    },
    {
      focus: 'Using Real-World Evidence Effectively',
      whyItMatters: 'While RCTs provide efficacy data, real-world evidence (RWE) shows effectiveness in actual clinical practice. HCPs value RWE because it reflects their patient populations and practice settings. Combining RCT data with RWE creates a compelling, comprehensive evidence story.',
      nextAction: 'Identify one real-world evidence study for your product. In your next call, present this alongside your pivotal trial data, emphasizing how real-world results confirm clinical trial findings.',
      keyPractices: [
        'Understand the difference between efficacy (RCT) and effectiveness (RWE)',
        'Present RWE that addresses HCP concerns about generalizability',
        'Use RWE to demonstrate adherence, persistence, and real-world outcomes',
        'Highlight RWE from similar patient populations or practice settings'
      ],
      commonChallenges: [
        'Relying exclusively on RCT data without real-world context',
        'Not understanding the strengths and limitations of RWE',
        'Failing to connect RWE to HCP-specific practice settings',
        'Overlooking post-marketing surveillance and registry data'
      ],
      developmentTips: [
        'Build a library of RWE studies for your product',
        'Study health economics and outcomes research (HEOR) methodologies',
        'Ask HCPs what real-world questions they have about your product',
        'Partner with your HEOR team to understand RWE interpretation'
      ]
    },
    {
      focus: 'Comparative Effectiveness Communication',
      whyItMatters: 'HCPs constantly compare treatments. When head-to-head data exists, present it confidently. When it doesn\'t, use indirect comparisons, network meta-analyses, or real-world comparative effectiveness studies. Avoiding comparative discussions makes HCPs suspicious.',
      nextAction: 'Prepare a 2-minute comparative effectiveness summary for your product vs. the most common alternative. Focus on clinically meaningful differences, not just statistical significance. Use this in your next call.',
      keyPractices: [
        'Present head-to-head data when available',
        'Use indirect comparisons and network meta-analyses appropriately',
        'Focus on clinically meaningful differences, not just p-values',
        'Acknowledge when comparative data is limited or unavailable'
      ],
      commonChallenges: [
        'Avoiding comparative discussions when data is unfavorable',
        'Misusing indirect comparisons or making inappropriate claims',
        'Focusing on statistical significance without clinical relevance',
        'Being defensive when competitors have data advantages'
      ],
      developmentTips: [
        'Study network meta-analyses and understand their limitations',
        'Create a comparative effectiveness summary for your product',
        'Practice discussing comparative data objectively',
        'Work with medical affairs to understand appropriate comparative claims'
      ]
    },
    {
      focus: 'Safety Profile Mastery',
      whyItMatters: 'Safety concerns are often the primary barrier to prescribing. Demonstrating deep knowledge of your product\'s safety profile - including rare adverse events, drug interactions, and monitoring requirements - builds confidence. Superficial safety knowledge raises red flags.',
      nextAction: 'Review your product\'s prescribing information and identify the top 3 safety concerns HCPs ask about. Prepare clear, evidence-based responses that include incidence rates, management strategies, and monitoring recommendations.',
      keyPractices: [
        'Know incidence rates of common and serious adverse events',
        'Understand drug-drug interactions and contraindications thoroughly',
        'Provide practical guidance on monitoring and adverse event management',
        'Compare safety profile to alternatives when appropriate'
      ],
      commonChallenges: [
        'Minimizing or avoiding safety discussions',
        'Not knowing incidence rates or comparative safety data',
        'Failing to provide practical management guidance',
        'Being unprepared for questions about rare but serious adverse events'
      ],
      developmentTips: [
        'Memorize key safety data points and incidence rates',
        'Create a "safety FAQ" document for quick reference',
        'Study case reports of adverse events and their management',
        'Role-play safety discussions with your manager'
      ]
    }
  ],
  
  'objection-handling': [
    {
      focus: 'Reframing Objections as Opportunities',
      whyItMatters: 'Objections signal engagement - the HCP is thinking critically about your product. Viewing objections as opportunities to provide value, rather than obstacles, changes your mindset and approach. Defensive responses shut down dialogue; curious, solution-oriented responses build trust.',
      nextAction: 'In your next call, when you hear an objection, pause and say: "That\'s a great question. Can you tell me more about your concern?" Listen fully before responding. This demonstrates respect and uncovers the real issue.',
      keyPractices: [
        'Welcome objections as signs of engagement',
        'Ask clarifying questions to understand the root concern',
        'Acknowledge the validity of the concern before responding',
        'Provide evidence-based responses that address the specific concern'
      ],
      commonChallenges: [
        'Becoming defensive when objections arise',
        'Responding too quickly without understanding the real concern',
        'Using scripted responses that don\'t address the specific objection',
        'Failing to confirm that your response resolved the concern'
      ],
      developmentTips: [
        'Practice the "pause and clarify" technique with colleagues',
        'Record yourself handling objections and review your tone',
        'Create an objection log to identify patterns and improve responses',
        'Role-play difficult objections with your manager'
      ]
    },
    {
      focus: 'Evidence-Based Objection Resolution',
      whyItMatters: 'Opinions don\'t overcome objections - evidence does. Having clinical data, real-world evidence, and peer-reviewed publications ready to address common objections demonstrates preparation and scientific rigor. Anecdotal responses undermine credibility.',
      nextAction: 'Identify the top 5 objections you hear most frequently. For each, prepare a 1-minute evidence-based response with specific data points and references. Practice delivering these responses conversationally.',
      keyPractices: [
        'Prepare evidence-based responses for common objections',
        'Use specific data points, not vague claims',
        'Provide references to peer-reviewed publications',
        'Follow up with written materials that support your response'
      ],
      commonChallenges: [
        'Relying on anecdotal evidence or opinions',
        'Not having data readily available to address objections',
        'Using vague or unsupported claims',
        'Failing to provide references or follow-up materials'
      ],
      developmentTips: [
        'Create an "objection response guide" with data and references',
        'Work with medical affairs to develop evidence-based responses',
        'Keep key studies and data on your tablet for quick reference',
        'Practice citing data conversationally, not robotically'
      ]
    },
    {
      focus: 'Handling Cost and Access Objections',
      whyItMatters: 'Cost and access objections are among the most common and challenging. HCPs want to prescribe effective treatments but face real barriers: formulary restrictions, prior authorization, patient affordability. Addressing these objections requires knowledge of access solutions, not just clinical data.',
      nextAction: 'For your next cost objection, respond with: "I understand cost is a concern. Let me share the patient assistance programs and copay support we offer." Provide specific information about access resources.',
      keyPractices: [
        'Know your product\'s formulary status across major payers',
        'Understand prior authorization requirements and how to streamline them',
        'Provide detailed information about patient assistance programs',
        'Offer to connect HCPs with reimbursement specialists'
      ],
      commonChallenges: [
        'Not knowing formulary status or access barriers',
        'Failing to provide concrete solutions for cost concerns',
        'Avoiding cost discussions instead of addressing them proactively',
        'Not following up to ensure access solutions were successful'
      ],
      developmentTips: [
        'Create a territory-specific access resource guide',
        'Build relationships with payer account managers',
        'Track prior authorization approval rates and timelines',
        'Develop case studies showing successful access navigation'
      ]
    },
    {
      focus: 'Addressing Competitive Objections',
      whyItMatters: 'HCPs will compare your product to alternatives. Competitive objections require balanced, factual responses that highlight your product\'s differentiation without disparaging competitors. Defensive or negative responses damage credibility and violate compliance standards.',
      nextAction: 'Prepare a 2-minute response to the most common competitive objection you face. Focus on your product\'s unique benefits and appropriate patient populations, without mentioning competitors negatively. Practice this response until it feels natural.',
      keyPractices: [
        'Focus on your product\'s unique benefits and differentiation',
        'Use head-to-head data when available',
        'Acknowledge competitor strengths while highlighting your advantages',
        'Identify specific patient populations where your product excels'
      ],
      commonChallenges: [
        'Making negative or disparaging comments about competitors',
        'Being defensive when competitors are mentioned favorably',
        'Not understanding competitor products well enough to differentiate',
        'Failing to identify scenarios where your product is the better choice'
      ],
      developmentTips: [
        'Study competitor clinical data and positioning',
        'Create a competitive differentiation matrix',
        'Practice responding to competitive objections neutrally',
        'Work with medical affairs to develop compliant competitive messaging'
      ]
    },
    {
      focus: 'Overcoming Clinical Skepticism',
      whyItMatters: 'Some HCPs are inherently skeptical of new treatments or pharmaceutical sales representatives. This skepticism is often based on past experiences or general distrust of the industry. Overcoming it requires patience, consistency, scientific integrity, and demonstrating genuine value over time.',
      nextAction: 'Identify your most skeptical HCP. In your next interaction, focus entirely on providing value (clinical insights, patient resources, educational materials) without asking for anything in return. Build trust through consistent, helpful engagement.',
      keyPractices: [
        'Demonstrate scientific integrity by acknowledging data limitations',
        'Provide value consistently without always asking for commitments',
        'Share educational resources and clinical insights generously',
        'Be patient - trust builds over multiple interactions'
      ],
      commonChallenges: [
        'Becoming frustrated with skeptical HCPs',
        'Pushing for commitments before trust is established',
        'Not understanding the root cause of skepticism',
        'Failing to differentiate yourself from other sales reps'
      ],
      developmentTips: [
        'Study the psychology of trust-building in professional relationships',
        'Focus on long-term relationship building, not short-term wins',
        'Ask skeptical HCPs what would be valuable to them',
        'Document trust-building activities and track progress over time'
      ]
    }
  ],
  
  'closing-techniques': [
    {
      focus: 'Recognizing Buying Signals',
      whyItMatters: 'HCPs give verbal and non-verbal signals when they\'re ready to commit: asking about dosing, inquiring about samples, discussing specific patients. Missing these signals means missed opportunities. Recognizing them allows you to close naturally and confidently.',
      nextAction: 'In your next three calls, actively listen for buying signals: questions about prescribing, mentions of specific patients, or requests for resources. When you hear one, immediately move to a trial close: "Would you like to try [product] with your next appropriate patient?"',
      keyPractices: [
        'Listen for questions about practical prescribing (dosing, titration, monitoring)',
        'Notice when HCPs mention specific patients who might benefit',
        'Recognize requests for samples, starter packs, or patient resources as buying signals',
        'Pay attention to positive body language and engagement'
      ],
      commonChallenges: [
        'Missing buying signals because you\'re focused on your presentation',
        'Continuing to present after the HCP is ready to commit',
        'Not recognizing subtle signals (questions, patient mentions)',
        'Failing to act on buying signals with a clear ask'
      ],
      developmentTips: [
        'Record calls (with permission) and review for missed buying signals',
        'Practice active listening - focus on HCP responses, not your next point',
        'Create a "buying signals checklist" and review after each call',
        'Role-play with colleagues to improve signal recognition'
      ]
    },
    {
      focus: 'The Assumptive Close',
      whyItMatters: 'The assumptive close - acting as if the HCP has already decided to prescribe - works because it reduces decision friction. Instead of asking "Will you prescribe?", you ask "When will you prescribe?" This subtle shift makes commitment feel natural and expected.',
      nextAction: 'In your next call where the HCP shows interest, use an assumptive close: "For your next patient with [condition], would you start them on [product]?" This assumes willingness and focuses on the specific action.',
      keyPractices: [
        'Use language that assumes commitment: "When you prescribe..." not "If you prescribe..."',
        'Ask about specific next steps: "For your next appropriate patient..."',
        'Provide resources that support immediate action (samples, dosing guides)',
        'Confirm the commitment with a specific follow-up plan'
      ],
      commonChallenges: [
        'Using tentative language that invites hesitation',
        'Asking yes/no questions instead of assumptive questions',
        'Not providing resources that enable immediate action',
        'Failing to confirm commitment with specific next steps'
      ],
      developmentTips: [
        'Practice assumptive language until it feels natural',
        'Review your closing questions - eliminate "if" and "would you consider"',
        'Role-play assumptive closes with your manager',
        'Track close rates with assumptive vs. tentative language'
      ]
    },
    {
      focus: 'Trial Close Technique',
      whyItMatters: 'Trial closes - asking for small commitments throughout the conversation - gauge readiness and build momentum toward a final commitment. They reduce the pressure of a single "big ask" and allow you to address concerns incrementally. Trial closes make final closes feel natural.',
      nextAction: 'In your next call, use three trial closes: "Does this data address your concern about efficacy?" "Can you see this working for your [patient type]?" "Would you like to see the dosing guide?" Each yes builds toward the final ask.',
      keyPractices: [
        'Ask for small commitments throughout the conversation',
        'Use trial closes to gauge readiness: "Does this make sense?" "Can you see the benefit?"',
        'Address concerns revealed by trial closes before moving forward',
        'Build momentum with multiple small yeses before the final ask'
      ],
      commonChallenges: [
        'Waiting until the end to ask for any commitment',
        'Not using trial closes to gauge readiness',
        'Ignoring hesitation revealed by trial closes',
        'Moving to final close without building momentum'
      ],
      developmentTips: [
        'Plan 3-4 trial close questions for each call',
        'Practice transitioning from trial closes to final close',
        'Track which trial closes are most effective',
        'Use trial closes to identify and address objections early'
      ]
    },
    {
      focus: 'Overcoming Closing Hesitation',
      whyItMatters: 'Many sales reps hesitate to ask for commitment, fearing rejection or damaging the relationship. This hesitation costs opportunities. HCPs expect you to ask for commitment - it\'s your job. Asking confidently and professionally strengthens relationships by demonstrating conviction in your product.',
      nextAction: 'Commit to asking for a specific commitment in every call this week. Even if the answer is no, practice asking confidently: "Based on what we\'ve discussed, would you be willing to try [product] with your next appropriate patient?"',
      keyPractices: [
        'Ask for commitment in every call - make it a habit',
        'Use confident, direct language when closing',
        'Accept "no" gracefully and ask what would need to change',
        'View closing as a natural part of the conversation, not an imposition'
      ],
      commonChallenges: [
        'Avoiding the ask due to fear of rejection',
        'Using tentative, apologetic language when closing',
        'Ending calls without asking for any commitment',
        'Taking "no" personally instead of as information'
      ],
      developmentTips: [
        'Practice closing language until it feels comfortable',
        'Reframe rejection as information, not personal failure',
        'Set a goal to ask for commitment in 100% of calls',
        'Celebrate asking, not just getting yes - the ask is the win'
      ]
    },
    {
      focus: 'Post-Close Follow-Through',
      whyItMatters: 'Getting a commitment is only the beginning. Following through with promised resources, checking on first prescriptions, and addressing implementation challenges ensures commitments turn into sustained prescribing. Lack of follow-through damages credibility and wastes the effort of closing.',
      nextAction: 'For every commitment you receive this week, schedule a follow-up within 2 weeks. In the follow-up, ask: "Have you had a chance to prescribe [product]? How did it go?" Provide additional support as needed.',
      keyPractices: [
        'Deliver promised resources immediately after closing',
        'Schedule follow-up calls to check on first prescriptions',
        'Address implementation challenges proactively',
        'Celebrate early wins and provide ongoing support'
      ],
      commonChallenges: [
        'Failing to follow up after getting commitment',
        'Not delivering promised resources promptly',
        'Assuming commitment automatically leads to prescribing',
        'Not providing support for implementation challenges'
      ],
      developmentTips: [
        'Create a post-close follow-up checklist',
        'Set calendar reminders for follow-up calls',
        'Track time from commitment to first prescription',
        'Develop resources that support implementation (dosing guides, patient education)'
      ]
    }
  ],
  
  'signal-intelligence': [
    {
      focus: 'Reading Non-Verbal Communication',
      whyItMatters: 'HCPs communicate as much through body language, tone, and facial expressions as through words. Reading these signals allows you to adjust your approach in real-time, address unspoken concerns, and build rapport. Ignoring non-verbal cues means missing critical information.',
      nextAction: 'In your next in-person call, consciously observe the HCP\'s body language. Notice: Are they leaning in or back? Making eye contact? Checking their watch? Adjust your approach based on engagement signals.',
      keyPractices: [
        'Observe body language: posture, eye contact, facial expressions',
        'Listen for tone changes that signal interest or concern',
        'Notice engagement signals: leaning in, asking questions, taking notes',
        'Adjust your pace and approach based on non-verbal feedback'
      ],
      commonChallenges: [
        'Focusing on your presentation instead of observing the HCP',
        'Missing disengagement signals (checking phone, looking away)',
        'Not adjusting approach when non-verbal cues signal problems',
        'Misinterpreting cultural differences in non-verbal communication'
      ],
      developmentTips: [
        'Study non-verbal communication and body language',
        'Practice observing without staring - use peripheral awareness',
        'Debrief after calls: What non-verbal signals did you notice?',
        'Role-play with colleagues using different engagement levels'
      ]
    },
    {
      focus: 'Emotional Intelligence in Sales',
      whyItMatters: 'HCPs are human beings with emotions, stressors, and varying moods. Recognizing and responding to emotional states - frustration, enthusiasm, skepticism, stress - allows you to adapt your approach and build genuine connections. Ignoring emotional context makes you seem tone-deaf.',
      nextAction: 'Before your next call, take 30 seconds to assess the HCP\'s emotional state when you enter. Are they rushed? Relaxed? Frustrated? Adjust your approach accordingly - if rushed, be concise; if relaxed, engage more deeply.',
      keyPractices: [
        'Assess emotional state at the beginning of each interaction',
        'Show empathy for stressors and challenges HCPs face',
        'Adjust your energy and approach to match the situation',
        'Build emotional rapport through genuine interest and respect'
      ],
      commonChallenges: [
        'Ignoring emotional context and delivering scripted presentations',
        'Not showing empathy for HCP stressors and time constraints',
        'Pushing forward when the HCP is clearly not receptive',
        'Failing to build emotional connection beyond transactional interactions'
      ],
      developmentTips: [
        'Study emotional intelligence and practice self-awareness',
        'Ask HCPs about their day and genuinely listen',
        'Practice empathy statements: "I know you\'re busy..." "That sounds challenging..."',
        'Reflect on your own emotional state and how it affects interactions'
      ]
    },
    {
      focus: 'Detecting Resistance and Objections Early',
      whyItMatters: 'Resistance often appears before it\'s verbalized: hesitation, skeptical questions, body language shifts. Detecting resistance early allows you to address concerns before they solidify into hard objections. Waiting until resistance is fully formed makes it harder to overcome.',
      nextAction: 'In your next call, watch for early resistance signals: furrowed brow, hesitant tone, "but" statements. When you detect resistance, pause and ask: "I sense some hesitation. What concerns do you have?" Address it immediately.',
      keyPractices: [
        'Watch for early resistance signals: hesitation, skeptical questions, body language',
        'Address resistance immediately with clarifying questions',
        'Validate concerns before responding: "That\'s a fair concern..."',
        'Adjust your approach based on the type of resistance'
      ],
      commonChallenges: [
        'Missing early resistance signals and continuing to present',
        'Not addressing resistance until it becomes a hard objection',
        'Becoming defensive when resistance appears',
        'Failing to validate concerns before responding'
      ],
      developmentTips: [
        'Create a "resistance signals" checklist',
        'Practice the "pause and clarify" technique',
        'Review calls to identify missed resistance signals',
        'Role-play with colleagues showing different resistance levels'
      ]
    },
    {
      focus: 'Building Rapport Through Active Listening',
      whyItMatters: 'Rapport isn\'t built through charm or small talk - it\'s built through genuine listening and demonstrating that you value the HCP\'s perspective. Active listening - reflecting, clarifying, remembering - shows respect and builds trust. Talking more than listening damages rapport.',
      nextAction: 'In your next call, set a goal to listen 70% of the time and talk 30%. Use reflective listening: "So what I\'m hearing is..." and "Tell me more about..." to demonstrate engagement.',
      keyPractices: [
        'Listen more than you talk - aim for 70/30 ratio',
        'Use reflective listening to show understanding',
        'Ask follow-up questions that demonstrate you\'re listening',
        'Remember and reference previous conversations'
      ],
      commonChallenges: [
        'Talking too much and not giving HCPs space to share',
        'Waiting to talk instead of truly listening',
        'Not asking follow-up questions that show engagement',
        'Forgetting details from previous conversations'
      ],
      developmentTips: [
        'Practice the 70/30 listening rule',
        'Take notes during conversations to remember key details',
        'Use CRM to document insights and reference in future calls',
        'Record yourself (with permission) and calculate talk/listen ratio'
      ]
    },
    {
      focus: 'Adapting Communication Style',
      whyItMatters: 'Different HCPs have different communication preferences: some want data and details, others want bottom-line summaries; some are relationship-focused, others are transactional. Adapting your style to match their preferences increases effectiveness. One-size-fits-all communication fails.',
      nextAction: 'Categorize your top 10 HCPs by communication style: Analytical (data-driven), Driver (results-focused), Expressive (relationship-oriented), or Amiable (consensus-seeking). Adjust your approach for each style in your next calls.',
      keyPractices: [
        'Identify each HCP\'s communication style and preferences',
        'Adjust your pace, detail level, and approach accordingly',
        'Provide information in the format they prefer (data, stories, summaries)',
        'Respect their time and interaction preferences'
      ],
      commonChallenges: [
        'Using the same approach with all HCPs regardless of style',
        'Not recognizing different communication preferences',
        'Providing too much detail for drivers or too little for analyticals',
        'Failing to adapt when your natural style doesn\'t match theirs'
      ],
      developmentTips: [
        'Study communication style frameworks (DISC, Myers-Briggs)',
        'Document communication preferences in your CRM',
        'Practice adapting your style with colleagues of different types',
        'Ask HCPs directly: "What\'s the best way to share information with you?"'
      ]
    }
  ]
};

/**
 * Get a random coaching variant for a module.
 * This simulates dynamic content generation while maintaining quality.
 */
export function getCoachingContent(moduleId: string): CoachingContent | null {
  const variants = COACHING_LIBRARY[moduleId];
  if (!variants || variants.length === 0) {
    return null;
  }
  
  // Use timestamp-based rotation to ensure different content on each call
  const index = Math.floor(Date.now() / 1000) % variants.length;
  return variants[index];
}

/**
 * Get all coaching variants for a module (for testing/preview).
 */
export function getAllCoachingVariants(moduleId: string): CoachingContent[] {
  return COACHING_LIBRARY[moduleId] || [];
}

/**
 * Get a specific coaching variant by index.
 */
export function getCoachingVariant(moduleId: string, variantIndex: number): CoachingContent | null {
  const variants = COACHING_LIBRARY[moduleId];
  if (!variants || variantIndex < 0 || variantIndex >= variants.length) {
    return null;
  }
  return variants[variantIndex];
}