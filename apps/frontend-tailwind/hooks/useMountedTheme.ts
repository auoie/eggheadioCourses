import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useMountedTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  // useEffect only runs on the client, so now we can safely show the UI
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return { theme: undefined, setTheme, resolvedTheme: undefined };
  }
  return { theme, setTheme, resolvedTheme };
};
