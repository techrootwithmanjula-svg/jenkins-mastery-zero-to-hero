import apiClient from './client';
import { Subscription } from '../models';
import { USE_MOCK_API } from '../mocks';
import { delay, mockSubscriptions, nextSubId } from '../mocks/data';

/**
 * Request payload for creating a subscription.
 * Schema: weekly frequency with weekday selection and time range.
 */
export interface CreateSubscriptionRequest {
  nannyId: string;
  nannyName: string;
  /** Weekly frequency: 1 (one day/week) or 2 (two days/week) */
  frequencyPerWeek: 1 | 2;
  /** Weekday names matching frequency count (e.g., ["Monday"] or ["Monday", "Wednesday"]) */
  weekdays: string[];
  /** Start time in HH:mm format (e.g., "09:00") */
  startTime: string;
  /** End time in HH:mm format (e.g., "12:00") */
  endTime: string;
}

/**
 * Get user's subscriptions.
 */
export const getSubscriptions = async (): Promise<Subscription[]> => {
  if (USE_MOCK_API) {
    await delay(500);
    return [...mockSubscriptions];
  }
  const response = await apiClient.get('/subscriptions');
  return response.data;
};

/**
 * Create a new subscription.
 */
export const createSubscription = async (
  data: CreateSubscriptionRequest,
): Promise<Subscription> => {
  if (USE_MOCK_API) {
    await delay(600);
    const sub: Subscription = {
      id: nextSubId(),
      userId: 'u1',
      nannyId: data.nannyId,
      nannyName: data.nannyName,
      frequencyPerWeek: data.frequencyPerWeek,
      weekdays: data.weekdays,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    mockSubscriptions.unshift(sub);
    return sub;
  }
  const response = await apiClient.post('/subscriptions', data);
  return response.data;
};

/**
 * Update subscription details.
 */
export const updateSubscription = async (
  subscriptionId: string,
  data: Partial<CreateSubscriptionRequest>,
): Promise<Subscription> => {
  if (USE_MOCK_API) {
    await delay(500);
    const sub = mockSubscriptions.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    if (data.frequencyPerWeek) sub.frequencyPerWeek = data.frequencyPerWeek;
    if (data.weekdays) sub.weekdays = data.weekdays;
    if (data.startTime) sub.startTime = data.startTime;
    if (data.endTime) sub.endTime = data.endTime;
    return { ...sub };
  }
  const response = await apiClient.put(`/subscriptions/${subscriptionId}`, data);
  return response.data;
};

/**
 * Pause a subscription.
 */
export const pauseSubscription = async (subscriptionId: string): Promise<Subscription> => {
  if (USE_MOCK_API) {
    await delay(500);
    const sub = mockSubscriptions.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    sub.status = 'paused';
    return { ...sub };
  }
  const response = await apiClient.post(`/subscriptions/${subscriptionId}/pause`);
  return response.data;
};

/**
 * Resume a paused subscription.
 */
export const resumeSubscription = async (subscriptionId: string): Promise<Subscription> => {
  if (USE_MOCK_API) {
    await delay(500);
    const sub = mockSubscriptions.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    sub.status = 'active';
    return { ...sub };
  }
  const response = await apiClient.post(`/subscriptions/${subscriptionId}/resume`);
  return response.data;
};

/**
 * Delete a subscription.
 */
export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
  if (USE_MOCK_API) {
    await delay(400);
    const idx = mockSubscriptions.findIndex((s) => s.id === subscriptionId);
    if (idx >= 0) mockSubscriptions.splice(idx, 1);
    return;
  }
  await apiClient.delete(`/subscriptions/${subscriptionId}`);
};
