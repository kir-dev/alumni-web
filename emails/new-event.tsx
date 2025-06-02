import { Event } from '@prisma/client';
import { Body, Column, Html, Preview, Row, Section, Text } from '@react-email/components';
import { addHours } from 'date-fns';

import { getFormattedDateInterval } from '@/lib/utils';
import { RootGroup } from '@/types/group.types';

import { StyledButton } from './button';
import { Footer } from './footer';
import { GroupDisplay } from './group-display';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface NewEventEmailProps {
  group: { id: string; name: string };
  event: Event;
  eventLink: string;
  rootGroup?: RootGroup;
}

export default function NewEventEmail({ eventLink, event, group, rootGroup }: NewEventEmailProps) {
  return (
    <Html>
      <Preview>Új esemény a {group.name} csoportban!</Preview>
      <ConfiguredTailwind rootGroup={rootGroup}>
        <Body className='font-sans bg-slate-100 text-slate-700 p-2'>
          <Header rootGroup={rootGroup} />
          <Section className='bg-white p-10 rounded-lg max-w-2xl'>
            <Text className='font-bold'>Kedves csoporttársunk 👋</Text>
            <Text>Szeretettel meghívunk legújabb eseményünkre!</Text>
            <Section>
              <Row className='p-2 bg-slate-100 rounded-xl'>
                <Column className='w-[30px] h-[30px] rounded-md bg-white p-2 text-center'>
                  <svg
                    className='mx-auto my-auto stroke-current'
                    xmlns='http://www.w3.org/2000/svg'
                    width='30'
                    height='30'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' />
                    <path d='M16 3l0 4' />
                    <path d='M8 3l0 4' />
                    <path d='M4 11l16 0' />
                    <path d='M8 15h2v2h-2z' />
                  </svg>
                </Column>
                <Column className='pl-2'>
                  <Text className='font-bold m-0'>{event.name}</Text>
                  <Text className='m-0'>
                    {getFormattedDateInterval(event.startDate, event.endDate)} &bull; {event.location}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Text>{event.description}</Text>
            <StyledButton href={eventLink}>Esemény megtekintése</StyledButton>
            <Text>
              Üdvözlettel,
              <br />
              {rootGroup?.name || 'Schönherz Alumni'}
            </Text>
            <GroupDisplay group={group} />
          </Section>
          <Footer canUnsubscribe groupId={group.id} rootGroup={rootGroup} />
        </Body>
      </ConfiguredTailwind>
    </Html>
  );
}

NewEventEmail.PreviewProps = {
  group: {
    name: 'Schönherz Alumni',
    id: '1',
  },
  event: {
    name: 'Találkozó',
    description: 'Közös találkozó a régi iskolatársakkal.',
    startDate: new Date(),
    endDate: addHours(new Date(), 1),
    location: 'BME Q épület',
    groupId: '1',
  },
  eventLink: 'https://alumni.sch.bme.hu/events/1',
};
