import { z } from 'zod';

export const AddDomainDto = z.object({
  domain: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i, 'Helytelen formátumú domén'),
  groupId: z.string(),
});

export const DeleteDomainDto = AddDomainDto;

export const CheckDomainDto = z.object({
  groupId: z.string(),
});

export type DomainConfig = {
  misconfigured: boolean;
  [key: string]: any;
};

export type VercelDomain = {
  name: string;
  updatedAt: number;
  verified: boolean;
  [key: string]: any;
};
