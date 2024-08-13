import * as z from "zod";

export const animeSearchSchema = z.object({
  q: z.string().optional(),
//   eventtype: z.string().optional(),
//   location: z.string().optional(),
});

export type animeSearchValues = z.infer<typeof animeSearchSchema>;