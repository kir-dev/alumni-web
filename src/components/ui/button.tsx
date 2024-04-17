import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TbLoader } from 'react-icons/tb';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-primary-900 dark:focus-visible:ring-primary-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-slate-50 hover:bg-primary-500/90 dark:bg-primary-300 dark:text-primary-900 dark:hover:bg-primary-300/90',
        destructive:
          'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        destructiveOutline:
          'border border-red-500 text-red-500 hover:bg-red-500/10 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10',
        success:
          'bg-green-500 text-slate-50 hover:bg-green-500/90 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/90',
        successOutline:
          'border border-green-500 text-green-500 hover:bg-green-500/10 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10',
        outline:
          'border text-primary-500 border-primary-500 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950 dark:hover:bg-primary-800 dark:hover:text-slate-50',
        secondary:
          'bg-primary-50 text-primary-500 hover:bg-primary-100 dark:bg-primary-800 dark:text-slate-50 dark:hover:bg-primary-800/80',
        ghost:
          'hover:bg-primary-100 text-primary-500 hover:text-primary-900 dark:hover:bg-primary-800 dark:hover:text-slate-50',
        link: 'text-primary-500 underline-offset-4 hover:underline dark:text-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, children, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading && <TbLoader className='animate-spin' />}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants, LoadingButton };
