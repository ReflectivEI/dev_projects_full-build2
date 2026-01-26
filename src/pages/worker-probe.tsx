import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ProbeResult {
  verdict: string;
  recommendation: string;
  analysis: {
    status: number;
    statusText: string;
    topLevelKeys: string[];
    hasCoach: boolean;
    hasCoachMetricResults: boolean;
    hasAnalysis: boolean;
    hasAnalysisEqMetrics: boolean;
    coachMetricResultsKeys: string[];
    coachOverall?: number;
    rawResponse: any;
  };
  timestamp: string;
}

export default function WorkerProbe() {
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runProbe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/probe-worker');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runProbe();
  }, []);

  const getVerdictIcon = (verdict: string) => {
    if (verdict === 'CASE_1_WORKER_CORRECT') return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    if (verdict === 'CASE_2_WRONG_BACKEND') return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    if (verdict === 'CASE_3_SCORING_FAILED') return <XCircle className="h-6 w-6 text-red-500" />;
    return <AlertCircle className="h-6 w-6 text-gray-500" />;
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === 'CASE_1_WORKER_CORRECT') return 'bg-green-100 text-green-800 border-green-300';
    if (verdict === 'CASE_2_WRONG_BACKEND') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (verdict === 'CASE_3_SCORING_FAILED') return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Worker Contract Verification</h1>
        <p className="text-muted-foreground">
          This probe sends a minimal roleplay request to the production Worker and analyzes the response structure.
        </p>
      </div>

      <div className="mb-4">
        <Button onClick={runProbe} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Probing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Probe Again
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-red-300 bg-red-50 mb-6">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Probe Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          {/* Verdict Card */}
          <Card className={`border-2 ${getVerdictColor(result.verdict)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getVerdictIcon(result.verdict)}
                <span>Verdict: {result.verdict.replace(/_/g, ' ')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium mb-2">{result.recommendation}</p>
              <p className="text-sm text-muted-foreground">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle>Response Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">HTTP Status</p>
                  <p className="text-lg font-semibold">{result.analysis.status} {result.analysis.statusText}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top-Level Keys</p>
                  <p className="text-lg font-semibold">{result.analysis.topLevelKeys.join(', ')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Key Presence Check</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>data.coach</span>
                    <Badge variant={result.analysis.hasCoach ? 'default' : 'secondary'}>
                      {result.analysis.hasCoach ? '✅ PRESENT' : '❌ MISSING'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>data.coach.metricResults</span>
                    <Badge variant={result.analysis.hasCoachMetricResults ? 'default' : 'secondary'}>
                      {result.analysis.hasCoachMetricResults ? '✅ PRESENT' : '❌ MISSING'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>data.analysis</span>
                    <Badge variant={result.analysis.hasAnalysis ? 'default' : 'secondary'}>
                      {result.analysis.hasAnalysis ? '✅ PRESENT' : '❌ MISSING'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>data.analysis.eqMetrics</span>
                    <Badge variant={result.analysis.hasAnalysisEqMetrics ? 'default' : 'secondary'}>
                      {result.analysis.hasAnalysisEqMetrics ? '✅ PRESENT' : '❌ MISSING'}
                    </Badge>
                  </div>
                </div>
              </div>

              {result.analysis.hasCoachMetricResults && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Metric Results</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Metrics Found</p>
                      <p className="text-lg font-semibold">{result.analysis.coachMetricResultsKeys.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Metric IDs</p>
                      <p className="text-sm">{result.analysis.coachMetricResultsKeys.join(', ')}</p>
                    </div>
                    {result.analysis.coachOverall !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                        <p className="text-lg font-semibold">{result.analysis.coachOverall}/5</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Raw Response</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(result.analysis.rawResponse, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
