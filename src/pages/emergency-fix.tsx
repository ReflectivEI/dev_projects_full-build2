import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function EmergencyFix() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runFix = async () => {
    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/emergency-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setResult(data);
      } else {
        setStatus('error');
        setError(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to run fix');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">🚨 Emergency Fix</CardTitle>
            <CardDescription>
              Fix metric card dialog crash in ReflectivAI production site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">What this does:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Fetches client/src/pages/ei-metrics.tsx from GitHub</li>
                <li>Adds required DialogHeader wrapper for accessibility</li>
                <li>Changes visible DialogTitle to h2 element</li>
                <li>Pushes fix to main branch</li>
                <li>Triggers Cloudflare Pages auto-deployment</li>
              </ul>
            </div>

            <Button 
              onClick={runFix} 
              disabled={status === 'loading'}
              size="lg"
              className="w-full"
            >
              {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {status === 'loading' ? 'Pushing Fix to GitHub...' : '🚀 RUN FIX NOW'}
            </Button>

            {status === 'success' && result && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="space-y-3">
                  <div className="font-semibold text-green-900 dark:text-green-100">
                    ✅ Fix Pushed Successfully!
                  </div>
                  
                  {result.alreadyFixed ? (
                    <div className="text-sm space-y-2">
                      <p className="text-yellow-800 dark:text-yellow-200">
                        ⚠️ The fix was already applied previously.
                      </p>
                      <p className="text-muted-foreground">
                        If the crash persists, check the browser console for the actual error.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm space-y-2">
                      <p><strong>Commit:</strong> <a href={result.commitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.commitUrl}</a></p>
                      <p><strong>New SHA:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{result.sha}</code></p>
                      
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          🎯 {result.deploymentInfo.message}
                        </p>
                        <div className="space-y-1 text-xs">
                          <p>
                            <strong>Monitor:</strong>{' '}
                            <a href={result.deploymentInfo.monitorUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              GitHub Actions
                            </a>
                          </p>
                          <p>
                            <strong>Production:</strong>{' '}
                            <a href={result.deploymentInfo.productionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {result.deploymentInfo.productionUrl}
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <p className="font-semibold mb-2">After deployment completes:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to production site</li>
                          <li>Hard refresh: <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+R</kbd> (Windows) or <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Cmd+Shift+R</kbd> (Mac)</li>
                          <li>Navigate to Behavioral Metrics page</li>
                          <li>Click on any metric card</li>
                          <li>✅ It will open without crashing!</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && error && (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertDescription>
                  <div className="font-semibold mb-2">❌ Error</div>
                  <pre className="text-xs bg-red-50 dark:bg-red-950 p-2 rounded overflow-auto">
                    {error}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p><strong>Repository:</strong> ReflectivEI/dev_projects_full-build2</p>
            <p><strong>Branch:</strong> main</p>
            <p><strong>File:</strong> client/src/pages/ei-metrics.tsx</p>
            <p><strong>Issue:</strong> DialogTitle must be wrapped in DialogHeader for accessibility</p>
            <p><strong>Fix:</strong> Add hidden DialogHeader with sr-only class + change visible title to h2</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
