import Image from 'next/image';

import { cn } from '@/lib/utils';

interface GroupIconProps {
  icon: string | null;
  className?: string;
}

export function GroupIcon({ icon, className }: GroupIconProps) {
  if (!icon) {
    return null;
  }
  return (
    <Image
      src={icon}
      alt='Icon'
      width={100}
      height={100}
      className={cn('w-8 h-8 object-contain object-center inline-block mr-2', className)}
    />
  );
}
