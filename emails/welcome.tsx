import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface WelcomeProps {
  name: string;
  verificationLink: string;
}

export default function Welcome({ name, verificationLink }: WelcomeProps) {
  return (
    <Html>
      <Preview>Kérünk erősítsd meg az e-mail címed!</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-lg'>
            <Text className='font-bold'>Üdvözlünk az Alumni Weben, {name} 👋</Text>
            <Text>Köszönjük, hogy regisztráltál!</Text>
            <Text>Kérjük erősítsd meg a regisztrációdat a következő linkre kattintva:</Text>
            <StyledButton href={verificationLink}>E-mail cím megerősítése</StyledButton>
            <Text>Ha bármilyen kérdésed van, ne habozz felvenni velünk a kapcsolatot.</Text>
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

Welcome.PreviewProps = {
  name: 'Kolléga',
  verificationLink: 'https://alumni-sch.vercel.app/api/verify/verificationToken.token',
};
