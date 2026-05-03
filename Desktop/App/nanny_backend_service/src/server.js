const app = require("./app");
const env = require("./config/env.config");
const { connectDatabase } = require("./config/database.config");
const { info, error } = require("./core/utils/logger.util");

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      info("Server started", { port: env.port, env: env.nodeEnv });
    });
  } catch (startupError) {
    error("Failed to initialize server", {
      message: startupError.message
    });
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (reason) => {
  error("Unhandled Rejection", { reason });
});

process.on("uncaughtException", (err) => {
  error("Uncaught Exception", { message: err.message, stack: err.stack });
  process.exit(1);
});
