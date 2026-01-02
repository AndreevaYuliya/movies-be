import { ReviewModel } from '../models/ReviewModel';

export class ReviewService {
  static async create(data: any) {
    return ReviewModel.create(data);
  }

  static async findByMovie(movieId: string, size = 10, from = 0) {
    return ReviewModel.find({ movieId })
      .sort({ createdAt: -1 })
      .skip(from)
      .limit(size);
  }

  static async countByMovies(movieIds: string[]) {
    const result = await ReviewModel.aggregate([
      {
        $match: {
          movieId: {
            $in: movieIds,
          },
        },
      },

      {
        $group: {
          _id: '$movieId',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const counts: Record<string, number> = {};
    movieIds.forEach((id) => (counts[id] = 0));

    interface AggregationResult {
      _id: string;
      count: number;
    }

    result.forEach((r: AggregationResult) => {
      counts[r._id] = r.count;
    });

    return counts;
  }
}
