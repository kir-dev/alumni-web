import { TRPCError } from '@trpc/server';

import { prismaClient } from '@/config/prisma.config';
import { addAuditLog } from '@/lib/audit';
import { slugify } from '@/lib/utils';
import { groupAdminProcedure, superAdminProcedure } from '@/trpc/trpc';
import {
  CreateGroupSiteDto,
  CreateSiteDto,
  DeleteGroupSiteDto,
  DeleteSiteDto,
  EditGroupSiteDto,
  EditSiteDto,
} from '@/types/site-editor.types';

export const createSite = superAdminProcedure.input(CreateSiteDto).mutation(async (opts) => {
  const siteWithSameTitle = await prismaClient.staticSite.findFirst({
    where: {
      title: opts.input.title,
      groupId: null,
    },
  });

  if (siteWithSameTitle) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Ez a cím már foglalt. Kérlek válassz másikat.',
    });
  }

  const created = await prismaClient.staticSite.create({
    data: {
      title: opts.input.title,
      url: slugify(opts.input.title),
      siteBlocks: {
        create: opts.input.blocks.map((block) => ({
          type: block.type,
          content: block.content,
        })),
      },
    },
  });

  await addAuditLog({
    action: `Oldal létrehozása: ${created.title}`,
    userId: opts.ctx.session?.user.id,
    groupId: null,
  });

  return created;
});

export const createGroupSite = groupAdminProcedure.input(CreateGroupSiteDto).mutation(async (opts) => {
  const siteWithSameTitle = await prismaClient.staticSite.findFirst({
    where: {
      title: opts.input.title,
      groupId: opts.input.groupId,
    },
  });

  if (siteWithSameTitle) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Ez a cím már foglalt. Kérlek válassz másikat.',
    });
  }

  const created = await prismaClient.staticSite.create({
    data: {
      title: opts.input.title,
      url: slugify(opts.input.title),
      groupId: opts.input.groupId,
      siteBlocks: {
        create: opts.input.blocks.map((block) => ({
          type: block.type,
          content: block.content,
        })),
      },
    },
  });

  await addAuditLog({
    action: `Oldal létrehozása: ${created.title}`,
    userId: opts.ctx.session?.user.id,
    groupId: opts.input.groupId,
  });

  return created;
});

export const editSite = superAdminProcedure.input(EditSiteDto).mutation(async (opts) => {
  const siteWithSameTitle = await prismaClient.staticSite.findFirst({
    where: {
      id: {
        not: opts.input.id,
      },
      title: opts.input.title,
      groupId: null,
    },
  });

  if (siteWithSameTitle) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Ez a cím már foglalt. Kérlek válassz másikat.',
    });
  }

  const edited = await prismaClient.staticSite.update({
    where: {
      id: opts.input.id,
    },
    data: {
      title: opts.input.title,
      url: slugify(opts.input.title),
      siteBlocks: {
        deleteMany: {},
        create: opts.input.blocks.map((block) => ({
          type: block.type,
          content: block.content,
        })),
      },
    },
  });

  await addAuditLog({
    action: `Oldal módosítása: ${edited.title}`,
    userId: opts.ctx.session?.user.id,
    groupId: null,
  });

  return edited;
});

export const editGroupSite = superAdminProcedure.input(EditGroupSiteDto).mutation(async (opts) => {
  const siteWithSameTitle = await prismaClient.staticSite.findFirst({
    where: {
      id: {
        not: opts.input.id,
      },
      title: opts.input.title,
      groupId: opts.input.groupId,
    },
  });

  if (siteWithSameTitle) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Ez a cím már foglalt. Kérlek válassz másikat.',
    });
  }

  const edited = await prismaClient.staticSite.update({
    where: {
      id: opts.input.id,
      groupId: opts.input.groupId,
    },
    data: {
      title: opts.input.title,
      url: slugify(opts.input.title),
      siteBlocks: {
        deleteMany: {},
        create: opts.input.blocks.map((block) => ({
          type: block.type,
          content: block.content,
        })),
      },
    },
  });

  await addAuditLog({
    action: `Oldal módosítása: ${edited.title}`,
    userId: opts.ctx.session?.user.id,
    groupId: opts.input.groupId,
  });

  return edited;
});

export const deleteSite = superAdminProcedure.input(DeleteSiteDto).mutation(async (opts) => {
  await addAuditLog({
    action: `Oldal törlése: ${opts.input}`,
    userId: opts.ctx.session?.user.id,
    groupId: null,
  });

  return prismaClient.staticSite.delete({
    where: {
      id: opts.input,
    },
  });
});

export const deleteGroupSite = groupAdminProcedure.input(DeleteGroupSiteDto).mutation(async (opts) => {
  await addAuditLog({
    action: `Oldal törlése: ${opts.input.id}`,
    userId: opts.ctx.session?.user.id,
    groupId: opts.input.groupId,
  });

  return prismaClient.staticSite.delete({
    where: {
      id: opts.input.id,
      groupId: opts.input.groupId,
    },
  });
});
