import { useEffect, useRef, useState } from 'react';

interface UseAnimationOptions {
  totalSteps: number;
  baseMs?: number;
}

interface UseAnimationReturn {
  step: number;
  playing: boolean;
  progress: number;
  totalSteps: number;
  toggle: () => void;
  reset: () => void;
  setStep: (n: number) => void;
}

export function useAnimation(
  { totalSteps, baseMs = 800 }: UseAnimationOptions
): UseAnimationReturn {
  const [step, setStepState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setStepState(0); setPlaying(false); }, [totalSteps]);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setStepState(s => {
        if (s >= totalSteps - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, baseMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, totalSteps, baseMs]);

  useEffect(() => {
    console.log('[Anim] step', step + 1, '/', totalSteps);
  }, [step, totalSteps]);

  const toggle = () => setPlaying(p => {
    const next = !p;
    console.log(next ? '[Controls] play' : '[Controls] pause');
    return next;
  });
  const reset  = () => { console.log('[Controls] reset'); setPlaying(false); setStepState(0); };
  const setStep = (n: number) =>
    setStepState(Math.max(0, Math.min(totalSteps - 1, n)));

  const progress = totalSteps > 1 ? step / (totalSteps - 1) : 0;
  return { step, playing, progress, totalSteps, toggle, reset, setStep };
}