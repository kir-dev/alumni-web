import { Column, Img, Row, Section, Text } from '@react-email/components';

import { RootGroup } from '@/types/group.types';

interface HeaderProps {
  rootGroup?: RootGroup;
}

export function Header({ rootGroup }: HeaderProps) {
  return (
    <Section>
      <Row className='w-fit'>
        <Column>
          <Img
            className='mr-2'
            src={rootGroup?.icon ?? 'https://alumni.sch.bme.hu/icon.png'}
            alt={rootGroup?.name ?? 'Schönherz & VIK Alumni'}
            width={40}
            height={40}
          />
        </Column>
        <Column>
          <Text className='text-center text-2xl text-primary-500'>{rootGroup?.name ?? 'Schönherz & VIK Alumni'}</Text>
        </Column>
      </Row>
    </Section>
  );
}
