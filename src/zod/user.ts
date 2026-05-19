import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;
