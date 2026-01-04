import { z } from 'zod';

// TODO: test schema - remove
export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;
