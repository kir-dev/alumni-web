import { TbInfoCircle } from 'react-icons/tb';

import { AuditLogList } from '@/components/audit-log/audit-log-list';
import { Alert } from '@/components/ui/alert';
import { prismaClient } from '@/config/prisma.config';

export default async function AuditLogsPage() {
  const response = await prismaClient.auditLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      group: true,
    },
  });

  return (
    <main>
      <h1>Audit napló</h1>
      <Alert variant='info' className='mt-5'>
        <TbInfoCircle /> Az audit napló elemei egy hónap után automatikusan törlésre kerülnek!
      </Alert>
      <AuditLogList auditLogs={response} />
    </main>
  );
}
