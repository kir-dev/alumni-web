import { Text } from '@react-email/components';

interface FooterProps {
  canUnsubscribe?: boolean;
}

export function Footer({ canUnsubscribe }: FooterProps) {
  return (
    <>
      {canUnsubscribe && (
        <Text className='text-center text-slate-500 text-sm'>
          Az e-mail értesítéseket a csoport oldalán állíthatod az &quot;Értesítések&quot; menüben.
        </Text>
      )}
      <Text className='text-center text-slate-500 text-sm'>
        &copy; {new Date().getFullYear()} Schönherz Alumni, minden jog fenntartva.
      </Text>
    </>
  );
}
