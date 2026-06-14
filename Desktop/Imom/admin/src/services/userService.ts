import api from "./api";
import { USER_URLS } from "./urls";
import type { CreateUserPayload, UpdateUserPayload, UserFilterParams } from "../types/entities";
import { buildQueryString } from "../utils/queryParams";

export const createUserService = async (payload: CreateUserPayload) => {
  const response = await api.post(USER_URLS.CREATE, payload);
  return response.data;
};

export const getUsersService = async (params: UserFilterParams) => {
  const response = await api.get(`${USER_URLS.LIST}${buildQueryString(params)}`);
  return response.data;
};

export const updateUserService = async (id: string, payload: UpdateUserPayload) => {
  const response = await api.patch(USER_URLS.UPDATE(id), payload);
  return response.data;
};
