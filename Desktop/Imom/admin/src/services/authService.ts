import api from "./api";
import { AUTH_URLS, STATS_URLS } from "./urls";
import type {
  SendOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  StatsResponse,
} from "../types/entities";

export const sendOtpService = async (mobile: string): Promise<SendOtpResponse> => {
  const response = await api.post(AUTH_URLS.SEND_OTP, { mobile });
  return response.data;
};

export const verifyOtpService = async (
  mobile: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  const response = await api.post(AUTH_URLS.VERIFY_OTP, { mobile, otp });
  return response.data;
};

export const resendOtpService = async (mobile: string): Promise<ResendOtpResponse> => {
  const response = await api.post(AUTH_URLS.RESEND_OTP, { mobile });
  return response.data;
};

/** Dashboard statistics — distinct from auth, grouped here for convenience */
export const getStatsService = async (): Promise<{ status: string; message: string; data: StatsResponse }> => {
  const response = await api.get(STATS_URLS.GET_DASHBOARD_STATS);
  return response.data;
};
