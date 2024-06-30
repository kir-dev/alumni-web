import { AuditLog, Group, User } from '@prisma/client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatHu } from '@/lib/utils';

interface AuditLogListProps {
  auditLogs: (AuditLog & {
    user: User | null;
    group: Group | null;
  })[];
}

export function AuditLogList({ auditLogs }: AuditLogListProps) {
  return (
    <Card className='mt-10'>
      <CardContent className='px-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead>
              <TableHead>Művelet</TableHead>
              <TableHead>Név</TableHead>
              <TableHead>Csoport</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.createdAt + log.action}>
                <TableCell>{formatHu(log.createdAt, 'MM. dd. HH:mm')}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className='text-nowrap'>
                  {log.user?.lastName ?? 'Ismeretlen'} {log.user?.firstName}{' '}
                  {log.user?.isSuperAdmin && <Badge variant='outline'>Szuperadmin</Badge>}
                </TableCell>
                <TableCell>{log.group?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {auditLogs.length === 0 && <p className='text-center'>Nincsenek műveletek.</p>}
      </CardContent>
    </Card>
  );
}
