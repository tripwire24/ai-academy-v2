import { z } from 'zod';

export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  lessonType: z.enum(['content', 'video', 'exercise', 'quiz', 'discussion']).optional(),
  videoUrl: z.string().url().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
