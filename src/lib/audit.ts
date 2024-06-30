import { prismaClient } from '@/config/prisma.config';

interface AddAuditLog {
  userId: string | null | undefined;
  groupId: string | null | undefined;
  action: string;
}

export function addAuditLog({ userId, action, groupId }: AddAuditLog) {
  // eslint-disable-next-line no-console
  console.info(`${action} - userId: ${userId} - groupId: ${groupId}`);
  return prismaClient.auditLog.create({
    data: {
      action,
      userId,
      groupId,
    },
  });
}
