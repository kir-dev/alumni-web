import { Skeleton } from '@/components/ui/skeleton';

export default function CreateGroupLoadingPage() {
  return (
    <main>
      <h1>Új csoport</h1>
      <div className='mt-10 space-y-5'>
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
      </div>
    </main>
  );
}
