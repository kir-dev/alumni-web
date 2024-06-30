import { TRPCError } from '@trpc/server';

import { prismaClient } from '@/config/prisma.config';
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

  return prismaClient.staticSite.create({
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

  return prismaClient.staticSite.create({
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

  return prismaClient.staticSite.update({
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

  return prismaClient.staticSite.update({
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
});

export const deleteSite = superAdminProcedure.input(DeleteSiteDto).mutation(async (opts) => {
  return prismaClient.staticSite.delete({
    where: {
      id: opts.input,
    },
  });
});

export const deleteGroupSite = groupAdminProcedure.input(DeleteGroupSiteDto).mutation(async (opts) => {
  return prismaClient.staticSite.delete({
    where: {
      id: opts.input.id,
      groupId: opts.input.groupId,
    },
  });
});
