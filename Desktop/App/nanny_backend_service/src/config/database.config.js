const { Pool } = require("pg");
const env = require("./env.config");
const { info, warn, error: logError } = require("../core/utils/logger.util");

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on("error", (error) => {
  logError("Unexpected database pool error", { message: error.message });
});

const connectDatabase = async () => {
  if (!env.databaseUrl) {
    warn("DATABASE_URL is not set. Skipping PostgreSQL connection bootstrap.");
    return false;
  }

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    info("PostgreSQL connection established");
    return true;
  } catch (dbError) {
    if (env.nodeEnv === "production") {
      throw dbError;
    }

    warn("PostgreSQL not reachable. Continuing in non-production mode.", {
      reason: dbError.message || dbError.code || "Unknown connection error"
    });
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  connectDatabase,
  pool
};
