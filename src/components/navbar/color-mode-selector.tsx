import { useEffect, useState } from 'react';
import { TbMoon, TbSun } from 'react-icons/tb';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ColorModeSelector({ size, variant, className }: Omit<ButtonProps, 'children' | 'onClick'>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDarkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDarkModePreferred);
  }, []);

  const toggleColorMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Button
      size={size ?? 'icon'}
      variant={variant ?? 'outline'}
      className={cn('ml-2', className)}
      onClick={toggleColorMode}
    >
      {isDarkMode ? <TbMoon /> : <TbSun />}
    </Button>
  );
}
