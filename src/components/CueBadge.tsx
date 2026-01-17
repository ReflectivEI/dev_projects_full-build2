/**
 * CueBadge Component
 * 
 * Visual indicator for observable communication cues in roleplay messages.
 * Read-only display component with no scoring or persistence logic.
 */

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MessageSquare, 
  Heart, 
  Target, 
  Shield, 
  Ear, 
  HelpCircle, 
  Users, 
  BarChart3, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import type { ObservableCue, CueType } from "@/lib/observable-cues";
import { getCueColorClass } from "@/lib/observable-cues";
import { cn } from "@/lib/utils";

interface CueBadgeProps {
  cue: ObservableCue;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const cueIcons: Record<CueType, React.ComponentType<{ className?: string }>> = {
  'question': MessageSquare,
  'empathy': Heart,
  'value-statement': Target,
  'objection-handling': Shield,
  'active-listening': Ear,
  'clarification': HelpCircle,
  'rapport-building': Users,
  'data-reference': BarChart3,
  'benefit-focus': Sparkles,
  'open-ended': CheckCircle2,
};

const cueDescriptions: Record<CueType, string> = {
  'question': 'Asking questions to gather information and engage the customer',
  'empathy': 'Demonstrating understanding and emotional awareness',
  'value-statement': 'Articulating clear value propositions',
  'objection-handling': 'Addressing concerns and overcoming objections',
  'active-listening': 'Reflecting back what the customer has shared',
  'clarification': 'Seeking to understand more deeply',
  'rapport-building': 'Building trust and connection',
  'data-reference': 'Supporting statements with evidence and data',
  'benefit-focus': 'Emphasizing outcomes and benefits',
  'open-ended': 'Using open-ended questions to encourage dialogue',
};

export function CueBadge({ cue, size = 'sm', showIcon = true }: CueBadgeProps) {
  const Icon = cueIcons[cue.type];
  const colorClass = getCueColorClass(cue.variant);
  const description = cueDescriptions[cue.type];
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1 cursor-help transition-all hover:scale-105",
              colorClass,
              size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
            )}
          >
            {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
            <span>{cue.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium mb-1">{cue.label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Confidence: <span className="capitalize">{cue.confidence}</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface CueBadgeGroupProps {
  cues: ObservableCue[];
  maxVisible?: number;
  size?: 'sm' | 'md';
}

export function CueBadgeGroup({ cues, maxVisible = 3, size = 'sm' }: CueBadgeGroupProps) {
  if (cues.length === 0) return null;
  
  const visibleCues = cues.slice(0, maxVisible);
  const remainingCount = cues.length - maxVisible;
  
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {visibleCues.map((cue, index) => (
        <CueBadge key={`${cue.type}-${index}`} cue={cue} size={size} />
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className={cn(
            "text-muted-foreground bg-muted/50",
            size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
          )}
        >
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}
