import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <main>
      <Skeleton className='h-10 w-1/2' />
      <Skeleton className='h-20 mt-5' />
      <Skeleton className='h-20 mt-2' />
      <Skeleton className='h-20 mt-2' />
    </main>
  );
}
