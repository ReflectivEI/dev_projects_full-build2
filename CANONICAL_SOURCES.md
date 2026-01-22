# CANONICAL SOURCES — SIGNAL INTELLIGENCE SCORING SYSTEM

**Version:** 1.0  
**Date:** January 22, 2026  
**Status:** AUTHORITATIVE  
**Purpose:** Define canonical sources of truth for Signal Intelligence implementation

---

## DUAL-CANONICAL MODEL

The Signal Intelligence scoring system operates under a **dual-canonical model** with clear separation of concerns:

### 1. Signal Intelligence Definitions and Measurements (Display Layer)
**Canonical For:**
- Metric meanings and purpose
- User-facing display content
- Governance rules and principles
- Observable behavior definitions
- "What It Measures" descriptions
- "What Strong Performance Looks Like" criteria
- "Why It Matters" explanations
- Coaching insights and recommendations

**File Locations:**
- `src/lib/data.ts` (SignalCapability interface, 13 fields)
- `src/lib/behavioral-metrics-spec.ts` (Extended display content)

**Authority:** This document governs **WHAT** we measure and **WHY** it matters.

---

### 2. Scoring Framework and Calculation Blueprint (Scoring Layer)
**Canonical For:**
- Sub-metric names and groupings (32 components across 8 metrics)
- Component weights (0.25, 0.33, 0.34)
- Scoring thresholds (≥X → score mappings)
- Roll-up formulas (average vs. weighted_average)
- Heuristic detection logic (phrase lists, token overlap thresholds)
- Applicability gating rules

**File Locations:**
- `src/lib/signal-intelligence/metrics-spec.ts` (Specification)
- `src/lib/signal-intelligence/scoring.ts` (Implementation)

**Authority:** This document governs **HOW** we calculate scores.

**Version Tracking:** `metricsVersion` field identifies the active Signal Intelligence scoring contract (currently "SI-v1").

---

## CRITICAL GOVERNANCE RULES

### ⛔ FORBIDDEN: Deriving Scoring from Display Content

**You MUST NOT:**
- Extract scoring thresholds from "What Strong Performance Looks Like" text
- Infer sub-metrics from "Observable Behaviors" lists
- Derive weights from display content emphasis
- Generate heuristics from coaching insights

**Why:** Display content is optimized for human readability and coaching effectiveness, NOT for algorithmic precision. Scoring logic requires explicit thresholds, weights, and formulas that are NOT present in display content.

**Correct Approach:**
- Display content → Read from `data.ts` (Definitions & Measurements)
- Scoring logic → Read from `metrics-spec.ts` (Scoring Blueprint)
- NEVER mix the two

---

### ✅ REQUIRED: Observable Behaviors Only

**All scoring heuristics MUST:**
- Detect observable behaviors (phrase presence, token overlap, turn counts)
- Avoid sentiment analysis (positive/negative tone detection)
- Avoid intent detection (inferring customer motivation)
- Avoid outcome prediction (forecasting deal success)

**Rationale:** Signal Intelligence measures **what happened** in the conversation, not **what it means** or **what will happen**.

---

### ✅ REQUIRED: Applicability Gating

**Scores MUST be marked as `applicable: false` when:**
- Insufficient data exists to calculate the score
- The behavior being measured did not occur in the conversation
- The metric is optional and no relevant cues are present

**Never use placeholder scores (1, 2, 3, 5) when data is insufficient.**

---

## IMPLEMENTATION VERIFICATION

### Phase 1: Default Score Remediation ✅ COMPLETE
**Date:** January 22, 2026  
**Status:** All 17 default score violations eliminated  
**Documentation:** `PHASE_1_DEFAULT_SCORES_REMEDIATION_COMPLETE.md`

### Phase 2: Canonical Blueprint Verification ✅ COMPLETE
**Date:** January 22, 2026  
**Status:** 100% compliance (32/32 sub-metrics verified)  
**Documentation:** `PHASE_2_CANONICAL_BLUEPRINT_VERIFICATION.md`

