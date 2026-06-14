import api from "./api";
import { NANNY_URLS } from "./urls";
import type { CreateNannyPayload, UpdateNannyPayload, NannyFilterParams } from "../types/entities";
import { buildQueryString } from "../utils/queryParams";

export const createNannyService = async (
  payload: CreateNannyPayload & { user_id: number; image?: string }
) => {
  const response = await api.post(NANNY_URLS.CREATE, payload);
  return response.data;
};

export const getNanniesService = async (params: NannyFilterParams) => {
  const response = await api.get(`${NANNY_URLS.LIST}${buildQueryString(params)}`);
  return response.data;
};

export const updateNannyService = async (
  id: number,
  payload: UpdateNannyPayload & { image?: string }
) => {
  const response = await api.put(NANNY_URLS.UPDATE(id), payload);
  return response.data;
};

export const deleteNannyService = async (id: number) => {
  const response = await api.delete(NANNY_URLS.DELETE(id));
  return response.data;
};
