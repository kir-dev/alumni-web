'use client';
import { GroupDomain } from '@prisma/client';
import { TbCheck, TbX } from 'react-icons/tb';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatHu } from '@/lib/utils';
import { VercelDomain } from '@/types/domain.types';

interface DomainListProps {
  vercelDomains: VercelDomain[];
  groupDomains: (GroupDomain & { group: { name: string } })[];
}

export function DomainList({ vercelDomains, groupDomains }: DomainListProps) {
  const domains = vercelDomains.map((domain) => ({
    domain: domain.name,
    group: groupDomains.find((groupDomain) => groupDomain.domain === domain.name)?.group.name ?? 'Nincs csoport',
    verified: domain.verified,
    updatedAt: formatHu(new Date(domain.updatedAt), 'yyyy. MM. dd. HH:mm'),
  }));
  return (
    <Card className='mt-10'>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domén</TableHead>
              <TableHead>Csoport</TableHead>
              <TableHead>Frissítve</TableHead>
              <TableHead>Ellenőrzve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.domain}>
                <TableCell>{domain.domain}</TableCell>
                <TableCell>{domain.group}</TableCell>
                <TableCell>{domain.updatedAt}</TableCell>
                <TableCell>{domain.verified ? <TbCheck /> : <TbX />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {domains.length === 0 && <p className='text-center'>Nincsenek domének.</p>}
      </CardContent>
    </Card>
  );
}
