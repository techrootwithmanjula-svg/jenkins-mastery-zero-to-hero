const express = require("express");
const babyController = require("../controller/baby.controller");
const validationMiddleware = require("../../../core/middleware/validation.middleware");
const { deleteBabyValidation } = require("../validation/baby.validation");

const router = express.Router();

router.delete("/:id", deleteBabyValidation, validationMiddleware, (req, res, next) =>
  babyController.deleteBaby(req, res, next)
);

module.exports = router;
