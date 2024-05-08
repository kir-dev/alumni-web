import { Text } from '@react-email/components';

export function Footer() {
  return (
    <Text className='text-center text-slate-500 text-sm'>
      &copy; {new Date().getFullYear()} Schönherz Alumni, minden jog fenntartva.
    </Text>
  );
}
