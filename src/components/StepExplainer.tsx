import { ArrowRight } from 'lucide-react';

export function StepExplainer({ text, accent }: { text: string; accent: 'teal' | 'coral' | 'amber' | 'emerald' | 'violet' }) {
  return (
    <div className={`glass-panel border-l-[3px] p-3 flex items-start gap-2 accent-border-${accent}`}>
      <ArrowRight className={`w-4 h-4 mt-[2px] accent-${accent}`} />
      <p className="text-sm text-txt-2">{text}</p>
    </div>
  );
}