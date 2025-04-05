import { MembershipStatus, Prisma, User } from '@prisma/client';
import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import GeneralEmail from '@/emails/general';
import GroupGeneralEmail from '@/emails/group-general';
import MembershipStatusEmail from '@/emails/membership-status';
import { addAuditLog } from '@/lib/audit';
import { batchSendEmail, singleSendEmail } from '@/lib/email';
import { StatusMap } from '@/lib/group';
import { groupAdminProcedure, privateProcedure, superAdminProcedure } from '@/trpc/trpc';
import {
  CreateGroupDto,
  DeleteMembershipDto,
  EditMembershipDto,
  JoinGroupDto,
  MemberQuery,
  SendEmailDto,
  ToggleAdminDto,
  UpdateGroupDto,
  UpdateNotificationSettingsDto,
} from '@/types/group.types';

export const getGroups = superAdminProcedure.query(async () => {
  return prismaClient.group.findMany();
});

export const getGroup = superAdminProcedure.input(z.string()).query(async (opts) => {
  return prismaClient.group.findUnique({
    where: {
      id: opts.input,
    },
  });
});

export const createGroup = superAdminProcedure.input(CreateGroupDto).mutation(async (opts) => {
  const { parentGroupId, ...data } = opts.input;

  return prismaClient.group.create({
    data: {
      ...data,
      parentGroup: parentGroupId ? { connect: { id: parentGroupId } } : undefined,
    },
  });
});

export const updateGroup = groupAdminProcedure.input(UpdateGroupDto).mutation(async (opts) => {
  const { groupId, data } = opts.input;

  const updated = await prismaClient.group.update({
    where: {
      id: groupId,
    },
    data,
  });

  await addAuditLog({
    groupId: groupId,
    action: `Csoport frissítése: ${updated.name}`,
    userId: opts.ctx.session?.user.id,
  });

  return updated;
});

export const joinGroup = privateProcedure.input(JoinGroupDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return await createMembership(opts.input, {
    id: opts.ctx.session.user.id,
    email: opts.ctx.session.user.email,
  });
});

const createMembership = async (groupId: string, user: { id: string; email: string }) => {
  const group = await prismaClient.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) throw new TRPCError({ code: 'NOT_FOUND' });

  let isParentMember = false;

  if (group.parentGroupId) {
    const parentMembership = await prismaClient.membership.findFirst({
      where: {
        groupId: group.parentGroupId,
        userId: user.id,
      },
    });
    if (parentMembership) {
      isParentMember = parentMembership.status === MembershipStatus.Approved;
    } else {
      await createMembership(group.parentGroupId, user);
    }
  }

  const membership = await prismaClient.membership.create({
    data: {
      groupId,
      userId: user.id,
      status: !group.parentGroupId || isParentMember ? MembershipStatus.Pending : MembershipStatus.Dependent,
    },
    include: {
      group: true,
      user: true,
    },
  });

  await sendJoinNotificationToGroupAdmins(groupId, membership.user);

  if (membership.user.emailVerified) {
    await singleSendEmail({
      to: user.email,
      subject: 'Csoporthoz csatlakoztál!',
      html: render(
        MembershipStatusEmail({
          group: { id: membership.groupId, name: membership.group.name },
          status: StatusMap[membership.status].label,
        })
      ),
    });
  }

  return membership;
};

export const leaveGroup = privateProcedure.input(JoinGroupDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return prismaClient.membership.deleteMany({
    where: {
      groupId: opts.input,
      userId: opts.ctx.session.user.id,
    },
  });
});

export const editMembership = groupAdminProcedure.input(EditMembershipDto).mutation(async (opts) => {
  const membership = await prismaClient.membership.update({
    where: {
      status: {
        in: [MembershipStatus.Pending, MembershipStatus.Rejected],
      },
      userId_groupId: {
        groupId: opts.input.groupId,
        userId: opts.input.userId,
      },
    },
    data: {
      status: opts.input.status,
    },
    include: {
      user: true,
      group: true,
    },
  });

  if (opts.input.status === MembershipStatus.Approved) {
    await prismaClient.membership.updateMany({
      where: {
        userId: opts.input.userId,
        group: {
          parentGroupId: opts.input.groupId,
        },
        status: MembershipStatus.Dependent,
      },
      data: {
        status: MembershipStatus.Pending,
      },
    });
  }

  if (membership.user.emailVerified) {
    await singleSendEmail({
      to: membership.user.email,
      subject: 'Csoporttagságod státusza megváltozott',
      html: render(
        MembershipStatusEmail({
          group: { id: membership.groupId, name: membership.group.name },
          status: StatusMap[membership.status].label,
        })
      ),
    });
  }

  await addAuditLog({
    groupId: opts.input.groupId,
    action: `Tagság státusz módosítása: ${membership.user.lastName} ${membership.user.firstName} - ${StatusMap[membership.status].label}`,
    userId: opts.ctx.session?.user.id,
  });

  return membership;
});

