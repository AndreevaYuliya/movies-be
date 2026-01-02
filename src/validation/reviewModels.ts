import { z } from 'zod';

export const createReviewModel = z.object({
  movieId: z.string().min(1, 'movieId required'),
  author: z.string().min(1, 'author required').max(100),
  comment: z.string().min(1, 'comment required').max(2000).optional(),
  rating: z.number().min(0).max(10),
  createdAt: z.string().datetime().optional(),
});

export const listReviewsQueryModel = z.object({
  movieId: z.string().min(1, 'movieId is required'),
  size: z.coerce.number().int().min(1).max(100).optional(),
  from: z.coerce.number().int().min(0).optional(),
});

export const countsModel = z.object({
  movieIds: z
    .array(
      z.union([z.string().min(1), z.number()]).transform((v) => String(v)),
    )
    .min(1),
});
