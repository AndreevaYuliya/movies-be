import mongoose from 'mongoose';
import createApp from './app';
import config from './config/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = createApp();

(async () => {
  let mongoServer: MongoMemoryServer | null = null;

  try {
    if (process.env.USE_IN_MEMORY_DB === 'true') {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log('Connected to in-memory MongoDB');
    } else {
      await mongoose.connect(config.mongoUri);
      console.log(`Connected to MongoDB at ${config.mongoUri}`);
    }

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }

  const shutdown = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