export const deleteMembership = groupAdminProcedure.input(DeleteMembershipDto).mutation(async (opts) => {
  const result = await prismaClient.membership.deleteMany({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
  });

  await addAuditLog({
    groupId: opts.input.groupId,
    action: `Tagság törlése: ${opts.input.userId}`,
    userId: opts.ctx.session?.user.id,
  });

  return result;
});

export const toggleAdmin = groupAdminProcedure.input(ToggleAdminDto).mutation(async (opts) => {
  const membership = await prismaClient.membership.findFirst({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
    include: {
      user: true,
    },
  });

  if (!membership) throw new TRPCError({ code: 'NOT_FOUND' });

  await addAuditLog({
    groupId: opts.input.groupId,
    userId: opts.ctx.session?.user.id,
    action: `Admin jog módosítása: ${membership.user.lastName} ${membership.user.firstName} - ${membership.isAdmin ? 'Elvéve' : 'Hozzáadva'}`,
  });

  return prismaClient.membership.updateMany({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
    data: {
      isAdmin: !membership.isAdmin,
    },
  });
});

export const sendEmail = groupAdminProcedure.input(SendEmailDto).mutation(async (opts) => {
  const group = await prismaClient.group.findUnique({
    where: {
      id: opts.input.groupId,
    },
    include: {
      members: {
        where: {
          status: MembershipStatus.Approved,
          enableGroupNotification: true,
          user: {
            NOT: {
              emailVerified: null,
            },
          },
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!group) throw new TRPCError({ code: 'NOT_FOUND' });

  await batchSendEmail({
    to: Array.from(new Set([...group.members.map((member) => member.user.email), ...(group.legacyMaillist ?? [])])),
    subject: opts.input.subject,
    html: render(
      GroupGeneralEmail({
        content: opts.input.content,
        group: { id: group.id, name: group.name },
      })
    ),
  });

  await addAuditLog({
    groupId: opts.input.groupId,
    action: `Email küldése: ${opts.input.subject}`,
    userId: opts.ctx.session?.user.id,
  });
});

async function sendJoinNotificationToGroupAdmins(groupId: string, user: User) {
  const group = await prismaClient.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) return;

  const groupAdmins = await prismaClient.membership.findMany({
    where: {
      groupId,
      isAdmin: true,
      user: {
        NOT: {
          emailVerified: null,
        },
      },
    },
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const emails = groupAdmins.map((admin) => admin.user.email);

  await batchSendEmail({
    to: emails,
    subject: 'Új csatlakozási kérelem a csoportodhoz',
    html: render(
      GeneralEmail({
        content: `${user.lastName} ${user.firstName} csatlakozni szeretne a ${group.name} csoportba.`,
        group: { id: group.id, name: group.name },
      })
    ),
  });
}

export const deleteGroup = superAdminProcedure.input(z.string()).mutation(async (opts) => {
  const result = await prismaClient.group.delete({
    where: {
      id: opts.input,
    },
  });

  await addAuditLog({
    groupId: null,
    action: `Csoport törlése: ${result.name}`,
    userId: opts.ctx.session?.user.id,
  });
});

export const updateNotificationPreferences = privateProcedure
  .input(UpdateNotificationSettingsDto)
  .mutation(async (opts) => {
    if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return prismaClient.membership.update({
      where: {
        userId_groupId: {
          groupId: opts.input.groupId,
          userId: opts.ctx.session.user.id,
        },
      },
      data: {
        enableGroupNotification: opts.input.enableGroupNotification,
        enableEventNotification: opts.input.enableEventNotification,
        enableNewsNotification: opts.input.enableNewsNotification,
      },
    });
  });

export const getMembers = groupAdminProcedure.input(MemberQuery).query(async ({ input }) => {
  const query: Prisma.MembershipWhereInput = {
    groupId: input.groupId,
    isAdmin: input.isAdministrator ? true : undefined,
    user: {
      OR: [
        {
          firstName: {
            contains: input.name,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: input.name,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: input.name,
            mode: 'insensitive',
          },
        },
      ],
    },
  };

  const result = await prismaClient.membership.findMany({
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    where: query,
    orderBy: {
      user: input.sort ? { [input.sort.field]: input.sort.order } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          nickname: true,
          email: true,
          emailVerified: true,
          phone: true,
        },
      },
    },
  });

  const totalCount = await prismaClient.membership.count({
    where: query,
  });

  const maxPage = Math.max(Math.ceil(totalCount / input.limit), 1);
  const page = Math.min(input.page, maxPage);

  return {
    result,
    totalCount,
    maxPage,
    page,
  };
});
