import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterLoadingPage() {
  return (
    <main>
      <h1>Regisztráció</h1>
      <div className='mt-10 space-y-5'>
        {Array.from({ length: 6 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton className='h-10' key={index} />
        ))}
      </div>
    </main>
  );
}
