import apiClient from './client';
import { User, BabyDetail } from '../models';
import { USE_MOCK_API } from '../mocks';
import { delay, mockUser, nextBabyId } from '../mocks/data';

/**
 * Get current user profile.
 */
export const getProfile = async (): Promise<User> => {
  if (USE_MOCK_API) {
    await delay(400);
    return { ...mockUser, babyDetails: [...mockUser.babyDetails] };
  }
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * Update user profile fields.
 */
export const updateProfile = async (data: Partial<Pick<User, 'name' | 'email'>>): Promise<User> => {
  if (USE_MOCK_API) {
    await delay(500);
    if (data.name) mockUser.name = data.name;
    if (data.email) mockUser.email = data.email;
    return { ...mockUser, babyDetails: [...mockUser.babyDetails] };
  }
  const response = await apiClient.put('/profile', data);
  return response.data;
};

/**
 * Add a baby detail to user profile.
 */
export const addBabyDetail = async (baby: Omit<BabyDetail, 'id'>): Promise<BabyDetail> => {
  if (USE_MOCK_API) {
    await delay(500);
    const newBaby: BabyDetail = { id: nextBabyId(), ...baby };
    mockUser.babyDetails.push(newBaby);
    return newBaby;
  }
  const response = await apiClient.post('/profile/babies', baby);
  return response.data;
};

/**
 * Update an existing baby detail.
 */
export const updateBabyDetail = async (
  babyId: string,
  baby: Partial<BabyDetail>,
): Promise<BabyDetail> => {
  if (USE_MOCK_API) {
    await delay(500);
    const idx = mockUser.babyDetails.findIndex((b) => b.id === babyId);
    if (idx < 0) throw new Error('Baby detail not found');
    mockUser.babyDetails[idx] = { ...mockUser.babyDetails[idx], ...baby };
    return { ...mockUser.babyDetails[idx] };
  }
  const response = await apiClient.put(`/profile/babies/${babyId}`, baby);
  return response.data;
};

/**
 * Delete a baby detail.
 */
export const deleteBabyDetail = async (babyId: string): Promise<void> => {
  if (USE_MOCK_API) {
    await delay(400);
    const idx = mockUser.babyDetails.findIndex((b) => b.id === babyId);
    if (idx >= 0) mockUser.babyDetails.splice(idx, 1);
    return;
  }
  await apiClient.delete(`/profile/babies/${babyId}`);
};
