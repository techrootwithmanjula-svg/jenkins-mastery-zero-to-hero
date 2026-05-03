const express = require("express");
const profileController = require("../controller/profile.controller");
const validationMiddleware = require("../../../core/middleware/validation.middleware");
const { upsertProfileValidation } = require("../validation/profile.validation");

const router = express.Router();

router.get("/", (req, res, next) => profileController.get(req, res, next));

router.put("/", upsertProfileValidation, validationMiddleware, (req, res, next) =>
  profileController.upsert(req, res, next)
);

router.patch("/", upsertProfileValidation, validationMiddleware, (req, res, next) =>
  profileController.upsert(req, res, next)
);

module.exports = router;
