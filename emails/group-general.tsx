import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface GroupGeneralEmailProps {
  content: string;
  groupId?: string;
}

export default function GroupGeneralEmail({ content, groupId }: GroupGeneralEmailProps) {
  const contentParagraphs = content.split('\n');
  return (
    <Html>
      <Preview>{contentParagraphs[0]}</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            {contentParagraphs.map((paragraph, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Text key={index}>{paragraph}</Text>
            ))}
          </Section>
          <Footer canUnsubscribe groupId={groupId} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

GroupGeneralEmail.PreviewProps = {
  content: 'Ez egy példa e-mail tartalomra.\n\nMásodik bekezdés.',
};
