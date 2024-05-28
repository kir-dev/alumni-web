import { Event } from '@prisma/client';
import { Body, Column, Html, Preview, Row, Section, Text } from '@react-email/components';
import { addHours } from 'date-fns';

import { getFormattedDateInterval } from '@/lib/utils';

import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface DeleteEventEmailProps {
  event: Event;
  groupName: string;
}

export default function DeleteEventEmail({ event, groupName }: DeleteEventEmailProps) {
  return (
    <Html>
      <Preview>Törölve: {event.name}</Preview>
      <ConfiguredTailwind>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header />
          <Section className='bg-white p-10 rounded-lg max-w-lg'>
            <Text className='font-bold'>Kedves csoporttársunk 👋</Text>
            <Text>
              Ezúton értesítünk, hogy az alábbi eseményünket töröltük. Bővebb információért keresd a csoport
              adminisztrátorokat!
            </Text>
            <Section>
              <Row className='p-2 bg-slate-100 rounded-xl'>
                <Column className='w-[30px] h-[30px] rounded-md bg-white p-2 text-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='icon icon-tabler icon-tabler-calendar-x'
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
                    <path d='M13 21h-7a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6.5' />
                    <path d='M16 3v4' />
                    <path d='M8 3v4' />
                    <path d='M4 11h16' />
                    <path d='M22 22l-5 -5' />
                    <path d='M17 22l5 -5' />
                  </svg>
                </Column>
                <Column className='pl-2'>
                  <Text className='font-bold m-0'>
                    <s>{event.name}</s>
                  </Text>
                  <Text className='m-0'>
                    <s>
                      {getFormattedDateInterval(event.startDate, event.endDate)} &bull; {event.location}
                    </s>
                  </Text>
                </Column>
              </Row>
            </Section>
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

DeleteEventEmail.PreviewProps = {
  groupName: 'Schönherz Alumni',
  event: {
    name: 'Találkozó',
    description: 'Közös találkozó a régi iskolatársakkal.',
    startDate: new Date(),
    endDate: addHours(new Date(), 1),
    location: 'BME Q épület',
  },
};
