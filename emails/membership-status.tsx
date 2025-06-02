import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { cn } from '@/lib/utils';
import { RootGroup } from '@/types/group.types';

import { Footer } from './footer';
import { GroupDisplay } from './group-display';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface MemberStatusEmailProps {
  group: { id: string; name: string };
  status: 'Elfogadva' | 'Függőben' | 'Elutasítva' | 'Szülő csoportra vár';
  rootGroup?: RootGroup;
}

export default function MembershipStatusEmail({ group, status, rootGroup }: MemberStatusEmailProps) {
  return (
    <Html>
      <Preview>{group.name} csoporttagságod státusza megváltozott</Preview>
      <ConfiguredTailwind rootGroup={rootGroup}>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header rootGroup={rootGroup} />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves kolléga 👋</Text>
            <Text>A(z) {group.name} csoporttagságod státusza megváltozott:</Text>
            <StatusBadge status={status} />
            <Text>
              Üdvözlettel,
              <br />
              {rootGroup?.name || 'Schönherz Alumni'}
            </Text>
            <GroupDisplay group={group} />
          </Section>
          <Footer rootGroup={rootGroup} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Section
      className={cn('px-4 py-2 rounded-full w-fit bg-slate-500', {
        'bg-green-500': status === 'Elfogadva',
        'bg-yellow-500': status === 'Függőben',
        'bg-red-500': status === 'Elutasítva',
      })}
    >
      <Text className='text-white m-0'>{status}</Text>
    </Section>
  );
}

MembershipStatusEmail.PreviewProps = {
  group: {
    name: 'Schönherz Alumni',
    id: '1',
  },
  status: 'Elutasítva',
} satisfies MemberStatusEmailProps;
