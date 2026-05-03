const express = require("express");
const nannyController = require("../controller/nanny.controller");
const validationMiddleware = require("../../../core/middleware/validation.middleware");
const {
  createNannyValidation,
  updateNannyValidation,
  listNannyValidation,
  getByIdValidation,
  deleteNannyValidation
} = require("../validation/nanny.validation");

const router = express.Router();

router.post("/", createNannyValidation, validationMiddleware, (req, res, next) =>
  nannyController.create(req, res, next)
);

router.get("/", listNannyValidation, validationMiddleware, (req, res, next) =>
  nannyController.list(req, res, next)
);

router.get("/:id", getByIdValidation, validationMiddleware, (req, res, next) =>
  nannyController.getById(req, res, next)
);

router.patch("/:id", updateNannyValidation, validationMiddleware, (req, res, next) =>
  nannyController.update(req, res, next)
);

router.put("/:id", updateNannyValidation, validationMiddleware, (req, res, next) =>
  nannyController.update(req, res, next)
);

router.delete("/:id", deleteNannyValidation, validationMiddleware, (req, res, next) =>
  nannyController.softDelete(req, res, next)
);

module.exports = router;
