import { MembershipStatus } from '@prisma/client';
import type { VariantProps } from 'class-variance-authority';

import { badgeVariants } from '@/components/ui/badge';

export const StatusMap: Record<
  MembershipStatus,
  { label: 'Elfogadva' | 'Függőben' | 'Elutasítva'; color: VariantProps<typeof badgeVariants>['variant'] }
> = {
  Approved: { label: 'Elfogadva', color: 'green' },
  Pending: { label: 'Függőben', color: 'yellow' },
  Rejected: { label: 'Elutasítva', color: 'red' },
};
