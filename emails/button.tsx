import { Button, ButtonProps } from '@react-email/components';

export function StyledButton({ className, ...props }: ButtonProps) {
  return <Button {...props} className={`bg-primary-500 rounded-md text-slate-50 px-4 py-2 p-2 ${className}`} />;
}
