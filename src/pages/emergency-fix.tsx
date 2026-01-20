import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function EmergencyFix() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const applyFix = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/emergency-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to apply fix');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🚨 Emergency Fix for ReflectivAI</CardTitle>
          <CardDescription>
            This will push the Knowledge Base fix to your GitHub repository
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Repository:</strong> ReflectivEI/dev_projects_full-build2
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>File:</strong> client/src/pages/knowledge.tsx
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Fix:</strong> Handle both JSON and plain text Worker responses
            </p>
          </div>

          <Button
            onClick={applyFix}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Fix...
              </>
            ) : (
              '🚀 Apply Fix Now'
            )}
          </Button>

          {result && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="space-y-2">
                <p className="font-semibold text-green-800">✅ Fix Applied Successfully!</p>
                <p className="text-sm text-green-700">
                  <strong>Commit:</strong>{' '}
                  <a
                    href={result.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on GitHub
                  </a>
                </p>
                <p className="text-sm text-green-700">
                  <strong>New SHA:</strong> {result.newSha}
                </p>
                <div className="mt-4 p-3 bg-white rounded border border-green-200">
                  <p className="font-semibold text-sm mb-2">🎯 Next Steps:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Wait 2-3 minutes for Cloudflare Pages deployment</li>
                    <li>Go to: https://reflectivai-app-prod.pages.dev/knowledge</li>
                    <li>Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)</li>
                    <li>Test the Knowledge Base feature</li>
                    <li>✅ Your presentation is saved!</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <p className="font-semibold">❌ Error</p>
                <p className="text-sm mt-1">{error}</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
