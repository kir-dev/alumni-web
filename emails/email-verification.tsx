import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface EmailVerificationProps {
  name: string;
  verificationLink: string;
}

export default function EmailVerification({ name, verificationLink }: EmailVerificationProps) {
  return (
    <Html>
      <Preview>Kérünk erősítsd meg az e-mail címed!</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves {name} 👋</Text>
            <Text>Az e-mail címed megerősítését a következő linkre kattintva teheted meg:</Text>
            <StyledButton href={verificationLink}>E-mail cím megerősítése</StyledButton>
            <Text>Elakadás esetén ne habozz felvenni velünk a kapcsolatot.</Text>
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

EmailVerification.PreviewProps = {
  name: 'Kolléga',
  verificationLink: 'https://alumni-sch.vercel.app/api/verify/verificationToken.token',
};
