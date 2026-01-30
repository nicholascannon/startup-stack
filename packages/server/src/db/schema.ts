import { integer, pgSchema, varchar } from 'drizzle-orm/pg-core';

export const schema = pgSchema('startup-stack');

// TODO: delete this - sample table only
export const sampleTable = schema.table('sample', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
