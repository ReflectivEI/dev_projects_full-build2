// READ-ONLY Worker Contract Verification Probe
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const WORKER_URL = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';

  const minimalPayload = {
    messages: [
      {
        role: 'user',
        content: 'Hello, I would like to discuss treatment options for my patient.'
      },
      {
        role: 'assistant',
        content: 'Thank you for reaching out. I would be happy to discuss treatment options with you. What specific condition are you looking to address?'
      }
    ],
    scenarioId: 'contract-verification-probe'
  };

  try {
    const response = await fetch(WORKER_URL + '/api/roleplay/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': `probe-${Date.now()}`
      },
      body: JSON.stringify(minimalPayload)
    });

    const data = await response.json();

    const analysis = {
      status: response.status,
      statusText: response.statusText,
      topLevelKeys: Object.keys(data),
      hasCoach: !!data.coach,
      hasCoachMetricResults: !!data.coach?.metricResults,
      hasAnalysis: !!data.analysis,
      hasAnalysisEqMetrics: !!data.analysis?.eqMetrics,
      coachMetricResultsKeys: data.coach?.metricResults ? Object.keys(data.coach.metricResults) : [],
      coachOverall: data.coach?.overall,
      rawResponse: data
    };

    // Determine verdict
    let verdict = 'UNKNOWN';
    let recommendation = '';

    if (data.coach?.metricResults && Object.keys(data.coach.metricResults).length > 0) {
      verdict = 'CASE_1_WORKER_CORRECT';
      recommendation = 'Worker is returning coach.metricResults. UI issue is frontend cache or adapter guard. Hard refresh browser.';
    } else if (data.analysis?.eqMetrics) {
      verdict = 'CASE_2_WRONG_BACKEND';
      recommendation = 'Response has analysis.eqMetrics. Environment mismatch (wrong Worker/preview/proxy).';
    } else if (data.coach && Object.keys(data.coach.metricResults || {}).length === 0) {
      verdict = 'CASE_3_SCORING_FAILED';
      recommendation = 'coach.metricResults is empty. Worker scoring failed or fallback executed.';
    }

    res.json({
      verdict,
      recommendation,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Probe failed',
      message: error.message,
      stack: error.stack
    });
  }
}
