import { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  accent?: 'teal' | 'coral' | 'amber' | 'emerald' | 'violet';
  children: ReactNode;
  className?: string;
}

export function Panel({ title, accent, children, className }: PanelProps) {
  return (
    <div className={`glass-panel p-4 lg:p-5 ${className ?? ''}`}>
      {title && (
        <div className="mb-3 uppercase font-mono text-[10px] tracking-wider text-txt-3">
          <span className={accent ? `accent-${accent}` : ''}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}