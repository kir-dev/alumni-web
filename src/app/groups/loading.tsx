import { Skeleton } from '@/components/ui/skeleton';

export default function GroupListLoadingPage() {
  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1>Fő csoportok</h1>
      </div>
      <div className='mt-10 space-y-2'>
        <Skeleton className='h-20' />
        <Skeleton className='h-20' />
      </div>
    </main>
  );
}
