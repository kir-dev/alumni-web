import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { RootGroup } from '@/types/group.types';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface WelcomeProps {
  name: string;
  verificationLink: string;
  rootGroup?: RootGroup;
}

export default function Welcome({ name, verificationLink, rootGroup }: WelcomeProps) {
  return (
    <Html>
      <Preview>Kérünk erősítsd meg az e-mail címed!</Preview>
      <ConfiguredTailwind rootGroup={rootGroup}>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header rootGroup={rootGroup} />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Üdvözlünk az Alumni Weben, {name} 👋</Text>
            <Text>Köszönjük, hogy regisztráltál!</Text>
            <Text>Kérjük erősítsd meg a regisztrációdat a következő linkre kattintva:</Text>
            <StyledButton href={verificationLink}>E-mail cím megerősítése</StyledButton>
            <Text>Ha bármilyen kérdésed van, ne habozz felvenni velünk a kapcsolatot.</Text>
            <Text>
              Üdvözlettel,
              <br />
              {rootGroup?.name || 'Schönherz Alumni'}
            </Text>
          </Section>
          <Footer rootGroup={rootGroup} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

Welcome.PreviewProps = {
  name: 'Kolléga',
  verificationLink: 'https://alumni-sch.vercel.app/api/verify/verificationToken.token',
  group: {
    name: 'Schönherz Alumni',
    icon: 'https://alumni-sch.vercel.app/api/icon/schonherz',
    color: 'bme',
  },
};
