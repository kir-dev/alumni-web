import { z } from 'zod';

export const SetLegacyMailListDto = z.object({
  groupId: z.string(),
  maillist: z.array(z.string().email({ message: 'E-mail cím formában kell megadni' })),
});

export const UnsubscribeFromLegacyMailListDto = z.object({
  email: z.string().email({ message: 'E-mail cím formában kell megadni' }),
  groupId: z.string(),
});
