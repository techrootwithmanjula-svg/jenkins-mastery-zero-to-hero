const express = require("express");
const userController = require("../controller/user.controller");
const validationMiddleware = require("../../../core/middleware/validation.middleware");
const {
  createUserValidation,
  updateUserValidation,
  listUserValidation,
  getByIdValidation,
  deleteUserValidation
} = require("../validation/user.validation");

const router = express.Router();

router.post("/", createUserValidation, validationMiddleware, (req, res, next) =>
  userController.create(req, res, next)
);

router.get("/", listUserValidation, validationMiddleware, (req, res, next) =>
  userController.list(req, res, next)
);

router.get("/:id", getByIdValidation, validationMiddleware, (req, res, next) =>
  userController.getById(req, res, next)
);

router.patch("/:id", updateUserValidation, validationMiddleware, (req, res, next) =>
  userController.update(req, res, next)
);

router.put("/:id", updateUserValidation, validationMiddleware, (req, res, next) =>
  userController.update(req, res, next)
);

router.delete("/:id", deleteUserValidation, validationMiddleware, (req, res, next) =>
  userController.softDelete(req, res, next)
);

module.exports = router;
