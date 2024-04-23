import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoadingPage() {
  return (
    <main className='space-y-5'>
      <h1>Profil</h1>
      <Skeleton className='h-40' />
      <Skeleton className='h-20' />
      <Skeleton className='h-20' />
      <Skeleton className='h-20' />
    </main>
  );
}
