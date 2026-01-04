import { z } from 'zod';

// Shared Zod schemas
export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;
