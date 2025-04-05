import { Button, ButtonProps } from '@react-email/components';

import { cn } from '@/lib/utils';

export function StyledButton({ className, ...props }: ButtonProps) {
  return <Button {...props} className={cn(`bg-primary-500 rounded-md text-slate-50 px-4 py-2`, className)} />;
}
