import mongoose from 'mongoose';

// Get MongoDB URI from environment - evaluated at runtime
function getMongoDBUri(): string {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sphinx-reisen';

  if (!uri) {
    throw new Error('Please define MONGODB_URI environment variable');
  }

  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    // Get URI at connection time, not module load time
    const MONGODB_URI = getMongoDBUri();
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default mongoose;
