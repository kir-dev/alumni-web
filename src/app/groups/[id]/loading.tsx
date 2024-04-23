import { Skeleton } from '@/components/ui/skeleton';

export default function GroupDetailsLoadingPage() {
  return (
    <main className='space-y-5'>
      <Skeleton className='h-52' />
      <Skeleton className='h-20' />
      <Skeleton className='h-20' />
    </main>
  );
}
