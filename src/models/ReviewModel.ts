import mongoose, { Schema, model } from 'mongoose';

export interface Review {
  movieId: string;
  author: string;
  comment?: string;
  rating: number;
  createdAt: Date;
}

const reviewModel = new Schema<Review>(
  {
    movieId: {
      type: String,
      required: true,
      index: true,
    },

    author: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
  },

  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }, // createdAt auto
);

reviewModel.index({ movieId: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<Review>('Review', reviewModel);
