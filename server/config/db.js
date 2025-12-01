// lib/db.js
const mongoose = require("mongoose");

/**
 * Cached global connection for serverless environments (Vercel).
 * This avoids opening many connections on cold starts.
 */
const DEFAULT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // increase timeouts slightly to reduce 'secureConnect timed out' errors
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000, // how long to try before failing
  // retryWrites usually okay with Atlas
  // retryWrites: true
};

let cached = global._mongoose; // global cache across lambda warm invocations
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function _connectOnce(uri, opts = {}) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { ...DEFAULT_OPTIONS, ...opts })
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        // clear the promise so future attempts can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * connectDB - tries to connect (with one retry/backoff). Returns boolean.
 * Use this at app startup or inside handlers before DB ops.
 */
async function connectDB({ retry = true } = {}) {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    return false;
  }

  try {
    const conn = await _connectOnce(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err && err.message);
    if (err && err.stack) console.error(err.stack);
    // If transient and allowed, try one retry with backoff
    if (retry) {
      console.log("⏳ Retrying connection in 2s...");
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const conn = await _connectOnce(MONGO_URI);
        console.log(`✅ MongoDB Connected after retry: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        return true;
      } catch (err2) {
        console.error("❌ Retry failed:", err2 && err2.message);
        if (err2 && err2.stack) console.error(err2.stack);
      }
    }
    return false;
  }
}

function checkConnection() {
  // readyState === 1 is connected
  return cached.conn && mongoose.connection.readyState === 1;
}

// Optional helper to gracefully close (useful for local dev)
async function closeConnection() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected");
});

module.exports = { connectDB, checkConnection, closeConnection };
