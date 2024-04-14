import { z } from 'zod';

export const VerifyTfaInput = z.object({
  token: z.string().length(6),
});
