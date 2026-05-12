import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface StoreState {
  theme: Theme;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useStore = create<StoreState>()((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(next);
      console.log('[Theme] ->', next);
      return { theme: next };
    }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));