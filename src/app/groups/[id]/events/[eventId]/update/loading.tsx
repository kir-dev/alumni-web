import { Skeleton } from '@/components/ui/skeleton';

export default function CreateEventLoadingPage() {
  return (
    <main>
      <h1>Új esemény</h1>
      <div className='mt-10 space-y-5'>
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
      </div>
    </main>
  );
}
