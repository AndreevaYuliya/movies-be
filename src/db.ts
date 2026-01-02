import mongoose from 'mongoose';
import config from './config/config';

export async function connectDb(uri = config.mongoUri) {
  await mongoose.connect(uri);
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
