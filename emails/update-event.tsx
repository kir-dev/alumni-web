import { Event } from '@prisma/client';
import { Body, Html, Preview, Row, Section, Text } from '@react-email/components';
import { addHours } from 'date-fns';

import { formatHu } from '@/lib/utils';
import { Difference } from '@/types/event.types';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface UpdateEventEmailProps {
  eventName: string;
  difference: Difference<Event>;
}

export default function UpdateEventEmail({ eventName, difference }: UpdateEventEmailProps) {
  return (
    <Html>
      <Preview>A(z) {eventName} eseményt frissítették.</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-lg'>
            <Text className='font-bold'>Kedves csoporttársunk, %recipient.id% 👋</Text>
            <Text>A(z) {eventName} eseményünket frissítettük.</Text>
            <Section>
              {difference.startDate && (
                <Row>
                  <Text className='font-bold m-0'>Rendezvény kezdete</Text>
                  <Text className='m-0'>
                    <s>{formatHu(difference.startDate.before, 'MMM dd. HH:mm')}</s> &rarr;{' '}
                    {formatHu(difference.startDate.after, 'MMM dd. HH:mm')}
                  </Text>
                </Row>
              )}
              {difference.endDate && (
                <Row>
                  <Text className='font-bold m-0'>Rendezvény vége</Text>
                  <Text className='m-0'>
                    <s>{formatHu(difference.endDate.before, 'MMM dd. HH:mm')}</s> &rarr;{' '}
                    {formatHu(difference.endDate.after, 'MMM dd. HH:mm')}
                  </Text>
                </Row>
              )}
              {difference.location && (
                <Row>
                  <Text className='font-bold m-0'>Helyszín</Text>
                  <Text className='m-0'>
                    <s>{difference.location.before}</s> &rarr; {difference.location.after}
                  </Text>
                </Row>
              )}
            </Section>
            <Text>
              Üdvözlettel,
              <br />a szervezők
            </Text>
          </Section>
          <Footer />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

UpdateEventEmail.PreviewProps = {
  eventName: 'Kedvenc esemény',
  difference: {
    startDate: {
      before: addHours(new Date(), 1),
      after: addHours(new Date(), 2),
    },
    endDate: {
      before: addHours(new Date(), 3),
      after: addHours(new Date(), 4),
    },
    location: {
      before: 'BME',
      after: 'Széchenyi István Egyetem',
    },
  },
};
