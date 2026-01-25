import { Badge } from '@/components/ui/badge';
import { BehavioralCue } from '@/lib/observable-cues';
import { Clock, AlertCircle, TrendingDown, Shield, Eye, HelpCircle, Zap, Volume2, UserX } from 'lucide-react';

interface CueBadgeProps {
  cue: BehavioralCue;
}

const CUE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'time-pressure': Clock,
  'low-engagement': TrendingDown,
  'frustration': AlertCircle,
  'defensive': Shield,
  'distracted': Eye,
  'hesitant': HelpCircle,
  'uncomfortable': HelpCircle,
  'impatient': Zap,
  'disinterested': Volume2,
  'withdrawn': UserX,
};

const CUE_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

export function CueBadge({ cue }: CueBadgeProps) {
  const Icon = CUE_ICONS[cue.id] || AlertCircle;
  const colorClass = CUE_COLORS[cue.severity];

  return (
    <Badge
      variant="outline"
      className={`${colorClass} flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium`}
      title={cue.description}
    >
      <Icon className="h-3.5 w-3.5" />
      {cue.label}
    </Badge>
  );
}

interface CueBadgeGroupProps {
  cues: BehavioralCue[];
}

export function CueBadgeGroup({ cues }: CueBadgeGroupProps) {
  if (cues.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {cues.map((cue) => (
        <CueBadge key={cue.id} cue={cue} />
      ))}
    </div>
  );
}
