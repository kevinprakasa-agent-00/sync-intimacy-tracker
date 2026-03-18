import { create } from 'zustand';

// Simple storage helper
const storage = {
  getItem: async (name) => {
    try {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {}
  },
};

export const useSyncStore = create((set, get) => ({
  // State
  moments: [],
  user: {
    autoLockMinutes: 2,
  },
  ui: {
    isLocked: false,
  },
  
  // Actions
  addMoment: (moment) => {
    set((state) => ({
      moments: [moment, ...state.moments],
    }));
    // Persist
    const { moments } = get();
    storage.setItem('sync-moments', moments);
  },
  
  deleteMoment: (id) => {
    set((state) => ({
      moments: state.moments.filter((m) => m.id !== id),
    }));
  },
  
  setUILocked: (locked) => {
    set((state) => ({
      ui: { ...state.ui, isLocked: locked },
    }));
  },
  
  // Getters
  getStreak: () => {
    const { moments } = get();
    if (moments.length === 0) return 0;
    
    const lastMoment = new Date(moments[0].date);
    const today = new Date();
    const diffTime = Math.abs(today - lastMoment);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  },
  
  getThisMonthCount: () => {
    const { moments } = get();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return moments.filter((m) => {
      const date = new Date(m.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  },
  
  // Load from storage on init
  loadFromStorage: async () => {
    const moments = await storage.getItem('sync-moments') || [];
    set({ moments });
  },
}));

// Auto-load on import
useSyncStore.getState().loadFromStorage();
