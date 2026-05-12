import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  icon: ReactNode;
  accent: 'teal' | 'coral' | 'amber' | 'emerald' | 'violet';
  description?: string;
  children?: ReactNode;
}

export function PageShell({ title, icon, accent, description, children }: PageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg accent-bg-${accent} border accent-border-${accent}`}>
          {icon}
        </div>
        <h1 className={`text-2xl font-semibold tracking-tight accent-${accent}`}>{title}</h1>
      </div>
      {description && (
        <div className={`glass-panel border-l-[3px] accent-border-${accent} p-3 text-sm text-txt-2`}>
          {description}
        </div>
      )}
      {children}
    </motion.div>
  );
}