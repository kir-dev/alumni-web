import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

interface ImageRendererProps extends Partial<Omit<ImageProps, 'src'>> {
  content: string;
}

export function ImageRenderer({ content, className, width, height, alt, ...props }: ImageRendererProps) {
  return (
    <Image
      className={cn('rounded-lg w-full h-auto max-h-80 object-cover', className)}
      width={width ?? 500}
      height={height ?? 500}
      src={content}
      alt={alt ?? 'Kép'}
      {...props}
    />
  );
}
