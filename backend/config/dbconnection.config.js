import mongoose from 'mongoose';

const DB_NAME = process.env.DB_NAME || 'loadstar';
// Pool size is a variable in Q4, so it comes from env instead of being hardcoded
const MAX_POOL_SIZE = Number(process.env.MONGO_MAX_POOL_SIZE) || 10;

mongoose.connection.on('connected', () => {
  console.log(`MongoDB connected (db: ${DB_NAME}, maxPoolSize: ${MAX_POOL_SIZE})`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

export async function connectDB() {
  const uri = process.env.URI;
  if (!uri) {
    throw new Error('URI is not set in .env');
  }

  await mongoose.connect(uri, {
    dbName: DB_NAME,
    maxPoolSize: MAX_POOL_SIZE,
    serverSelectionTimeoutMS: 10000,
    // Indexes are created/dropped explicitly by scripts/indexes.js for Q2
    autoIndex: false,
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
}; 

