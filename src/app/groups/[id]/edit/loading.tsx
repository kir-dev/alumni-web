import { Skeleton } from '@/components/ui/skeleton';

export default function EditGroupLoadingPage() {
  return (
    <main className='space-y-5'>
      <Skeleton className='h-10' />
      <Skeleton className='h-10' />
      <Skeleton className='h-10' />
      <Skeleton className='h-10' />
    </main>
  );
}
