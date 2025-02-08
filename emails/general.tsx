import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface GeneralEmailProps {
  content: string;
}

export default function GeneralEmail({ content }: GeneralEmailProps) {
  const contentParagraphs = content.split('\n');
  return (
    <Html>
      <Preview>{contentParagraphs[0]}</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves kolléga 👋</Text>
            {contentParagraphs.map((paragraph, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Text key={index}>{paragraph}</Text>
            ))}
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

GeneralEmail.PreviewProps = {
  content: 'Ez egy példa e-mail tartalomra.\n\nMásodik bekezdés.',
};
