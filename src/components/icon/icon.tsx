import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Icon({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-primary-500 p-1 rounded-md', className)} {...props}>
      <svg
        className='w-full h-full'
        width='800'
        height='742'
        viewBox='0 0 800 742'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M286.835 0.612305L147.771 7.11841L141.879 434.74L223.477 435.599L237.99 406.345L289.777 378.545L286.835 0.612305Z'
          fill='white'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M192.684 497.665L211.573 459.595L123.323 458.769L129.926 32.8408L127.774 32.92L86.3669 34.4525L76.972 470.413L9.12713 543.275L3.56348 690.892L181.262 690.613L192.684 497.665Z'
          fill='white'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M350.407 345.996L345.79 26.0518L307.664 26.2656L304.953 26.3646L307.953 368.787L350.407 345.996Z'
          fill='white'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M302.401 506.249L324.068 480.25L345.732 508.417L344.289 581.36L300.235 579.915L302.401 506.249ZM392.677 516.36L414.342 493.25L432.397 517.083L430.953 586.413L391.232 584.969L392.677 516.36ZM482.951 527.915L501.006 506.971L517.618 527.193L518.34 592.913L480.785 592.19L482.951 527.915ZM653.391 525.749L667.114 548.136L665.668 603.025H637.504L636.058 545.248L653.391 525.749ZM715.5 530.804L729.945 551.025L731.389 604.468L701.056 605.193L700.333 551.748L715.5 530.804ZM768.222 538.027L781.943 557.525V607.357L756.665 608.802L755.942 556.803L768.222 538.027ZM218.384 504.083L206.829 688.966L542.222 690.055L544.337 588.1L559.505 588.979V536.581L579.004 514.917L597.059 535.861L596.394 591.117L610.78 591.951L612.915 690.285L799.998 690.893L794.943 504.083L665.429 428.251L374.38 365.421L260.755 423.198L218.384 504.083Z'
          fill='white'
        />
        <path d='M800 715.471H0V741.388H800V715.471Z' fill='white' />
      </svg>
    </div>
  );
}
