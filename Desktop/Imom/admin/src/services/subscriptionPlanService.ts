import api from "./api";
import { SUBSCRIPTION_PLAN_URLS } from "./urls";
import type { UpdateSubscriptionPlanPayload } from "../types/entities";

export const getSubscriptionPlansService = async () => {
  const response = await api.get(SUBSCRIPTION_PLAN_URLS.LIST);
  return response.data;
};

export const updateSubscriptionPlanService = async (
  planId: string,
  payload: UpdateSubscriptionPlanPayload
) => {
  const response = await api.patch(SUBSCRIPTION_PLAN_URLS.UPDATE(planId), payload);
  return response.data;
};
