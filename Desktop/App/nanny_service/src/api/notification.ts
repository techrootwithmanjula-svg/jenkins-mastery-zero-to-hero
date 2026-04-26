import { Notification } from '../models';
import { mockNotifications, delay } from '../mocks/data';

/**
 * Fetch all notifications for the current user.
 * Currently returns mock data — replace with real API call later.
 */
export const fetchNotificationsApi = async (): Promise<Notification[]> => {
  await delay(400);
  return mockNotifications;
};
