import { TbShieldX } from 'react-icons/tb';

export default function Forbidden() {
  return (
    <main className='w-fit max-w-full text-center'>
      <TbShieldX className='w-32 h-32 mx-auto' />
      <h1 className='mx-auto'>Nincs jogosultságod</h1>
      <p className='mx-auto'>Ehhez az oldalhoz nincs jogosultságod.</p>
    </main>
  );
}
