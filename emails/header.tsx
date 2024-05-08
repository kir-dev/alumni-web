import { Column, Img, Row, Section, Text } from '@react-email/components';

export function Header() {
  return (
    <Section>
      <Row className='w-fit'>
        <Column>
          <Img
            className='mr-2'
            src='https://alumni-sch.vercel.app/icon.png'
            alt='Schönherz Alumni'
            width={40}
            height={40}
          />
        </Column>
        <Column>
          <Text className='text-center text-2xl text-primary-500'>Schönherz Alumni</Text>
        </Column>
      </Row>
    </Section>
  );
}
