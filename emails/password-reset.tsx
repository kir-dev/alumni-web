import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export default function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Preview>Állítsd vissza a jelszavad a link segítségével!</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves {name} 👋</Text>
            <Text>Jelszó visszaállítást kezdeményeztél, amelyet az alábbi linken hajthatsz végre:</Text>
            <StyledButton href={resetLink}>Jelszó visszaállítása</StyledButton>
            <Text>Elakadás esetén bizalommal vedd fel velünk a kapcsolatot.</Text>
            <Text>
              Üdvözlettel,
              <br />
              Schönherz Alumni
            </Text>
          </Section>
          <Footer />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  name: 'Kolléga',
  resetLink: 'https://alumni-sch.vercel.app/reset-password',
};
