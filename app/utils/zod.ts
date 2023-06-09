import { z } from "zod";

// const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
// type Literal = z.infer<typeof literalSchema>;
// type Json = Literal | { [key: string]: Json } | Json[];
// const jsonSchema: z.ZodType<Json> = z.lazy(() =>
//   z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
// );

export const commentSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  // user: jsonSchema.optional(),
  user: z.any(),

  userId: z.string(),
  text: z.string().min(5),
});
export type CommentType = z.infer<typeof commentSchema>;

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  comments: z.array(commentSchema).optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  provider: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),

  email: z.string().email(),
});

export const userWithoutId = userSchema.omit({ id: true });

export type UserType = z.infer<typeof userSchema>;
export type UserWithoutIdType = z.infer<typeof userWithoutId>;
