import { TbMoodSmileDizzy } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className='mx-auto w-fit max-w-full'>
      <TbMoodSmileDizzy className='w-32 h-32 mx-auto' />
      <h1 className='mx-auto'>404 - Nem található</h1>
      <p className='mx-auto'>Olyan oldalra kerültél, ami nem létezik.</p>
    </main>
  );
}
