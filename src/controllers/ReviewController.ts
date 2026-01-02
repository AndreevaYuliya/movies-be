import { Request, Response } from 'express';
import axios from 'axios';
import { ReviewService } from '../services/ReviewService';
import config from '../config/config';
import {
  countsModel,
  createReviewModel,
  listReviewsQueryModel,
} from '../validation/reviewModels';

export class ReviewController {
  static async create(req: Request, res: Response) {
    const parseResult = createReviewModel.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: parseResult.error.flatten((issue) => issue.message)
          .fieldErrors,
      });
    }

    const { movieId, author, comment, rating } = parseResult.data;

    if (process.env.SKIP_MOVIES_VALIDATION !== 'true') {
      try {
        const moviesServiceUrl =
          process.env.MOVIES_SERVICE_URL ?? config.moviesServiceUrl;

        await axios.get(`${moviesServiceUrl}/${movieId}`);
      } catch (err: any) {
        return res.status(400).json({ message: 'Movie not found' });
      }
    }

    const review = await ReviewService.create({
      movieId,
      author,
      comment,
      rating,
    });

    res.status(201).json(review);
  }

  static async getByMovie(req: Request, res: Response) {
    const parsed = listReviewsQueryModel.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: parsed.error.flatten((issue) => issue.message).fieldErrors,
      });
    }

    const reviews = await ReviewService.findByMovie(
      parsed.data.movieId,
      parsed.data.size ?? 10,
      parsed.data.from ?? 0,
    );

    res.json(reviews);
  }

  static async counts(req: Request, res: Response) {
    const parsed = countsModel.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: parsed.error.flatten((issue) => issue.message).fieldErrors,
      });
    }

    const counts = await ReviewService.countByMovies(parsed.data.movieIds);
    res.json(counts);
  }
}
