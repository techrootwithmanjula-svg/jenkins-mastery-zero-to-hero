import apiClient from './client';
import { USE_MOCK_API } from '../mocks';
import { delay, mockUser } from '../mocks/data';

export interface SendOtpRequest {
  mobile: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    babyDetails: {
      id: string;
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      notes?: string;
    }[];
  };
}

/**
 * Send OTP to mobile number.
 */
export const sendOtp = async (data: SendOtpRequest): Promise<{ success: boolean }> => {
  if (USE_MOCK_API) {
    await delay(500);
    return { success: true };
  }
  const response = await apiClient.post('/auth/send-otp', data);
  return response.data;
};

/**
 * Verify OTP and get auth token.
 * In mock mode, any 6-digit OTP works.
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    await delay(800);
    if (data.otp.length !== 6) {
      throw new Error('Invalid OTP. Please enter a 6-digit code.');
    }
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: { ...mockUser, mobile: data.mobile },
    };
  }
  const response = await apiClient.post('/auth/verify-otp', data);
  return response.data;
};

/**
 * Refresh session token.
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    await delay(300);
    return { token: 'mock-refreshed-token-' + Date.now(), user: mockUser };
  }
  const response = await apiClient.post('/auth/refresh');
  return response.data;
};
