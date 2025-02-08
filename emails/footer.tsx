import { Link, Text } from '@react-email/components';

import { SITE_URL } from '@/config/environment.config';

interface FooterProps {
  canUnsubscribe?: boolean;
  groupId?: string;
}

export function Footer({ canUnsubscribe, groupId }: FooterProps) {
  return (
    <>
      {canUnsubscribe && (
        <Text className='text-center text-slate-500 text-sm'>
          Regisztrált felhasználóként az e-mail értesítéseket a csoport oldalán állíthatod az &quot;Értesítések&quot;
          menüben.
          {groupId && (
            <>
              <br />
              Amennyiben még nem regisztráltál, úgy a{' '}
              <Link href={`${SITE_URL}/groups/${groupId}/unsubscribe`}>leiratkozás oldalon</Link> iratkozhatsz le.
            </>
          )}
        </Text>
      )}
      <Text className='text-center text-slate-500 text-sm'>
        &copy; {new Date().getFullYear()} Schönherz Alumni, minden jog fenntartva.
      </Text>
    </>
  );
}
