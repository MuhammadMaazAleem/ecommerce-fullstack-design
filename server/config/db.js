const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const connectDB = async () => {
  const localUri = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017';
  const remoteUri = process.env.MONGO_URI;
  const preferLocal = process.env.PREFER_LOCAL_DB !== 'false';
  const dbName = process.env.MONGO_DB_NAME || 'ecommerce';
  const uriCandidates = preferLocal
    ? [localUri, remoteUri].filter(Boolean)
    : [remoteUri, localUri].filter(Boolean);

  if (uriCandidates.length === 0) {
    throw new Error('No MongoDB connection string found. Configure MONGO_URI_LOCAL or MONGO_URI');
  }

  let lastError = null;

  for (const uri of uriCandidates) {
    try {
      const connection = await mongoose.connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 12000,
      });

      console.log(`MongoDB connected: ${connection.connection.host} (${uri.includes('127.0.0.1') ? 'local' : 'remote'})`);
      return { mode: uri.includes('127.0.0.1') ? 'local' : 'remote' };
    } catch (error) {
      lastError = error;
      console.warn(`MongoDB connection failed for ${uri}: ${error.message}`);
    }
  }

  const allowFallback = process.env.ALLOW_IN_MEMORY_FALLBACK === 'true';

  if (allowFallback && process.env.NODE_ENV !== 'production') {
    console.warn(`MongoDB unavailable (${lastError ? lastError.message : 'unknown error'}). Falling back to in-memory MongoDB.`);

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName,
      },
    });

    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('MongoDB connected: in-memory fallback');

    const closeMemory = async () => {
      if (memoryServer) {
        await memoryServer.stop();
      }
    };

    process.once('SIGINT', closeMemory);
    process.once('SIGTERM', closeMemory);

    return { mode: 'memory' };
  }

  throw lastError || new Error('Unable to connect to MongoDB');
};

module.exports = connectDB;
