import { Column, Row, Section, Text } from '@react-email/components';

import { SITE_URL } from '@/config/environment.config';

import { StyledButton } from './button';

interface GroupDisplayProps {
  group: { name: string; id: string };
}

export function GroupDisplay({ group }: GroupDisplayProps) {
  return (
    <Section className='mt-5'>
      <Row className='p-2 bg-slate-100 rounded-xl'>
        <Column className='w-[30px] h-[30px] rounded-md bg-white p-2 text-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            width='24'
            height='24'
            strokeWidth='2'
          >
            <path d='M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' /> <path d='M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1' />
            <path d='M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' /> <path d='M17 10h2a2 2 0 0 1 2 2v1' />
            <path d='M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' /> <path d='M3 13v-1a2 2 0 0 1 2 -2h2' />
          </svg>
        </Column>
        <Column className='pl-2'>
          <Text className='font-bold m-0'>{group.name}</Text>
          <Text className='m-0'>Csoport</Text>
        </Column>
        <Column className='pl-2 w-[50px]'>
          <StyledButton className='px-2' href={`${SITE_URL}/groups/${group.id}`}>
            <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9 3H3C2.46957 3 1.96086 3.21071 1.58579 3.58579C1.21071 3.96086 1 4.46957 1 5V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H13C13.5304 17 14.0391 16.7893 14.4142 16.4142C14.7893 16.0391 15 15.5304 15 15V9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M8 10L17 1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M12 1H17V6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </StyledButton>
        </Column>
      </Row>
    </Section>
  );
}
