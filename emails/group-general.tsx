import { Body, Html, Preview, Section, Text } from '@react-email/components';

import { Footer } from './footer';
import { GroupDisplay } from './group-display';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface GroupGeneralEmailProps {
  content: string;
  group: { id: string; name: string };
}

export default function GroupGeneralEmail({ content, group }: GroupGeneralEmailProps) {
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
            <GroupDisplay group={group} />
          </Section>
          <Footer canUnsubscribe groupId={group.id} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

GroupGeneralEmail.PreviewProps = {
  group: {
    name: 'Schönherz Alumni',
    id: '1',
  },
  content: 'Ez egy példa e-mail tartalomra.\n\nMásodik bekezdés.',
};
