import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { RootGroup } from '@/types/group.types';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface EmailVerificationProps {
  name: string;
  verificationLink: string;
  rootGroup?: RootGroup;
}

export default function EmailVerification({ name, verificationLink, rootGroup }: EmailVerificationProps) {
  return (
    <Html>
      <Preview>Kérünk erősítsd meg az e-mail címed!</Preview>
      <ConfiguredTailwind rootGroup={rootGroup}>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header rootGroup={rootGroup} />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves {name} 👋</Text>
            <Text>Az e-mail címed megerősítését a következő linkre kattintva teheted meg:</Text>
            <StyledButton href={verificationLink}>E-mail cím megerősítése</StyledButton>
            <Text>Elakadás esetén ne habozz felvenni velünk a kapcsolatot.</Text>
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

EmailVerification.PreviewProps = {
  name: 'Kolléga',
  verificationLink: 'https://alumni-sch.vercel.app/api/verify/verificationToken.token',
};
