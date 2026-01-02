import { jest } from '@jest/globals';
import request from 'supertest';
import axios from 'axios';
import createApp from '../../app';
import { ReviewModel } from '../../models/ReviewModel';

const mockedGet = jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Reviews endpoints (integration)', () => {
  const app = createApp();

  test('POST /api/reviews creates review and auto sets createdAt', async () => {
    mockedGet.mockResolvedValueOnce({
      status: 200,
      data: { id: 1 },
    } as any);

    const res = await request(app).post('/api/reviews').send({
      movieId: '2',
      author: 'Alice',
      comment: 'Nice',
      rating: 9,
    });

    expect(res.status).toBe(201);
    expect(res.body.movieId).toBe('2');
    expect(res.body.author).toBe('Alice');
    expect(res.body.comment).toBe('Nice');
    expect(res.body.rating).toBe(9);
    expect(res.body.createdAt).toBeTruthy();
  });

  test('POST /api/reviews returns 400 if movie not found in Movies service', async () => {
    mockedGet.mockRejectedValueOnce({
      response: { status: 404 },
    } as any);

    const res = await request(app).post('/api/reviews').send({
      movieId: '999',
      author: 'Bob',
      comment: 'Nope',
      rating: 5,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Movie not found/i);
  });

  test('GET /api/reviews returns reviews sorted by createdAt desc', async () => {
    await ReviewModel.create({
      movieId: '2',
      author: 'A',
      comment: 'old',
      rating: 7,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    });

    await ReviewModel.create({
      movieId: '2',
      author: 'B',
      comment: 'new',
      rating: 8,
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });

    const res = await request(app).get('/api/reviews?movieId=2&size=10&from=0');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].comment).toBe('new');
    expect(res.body[1].comment).toBe('old');
  });

  test('POST /api/reviews/_counts returns counts via aggregation', async () => {
    await ReviewModel.create({
      movieId: '2',
      author: 'A',
      comment: '1',
      rating: 6,
    });

    await ReviewModel.create({
      movieId: '2',
      author: 'B',
      comment: '2',
      rating: 8,
    });

    await ReviewModel.create({
      movieId: '3',
      author: 'C',
      comment: '3',
      rating: 5,
    });

    const res = await request(app)
      .post('/api/reviews/_counts')
      .send({ movieIds: ['2', '3', '4'] });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ '2': 2, '3': 1, '4': 0 });
  });
});
