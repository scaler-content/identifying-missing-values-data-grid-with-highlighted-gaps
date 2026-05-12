import { Menu, Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useStore();
  const isDark = theme === 'dark';

  return (
    <aside className={`glass-panel m-4 h-[calc(100dvh-2rem)] transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-56' : 'w-14'} relative z-10`}>
      <div className="flex items-center justify-between px-3 pt-3">
        <button
          aria-label="Toggle Sidebar"
          onClick={() => { console.log('[UI] toggle sidebar'); toggleSidebar(); }}
          className="p-2 rounded-md hover:bg-surface-2/60 transition"
          title="Collapse"
        >
          <Menu className="w-5 h-5 text-txt-2" />
        </button>
        {sidebarOpen && (
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-semibold tracking-wide text-txt-2"
          >
            Data Quality Lab
          </motion.h1>
        )}
        <div className="w-5" />
      </div>

      <div className="px-3 mt-4">
        {sidebarOpen && (
          <div className="text-xs text-txt-3">
            Identifying Missing Values
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-0 right-0 px-3">
        <button
          aria-label="Toggle Theme"
          onClick={() => toggleTheme()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-[var(--panel-border)] hover:bg-surface-2/60 transition"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {sidebarOpen && <span className="text-xs">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  );
}