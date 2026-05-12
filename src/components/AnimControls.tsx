import { Play, Square, StepForward, RotateCcw, StepBack } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimControlsProps {
  step: number;
  totalSteps: number;
  playing: boolean;
  toggle: () => void;
  reset: () => void;
  onStepForward?: () => void;
  onStepBack?: () => void;
}

export function AnimControls({
  step,
  totalSteps,
  playing,
  toggle,
  reset,
  onStepForward,
  onStepBack
}: AnimControlsProps) {
  const progress = totalSteps > 1 ? step / (totalSteps - 1) : 0;

  return (
    <div className="glass-panel p-3">
      <div className="h-2 rounded bg-surface-2 overflow-hidden mb-3 border border-[var(--panel-border)]">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, var(--accent), rgba(167,139,250,.8))'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={() => toggle()}
            className="px-3 py-2 rounded-md accent-bg-teal accent-teal border accent-border-teal hover:opacity-90 transition"
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            aria-label="Step Back"
            onClick={() => { console.log('[Controls] step-back'); onStepBack && onStepBack(); }}
            className="px-3 py-2 rounded-md border hover:bg-surface-2 transition"
            title="Step Back"
          >
            <StepBack className="w-4 h-4" />
          </button>
          <button
            aria-label="Step Forward"
            onClick={() => { console.log('[Controls] step-forward'); onStepForward && onStepForward(); }}
            className="px-3 py-2 rounded-md border hover:bg-surface-2 transition"
            title="Step Forward"
          >
            <StepForward className="w-4 h-4" />
          </button>
          <button
            aria-label="Reset"
            onClick={() => reset()}
            className="px-3 py-2 rounded-md border hover:bg-surface-2 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <div className="font-mono text-xs text-txt-2">
          <span className="accent-teal font-semibold">{step + 1}</span> / {totalSteps}
        </div>
      </div>
    </div>
  );
}