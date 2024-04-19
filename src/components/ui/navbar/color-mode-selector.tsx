import { useEffect, useState } from 'react';
import { TbMoon, TbSun } from 'react-icons/tb';

import { Button } from '@/components/ui/button';

export function ColorModeSelector() {
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
    <Button size='icon' variant='outline' className='ml-2' onClick={toggleColorMode}>
      {isDarkMode ? <TbMoon /> : <TbSun />}
    </Button>
  );
}
