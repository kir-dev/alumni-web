import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface GroupGeneralEmailProps {
  content: string;
  groupName: string;
}

export default function GroupGeneralEmail({ content, groupName }: GroupGeneralEmailProps) {
  const contentParagraphs = content.split('\n');
  return (
    <Html>
      <Preview>{contentParagraphs[0]}</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-lg'>
            <Text className='font-bold'>Kedves csoporttársunk 👋</Text>
            {contentParagraphs.map((paragraph, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Text key={index}>{paragraph}</Text>
            ))}
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

GroupGeneralEmail.PreviewProps = {
  content: 'Ez egy példa e-mail tartalomra.\n\nMásodik bekezdés.',
  groupName: 'Csoportnév',
};
