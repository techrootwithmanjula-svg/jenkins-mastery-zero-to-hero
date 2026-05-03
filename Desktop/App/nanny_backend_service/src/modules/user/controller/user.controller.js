const messages = require("../../../core/constants/messages.constant");
const { successResponse } = require("../../../core/utils/response-formatter.util");
const userService = require("../service/user.service");

class UserController {
  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json(successResponse(messages.USER_CREATED, user));
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(Number(req.params.id));
      return res.status(200).json(successResponse(messages.USER_DETAILS, user));
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await userService.list(req.query);
      return res.status(200).json(successResponse(messages.USER_LIST, result));
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(Number(req.params.id), req.body);
      return res.status(200).json(successResponse(messages.USER_UPDATED, user));
    } catch (error) {
      return next(error);
    }
  }

  async softDelete(req, res, next) {
    try {
      const user = await userService.softDelete(Number(req.params.id));
      return res.status(200).json(successResponse(messages.USER_DELETED, user));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
