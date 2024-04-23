import { SiteSpecialty } from '@prisma/client';
import { z } from 'zod';

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

export const SetSiteSpecialtyDto = z.object({
  siteId: z.string(),
  specialty: z.enum([SiteSpecialty.Home, SiteSpecialty.PrivacyPolicy, SiteSpecialty.Impressum]),
});

export const DeleteSiteDto = z.string();
