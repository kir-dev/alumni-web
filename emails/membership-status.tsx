import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { cn } from '@/lib/utils';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface MemberStatusEmailProps {
  groupName: string;
  status: 'Elfogadva' | 'Függőben' | 'Elutasítva' | 'Szülő csoportra vár';
}

export default function MembershipStatusEmail({ groupName, status }: MemberStatusEmailProps) {
  return (
    <Html>
      <Preview>{groupName} csoporttagságod státusza megváltozott</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves kolléga 👋</Text>
            <Text>A(z) {groupName} csoporttagságod státusza megváltozott:</Text>
            <StatusBadge status={status} />
            <Text>
              Üdvözlettel,
              <br />
              {groupName} & Schönherz Alumni
            </Text>
          </Section>
          <Footer />
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
  groupName: 'Csoportnév',
  status: 'Elutasítva',
} satisfies MemberStatusEmailProps;
