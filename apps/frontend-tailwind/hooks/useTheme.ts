import { useEffect, useRef } from 'react';
import create from 'zustand';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
export const colorModes = ['system', 'light', 'dark'] as const;
export type ColorMode = typeof colorModes[number];
interface SettingState {
  setting: ColorMode | null;
  setSetting: (setting: ColorMode) => void;
}
const useSetting = create<SettingState>((set) => ({
  setting: null,
  setSetting: (setting) => set({ setting }),
}));
const update = () => {
  document.documentElement.classList.add('changing-theme');
  if (
    localStorage['theme'] === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  window.setTimeout(() => {
    document.documentElement.classList.remove('changing-theme');
  });
};
export const useTheme = () => {
  const { setSetting, setting } = useSetting();
  const initial = useRef(true);
  useIsomorphicLayoutEffect(() => {
    const theme = localStorage['theme'] as unknown;
    if (theme === 'light' || theme === 'dark') {
      setSetting(theme);
    } else {
      setSetting('system');
    }
  }, [setSetting]);
  useIsomorphicLayoutEffect(() => {
    if (setting === 'system') {
      localStorage.removeItem('theme');
    } else if (setting === 'light' || setting === 'dark') {
      localStorage['theme'] = setting;
    }
    if (initial.current) {
      initial.current = false;
    } else {
      update();
    }
  }, [setting]);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', update);
    const onStorage = () => {
      update();
      const theme = localStorage['theme'] as unknown;
      if (theme === 'light' || theme === 'dark') {
        setSetting(theme);
      } else {
        setSetting('system');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      mediaQuery.removeEventListener('change', update);
      window.removeEventListener('storage', onStorage);
    };
  }, [setSetting]);
  return [setting, setSetting] as const;
};
