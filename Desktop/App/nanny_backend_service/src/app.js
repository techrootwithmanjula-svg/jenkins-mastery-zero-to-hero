const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const errorMiddleware = require("./core/middleware/error.middleware");
const setupSwagger = require("./docs/swagger/swagger.config");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

setupSwagger(app);
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);

module.exports = app;
