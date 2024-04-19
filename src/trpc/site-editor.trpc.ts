import { prismaClient } from '@/config/prisma.config';
import { slugify } from '@/lib/utils';
import { superAdminProcedure } from '@/trpc/trpc';
import { CreateSiteDto, DeleteSiteDto, EditSiteDto } from '@/types/site-editor.types';

export const createSite = superAdminProcedure.input(CreateSiteDto).mutation(async (opts) => {
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

export const editSite = superAdminProcedure.input(EditSiteDto).mutation(async (opts) => {
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

export const deleteSite = superAdminProcedure.input(DeleteSiteDto).mutation(async (opts) => {
  return prismaClient.staticSite.delete({
    where: {
      id: opts.input,
    },
  });
});