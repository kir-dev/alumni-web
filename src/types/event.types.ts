import { z } from 'zod';

export const CreateEventDto = z.object({
  groupId: z.string(),
  name: z.string({ required_error: 'Az esemény neve kötelező' }),
  description: z.string({ required_error: 'Az esemény leírása kötelező' }),
  startDate: z
    .string({
      required_error: 'A kezdés dátuma kötelező',
    })
    .datetime({ message: 'A kezdés dátuma nem megfelelő formátumú' }),
  endDate: z
    .string({
      required_error: 'A befejezés dátuma kötelező',
    })
    .datetime({ message: 'A befejezés dátuma nem megfelelő formátumú' }),
  location: z.string({ required_error: 'A helyszín kötelező' }),
  isPrivate: z.boolean(),
});

export const UpdateEventDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().optional(),
  isPrivate: z.boolean().optional(),
  groupId: z.string(),
});

export const DeleteEventDto = z.object({
  eventId: z.string(),
  groupId: z.string(),
});

export const GetEventApplicationForUserDto = z.string();

export const CreateEventApplicationDto = z.string();

export const DeleteEventApplicationDto = z.string();

export type Difference<T> = {
  [P in keyof T]?: {
    before: T[P];
    after: T[P];
  };
};
