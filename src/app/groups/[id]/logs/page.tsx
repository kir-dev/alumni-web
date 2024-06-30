import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { AuditLogList } from '@/components/audit-log/audit-log-list';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

interface GroupAuditLogPageProps {
  params: {
    id: string;
  };
}

export default async function GroupAuditLogsPage({ params }: GroupAuditLogPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
    include: {
      parentGroup: true,
      subGroups: true,
    },
  });

  if (!group) return notFound();

  const adminMembership = await prismaClient.membership.findFirst({
    where: {
      groupId: params.id,
      userId: session.user.id,
      isAdmin: true,
    },
  });

  if (!adminMembership && !session.user.isSuperAdmin) return <Forbidden />;

  const logs = await prismaClient.auditLog.findMany({
    where: {
      groupId: params.id,
    },
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
      <h1>Csoport audit naplója</h1>
      <AuditLogList auditLogs={logs} />
    </main>
  );
}
