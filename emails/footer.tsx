import { Link, Text } from '@react-email/components';

import { SITE_URL } from '@/config/environment.config';
import { RootGroup } from '@/types/group.types';

interface FooterProps {
  canUnsubscribe?: boolean;
  groupId?: string;
  rootGroup?: RootGroup;
}

export function Footer({ canUnsubscribe, groupId, rootGroup }: FooterProps) {
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
        &copy; {new Date().getFullYear()} {rootGroup?.name || 'Schönherz & VIK Alumni'}, minden jog fenntartva.
      </Text>
    </>
  );
}
