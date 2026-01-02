import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  moviesServiceUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/movies_reviews',
  moviesServiceUrl:
    process.env.MOVIES_SERVICE_URL ?? 'http://localhost:8080/api/movies',
};

export default config;
