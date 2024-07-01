import { AuditLogList } from '@/components/audit-log/audit-log-list';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit } from '@/lib/server-utils';

interface GroupAuditLogPageProps {
  params: {
    id: string;
  };
}

export default async function GroupAuditLogsPage({ params }: GroupAuditLogPageProps) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const logs = await getLogs(params.id);

  return (
    <main>
      <h1>Csoport audit naplója</h1>
      <AuditLogList auditLogs={logs} />
    </main>
  );
}

async function getLogs(groupId: string) {
  return prismaClient.auditLog.findMany({
    where: {
      groupId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      group: true,
    },
  });
}
