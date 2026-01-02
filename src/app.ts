import express, { type Express } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import reviewRoutes from './routes/ReviewRoutes';
import cors from 'cors';

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api', reviewRoutes);

  app.use(errorHandler);

  return app;
}

export default createApp;
