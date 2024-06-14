import { z } from 'zod';

import { SpecialSiteSlugs } from '@/lib/static-site';
import { slugify } from '@/lib/utils';

export type StaticSite = {
  title: string;
  blocks: StaticSiteBlock[];
};

export type StaticSiteBlock = {
  type: 'Text' | 'Image' | 'ImageText';
  content: string;
};

export const CreateSiteDto = z.object({
  title: z.string().min(5, 'Cím túl rövid'),
  blocks: z.array(
    z.object({
      type: z.enum(['Text', 'Image', 'ImageText']),
      content: z.string(),
    })
  ),
});

export const CreateGroupSiteDto = z.object({
  title: z
    .string()
    .min(5, 'Cím túl rövid')
    .refine((value) => !SpecialSiteSlugs.includes(slugify(value)), {
      message: 'Ez a cím fenn van tartva. Kérlek válassz másikat.',
    }),
  groupId: z.string(),
  blocks: z.array(
    z.object({
      type: z.enum(['Text', 'Image', 'ImageText']),
      content: z.string(),
    })
  ),
});

export const EditSiteDto = z.object({
  id: z.string(),
  title: z.string().min(5, 'Cím túl rövid'),
  blocks: z.array(
    z.object({
      type: z.enum(['Text', 'Image', 'ImageText']),
      content: z.string(),
    })
  ),
});

export const EditGroupSiteDto = z.object({
  id: z.string(),
  title: z.string().min(5, 'Cím túl rövid'),
  groupId: z.string(),
  blocks: z.array(
    z.object({
      type: z.enum(['Text', 'Image', 'ImageText']),
      content: z.string(),
    })
  ),
});

export const DeleteSiteDto = z.string();

export const DeleteGroupSiteDto = z.object({
  id: z.string(),
  groupId: z.string(),
});
