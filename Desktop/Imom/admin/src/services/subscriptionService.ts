import api from "./api";
import { SUBSCRIPTION_URLS } from "./urls";
import type {
  CompleteReplacementPayload,
  RejectReplacementPayload,
  ReplacementFilterParams,
  SubscriptionFilterParams,
  UpdateSubscriptionLimitsPayload,
} from "../types/entities";
import { buildQueryString } from "../utils/queryParams";

export const getSubscriptionsService = async (params: SubscriptionFilterParams) => {
  const response = await api.get(`${SUBSCRIPTION_URLS.LIST}${buildQueryString(params)}`);
  return response.data;
};

export const getReplacementRequestsService = async (params: ReplacementFilterParams) => {
  const response = await api.get(
    `${SUBSCRIPTION_URLS.REPLACEMENTS}${buildQueryString(params)}`
  );
  return response.data;
};

export const completeReplacementService = async (
  subscriptionId: number,
  replacementId: number,
  payload: CompleteReplacementPayload
) => {
  const response = await api.patch(
    SUBSCRIPTION_URLS.COMPLETE_REPLACEMENT(subscriptionId, replacementId),
    payload
  );
  return response.data;
};

export const rejectReplacementService = async (
  subscriptionId: number,
  replacementId: number,
  payload: RejectReplacementPayload
) => {
  const response = await api.patch(
    SUBSCRIPTION_URLS.REJECT_REPLACEMENT(subscriptionId, replacementId),
    payload
  );
  return response.data;
};

export const updateSubscriptionLimitsService = async (
  subscriptionId: number,
  payload: UpdateSubscriptionLimitsPayload
) => {
  const response = await api.patch(SUBSCRIPTION_URLS.UPDATE_LIMITS(subscriptionId), payload);
  return response.data;
};
