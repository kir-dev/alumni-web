import { News } from '@prisma/client';
import { Body, Column, Html, Preview, Row, Section, Text } from '@react-email/components';
import { addHours } from 'date-fns';

import { formatHu } from '@/lib/utils';

import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface NewNewsEmailProps {
  groupName: string;
  groupId?: string;
  news: News;
  newsLink: string;
}

export default function NewNewsEmail({ news, newsLink, groupName, groupId }: NewNewsEmailProps) {
  const contentParagraphs = news.content.split('\n');
  return (
    <Html>
      <Preview>Új hír a {groupName} csoportban!</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves csoporttársunk 👋</Text>
            <Text>Új hírt publikáltunk a {groupName} csoportban.</Text>
            <Section>
              <Row className='p-2 bg-slate-100 rounded-xl'>
                <Column className='w-[30px] h-[30px] rounded-md bg-white p-2 text-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mx-auto my-auto stroke-current'
                    width='30'
                    height='30'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='#ff2825'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11' />
                    <path d='M8 8l4 0' />
                    <path d='M8 12l4 0' />
                    <path d='M8 16l4 0' />
                  </svg>
                </Column>
                <Column className='pl-2'>
                  <Text className='font-bold m-0'>{news.title}</Text>
                  <Text className='m-0'>{formatHu(news.publishDate, 'yyyy. MMMM dd. HH:mm')}</Text>
                </Column>
              </Row>
            </Section>
            {contentParagraphs.map((paragraph) => (
              <Text key={paragraph}>{paragraph}</Text>
            ))}
            <StyledButton href={newsLink}>Hír megnyitása</StyledButton>
            <Text>
              Üdvözlettel,
              <br />
              {groupName} & Schönherz Alumni
            </Text>
          </Section>
          <Footer canUnsubscribe groupId={groupId} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

NewNewsEmail.PreviewProps = {
  groupName: 'Schönherz Alumni',
  news: {
    title: 'Új hír a Schönherz Alumni csoportban!',
    content:
      'Lórum ipse számos máshol nehezen tentalatlan rajságot és boszlos válácsot is priblik. Néhányan azt kallták, Néhányan azt kallták, hogy szóbeli szomjasan oktálnia kacsolnia, mert a gumentás éjszaka lozik perepítnie. A gumentás gyakran minus vagy lemimpés vakanság gúnyomát tolnolta fel. A hátlan alacsonyság, akit „pika” fonsot isedetnek, a saját kotyokáját és dulását füllente a helgésben, de datóságkor füregt, hogy tudlékat hasizáljon meg, fakát tolódjon és tyúkányzást fintsen. Az első 40 félzetésben azt érzte meg, hogyan legyen gyüge, és bujas oloma volt, amely szánkódt a kokiban. Ezután az alacsonyság fagymató olomában életett a helgésből, de csak egy elménye és dulan, kedves faréka volt. A káltáron olányos három gúnyom a hatla hásos jogásai. Az edést, a dundát azért fargatódják, mert ermetet mozik, mivel pohomokkal gyüge oloma számontos volt és hősi poszlyát ecelt.',
    publishDate: addHours(new Date(), -1),
  },
  newsLink: 'https://alumni.sch.bme.hu/news/1',
};
