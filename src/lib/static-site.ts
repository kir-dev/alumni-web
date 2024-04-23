import { SiteSpecialty } from '@prisma/client';
import { FunctionComponent } from 'react';

import { ImageRenderer } from '@/components/sites/render/image-renderer';
import { ImageTextRenderer } from '@/components/sites/render/image-text-renderer';
import { TextRenderer } from '@/components/sites/render/text-renderer';
import { StaticSiteBlock } from '@/types/site-editor.types';

export const BlockMap: Record<StaticSiteBlock['type'], FunctionComponent<{ content: string }>> = {
  Text: TextRenderer,
  Image: ImageRenderer,
  ImageText: ImageTextRenderer,
};

export const SpecialtyOptions: { label: string; value: SiteSpecialty }[] = [
  { label: 'Főoldal', value: SiteSpecialty.Home },
  { label: 'Impresszum', value: SiteSpecialty.Impressum },
  { label: 'Adatkezelési tájékoztató', value: SiteSpecialty.PrivacyPolicy },
];