**Verified:**
- ✅ All 32 sub-metric names match Blueprint
- ✅ All weights match Blueprint (0.25, 0.33, 0.34)
- ✅ All thresholds match Blueprint
- ✅ Weighted averaging explicitly supported
- ✅ No additional heuristics beyond Blueprint
- ✅ No contradictions with Definitions & Measurements

---

## ARCHITECTURAL BOUNDARIES

### Display Layer (Frontend UI)
**Responsibility:** Show metric meanings, coaching insights, and performance context  
**Data Source:** `data.ts` (Definitions & Measurements)  
**Components:**
- `src/pages/ei-metrics.tsx` (Behavioral Metrics page)
- `src/components/eq-metric-card.tsx` (Metric cards)
- `src/components/signal-intelligence-panel.tsx` (Live analysis panel)

**Rule:** Display components MUST NOT perform scoring calculations.

---

### Scoring Layer (Calculation Engine)
**Responsibility:** Calculate metric scores from conversation transcripts  
**Data Source:** `metrics-spec.ts` (Scoring Blueprint)  
**Components:**
- `src/lib/signal-intelligence/scoring.ts` (Scoring engine)
- `src/lib/signal-intelligence/metrics-spec.ts` (Specification)

**Rule:** Scoring engine MUST NOT reference display content for calculation logic.

---

### Integration Layer (Data Flow)
**Responsibility:** Connect scoring results to display components  
**Data Source:** Both (scores from scoring layer, display content from data layer)  
**Components:**
- `src/lib/metrics-ui-adapter.ts` (Adapter pattern)
- `src/pages/roleplay.tsx` (Role-play feedback)
- `src/components/roleplay-feedback-dialog.tsx` (Feedback dialog)

**Rule:** Adapters MAY combine data from both sources but MUST NOT modify scoring logic.

---

## FUTURE DEVELOPMENT GUIDELINES

### Adding a New Metric
1. **Define meaning** in `data.ts` (Definitions & Measurements)
2. **Define scoring** in `metrics-spec.ts` (Scoring Blueprint)
3. **Implement scoring** in `scoring.ts`
4. **Verify** against both canonical sources
5. **Document** in this file

### Modifying Existing Metrics
1. **Identify layer:** Display content OR scoring logic?
2. **Update canonical source:** `data.ts` OR `metrics-spec.ts`
3. **Update implementation:** UI components OR `scoring.ts`
4. **Verify** no cross-layer contamination
5. **Document** changes

### Refactoring Scoring Logic
1. **Verify Blueprint alignment** before making changes
2. **Preserve thresholds, weights, and formulas** exactly
3. **Maintain applicability gating** logic
4. **Run verification audit** after changes
5. **Update this document** if canonical sources change

---

## COMPLIANCE CHECKLIST

Before deploying changes to Signal Intelligence:

- [ ] Display content sourced from `data.ts` only
- [ ] Scoring logic sourced from `metrics-spec.ts` only
- [ ] No placeholder scores (all use `score: null, applicable: false` when insufficient data)
- [ ] No sentiment/intent/outcome detection
- [ ] All 32 sub-metrics match Blueprint
- [ ] All weights match Blueprint (0.25, 0.33, 0.34)
- [ ] All thresholds match Blueprint
- [ ] Weighted averaging used only where specified
- [ ] Applicability gating properly implemented
- [ ] No cross-layer contamination

---

## CONTACT & GOVERNANCE

**Document Owner:** Engineering Team  
**Review Cycle:** Quarterly or when canonical sources change  
**Last Verified:** January 22, 2026  
**Next Review:** April 22, 2026

**Questions or Concerns:**
- Scoring logic issues → Review `metrics-spec.ts` and `scoring.ts`
- Display content issues → Review `data.ts` and `behavioral-metrics-spec.ts`
- Canonical source conflicts → Escalate to technical governance

---

## VERSION HISTORY

### v1.0 (January 22, 2026)
- Initial creation
- Documented dual-canonical model
- Verified Phase 1 and Phase 2 compliance
- Established governance rules
- Defined architectural boundaries

---

**END OF CANONICAL SOURCES DOCUMENTATION**
