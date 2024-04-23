import { Skeleton } from '@/components/ui/skeleton';

export default function MemberListLoadingPage() {
  return (
    <main className='space-y-5'>
      <Skeleton className='h-10' />
      <Skeleton className='h-52' />
    </main>
  );
}
