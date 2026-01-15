import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  X,
  BookOpen,
  Lightbulb,
  Eye,
  MessageCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type SignalType = "verbal" | "conversational" | "engagement" | "contextual";

export interface SignalItem {
  id: string;
  type: SignalType;
  signal: string;
  interpretation: string;
  evidence?: string;
  suggestedOptions?: string[];
}

interface SignalDetailCardProps {
  signal: SignalItem;
}

const typeConfig: Record<SignalType, { label: string; icon: any; color: string }> = {
  verbal: { label: "Verbal", icon: MessageCircle, color: "text-blue-500" },
  conversational: { label: "Conversational", icon: MessageCircle, color: "text-purple-500" },
  engagement: { label: "Engagement", icon: Eye, color: "text-amber-500" },
  contextual: { label: "Contextual", icon: Clock, color: "text-green-500" }
};

export function SignalDetailCard({ signal }: SignalDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cfg = typeConfig[signal.type];
  const Icon = cfg.icon;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer rounded-lg border p-3 hover:bg-muted/40"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-start gap-2">
          <Icon className={`h-4 w-4 mt-0.5 ${cfg.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs py-0">
                {cfg.label}
              </Badge>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{signal.signal}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {signal.interpretation}
            </p>
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${cfg.color}`} />
              {cfg.label} Signal
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-semibold mb-1">Observed Behavior</h4>
                <p className="text-sm">{signal.signal}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Interpretation (Hypothesis)</h4>
                <p className="text-sm text-muted-foreground">
                  {signal.interpretation}
                </p>
              </div>

              {signal.evidence && (
                <div className="rounded-md border-l-4 border-primary bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                    <AlertCircle className="h-4 w-4" />
                    Evidence
                  </div>
                  <p className="text-sm italic text-foreground/80">
                    “{signal.evidence}”
                  </p>
                </div>
              )}

              {signal.suggestedOptions && signal.suggestedOptions.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-cyan-600" />
                    <h4 className="text-sm font-semibold">Options to Consider</h4>
                  </div>
                  <ul className="space-y-2">
                    {signal.suggestedOptions.map((opt, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-dashed p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  Observable signals only. No inference of emotion, intent, or performance.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setIsOpen(false)}>Got it</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
