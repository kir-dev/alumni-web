import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { RootGroup } from '@/types/group.types';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
  rootGroup?: RootGroup;
}

export default function PasswordResetEmail({ name, resetLink, rootGroup }: PasswordResetEmailProps) {
  return (
    <Html>
      <Preview>Állítsd vissza a jelszavad a link segítségével!</Preview>
      <ConfiguredTailwind rootGroup={rootGroup}>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header rootGroup={rootGroup} />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves {name} 👋</Text>
            <Text>Jelszó visszaállítást kezdeményeztél, amelyet az alábbi linken hajthatsz végre:</Text>
            <StyledButton href={resetLink}>Jelszó visszaállítása</StyledButton>
            <Text>Elakadás esetén bizalommal vedd fel velünk a kapcsolatot.</Text>
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

PasswordResetEmail.PreviewProps = {
  name: 'Kolléga',
  resetLink: 'https://alumni-sch.vercel.app/reset-password',
};
