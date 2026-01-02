import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Sparkles } from "lucide-react";

interface ApiStatus {
  ok?: boolean;
  status?: string;
  worker?: string;
  aiConfigured?: boolean;
  openaiConfigured?: boolean;
  message: string;
}

export function ApiStatusBanner() {
  const { data: status } = useQuery<ApiStatus>({
    queryKey: ["/api/health"],
    refetchOnWindowFocus: false,
    staleTime: 0, // Force fresh fetch every time
    cacheTime: 0, // Don't cache the result
  });
  
  console.log('🟢 [ApiStatusBanner] Query result:', status);

  // Check both field names for backward compatibility
  const isConfigured = status?.openaiConfigured || status?.aiConfigured;
  
  if (!status || isConfigured) {
    return null;
  }

  return (
    <div className="bg-muted border-b px-4 py-2">
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-chart-2" />
        <span className="text-muted-foreground">
          <span className="font-medium">Demo Mode:</span> AI features are showing sample responses. 
          Add your OpenAI API key for full AI-powered coaching.
        </span>
      </div>
    </div>
  );
}

export function ApiStatusBadge() {
  const { data: status } = useQuery<ApiStatus>({
    queryKey: ["/api/health"],
    refetchOnWindowFocus: false,
    staleTime: 0, // Force fresh fetch every time
    cacheTime: 0, // Don't cache the result
  });
  
  console.log('🟢 [ApiStatusBadge] Query result:', status);

  if (!status) {
    return null;
  }

  return (
    <Badge 
      variant={(status.openaiConfigured || status.aiConfigured) ? "default" : "secondary"}
      className="gap-1"
    >
      {(status.openaiConfigured || status.aiConfigured) ? (
        <>
          <Sparkles className="h-3 w-3" />
          AI Enabled
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          Demo Mode
        </>
      )}
    </Badge>
  );
}
