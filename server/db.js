const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/expense_tracker';

const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
};

function resolvePrimaryUri() {
  if (process.env.USE_LOCAL_MONGO === 'true') {
    return LOCAL_URI;
  }

  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<db_password>')) {
    return LOCAL_URI;
  }

  return uri;
}

function isAtlasUri(uri) {
  return uri.includes('mongodb.net') || uri.includes('mongodb+srv');
}

async function connectDatabase() {
  const primary = resolvePrimaryUri();

  try {
    await mongoose.connect(primary, CONNECT_OPTIONS);
    console.log(`🚀 MongoDB connected (${primary.includes('127.0.0.1') ? 'local' : 'remote'})`);
    return mongoose.connection;
  } catch (err) {
    if (primary === LOCAL_URI || !isAtlasUri(primary)) {
      throw err;
    }

    console.warn('⚠️  Atlas connection failed — using local MongoDB instead.');
    console.warn(`   Reason: ${err.message}`);
    await mongoose.connect(LOCAL_URI, CONNECT_OPTIONS);
    console.log(`🚀 MongoDB connected (local fallback → ${LOCAL_URI})`);
    return mongoose.connection;
  }
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDbReady, LOCAL_URI };
