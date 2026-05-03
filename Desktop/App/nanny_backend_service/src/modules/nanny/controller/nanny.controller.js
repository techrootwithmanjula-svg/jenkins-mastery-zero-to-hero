const messages = require("../../../core/constants/messages.constant");
const { successResponse } = require("../../../core/utils/response-formatter.util");
const nannyService = require("../service/nanny.service");

class NannyController {
  async create(req, res, next) {
    try {
      const nanny = await nannyService.create(req.body);
      return res.status(201).json(successResponse(messages.NANNY_CREATED, nanny));
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const nanny = await nannyService.getById(Number(req.params.id));
      return res.status(200).json(successResponse("Nanny details fetched successfully", nanny));
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await nannyService.list(req.query);
      return res.status(200).json(successResponse(messages.NANNY_LIST, result));
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const nanny = await nannyService.update(Number(req.params.id), req.body);
      return res.status(200).json(successResponse(messages.NANNY_UPDATED, nanny));
    } catch (error) {
      return next(error);
    }
  }

  async softDelete(req, res, next) {
    try {
      const nanny = await nannyService.softDelete(Number(req.params.id));
      return res.status(200).json(successResponse(messages.NANNY_DELETED, nanny));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new NannyController();
