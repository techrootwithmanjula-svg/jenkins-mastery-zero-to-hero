import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import {
  sendOtpService,
  resendOtpService,
  verifyOtpService,
} from "../../services/authService";

import { tokenManager } from "../../utils/tokenManager";
import { userManager } from "../../utils/userManager";
import { UserRole } from "../../types/entities";

import { showAlert } from "../../services/alertService";

export default function SignInForm() {
  const navigate =
    useNavigate();

  const [mobile, setMobile] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /**
   * Send OTP
   */
  const handleSendOtp =
    async () => {
      try {
        setLoading(true);

        const response =
          await sendOtpService(
            mobile
          );

        console.log(
          "Send OTP:",
          response
        );

        if (
          response.status ===
          "success"
        ) {
          setOtpSent(true);

          showAlert(
            "success",
            response.message ||
              "OTP sent successfully",
            "Success"
          );
        } else {
          showAlert(
            "error",
            response.message ||
              "Failed to send OTP",
            "Error"
          );
        }
      } catch (error: any) {
        console.error(error);

        showAlert(
          "error",
          error?.response?.data
            ?.message ||
            "Something went wrong",
          "Error"
        );
      } finally {
        setLoading(false);
      }
    };

  /**
   * Resend OTP
   */
  const handleResendOtp =
    async () => {
      try {
        setLoading(true);

        const response =
          await resendOtpService(
            mobile
          );

        console.log(
          "Resend OTP:",
          response
        );

        if (
          response.status ===
          "success"
        ) {
          showAlert(
            "success",
            response.message ||
              "OTP resent successfully",
            "Success"
          );
        } else {
          showAlert(
            "error",
            response.message ||
              "Failed to resend OTP",
            "Error"
          );
        }
      } catch (error: any) {
        console.error(error);

        showAlert(
          "error",
          error?.response?.data
            ?.message ||
            "Something went wrong",
          "Error"
        );
      } finally {
        setLoading(false);
      }
    };

  /**
   * Back to mobile screen
   */
  const handleBack =
    () => {
      setOtpSent(false);
      setOtp("");
    };

  /**
   * Verify OTP
   */
  const handleVerifyOtp =
    async () => {
      try {
        setLoading(true);

        const response =
          await verifyOtpService(
            mobile,
            otp
          );

        console.log(
          "Verify OTP:",
          response
        );

        if (
          response.status ===
          "success"
        ) {
          showAlert(
            "success",
            response.message ||
              "Login successful",
            "Success"
          );

          if (
            response.data
              ?.token
          ) {
            const user = response.data.user;

            if (!user || user.role !== UserRole.ADMIN) {
              showAlert(
                "error",
                "Only admin accounts can access this portal.",
                "Access Denied"
              );
              return;
            }

            /**
             * Save JWT token
             */
            tokenManager.setToken(
              response.data
                .token
            );

            /**
             * Save user
             */
            userManager.setUser(user);

            /**
             * Navigate dashboard
             */
            navigate("/");
          }
        } else {
          showAlert(
            "error",
            response.message ||
              "Invalid OTP",
            "Error"
          );
        }
      } catch (error: any) {
        console.error(error);

        showAlert(
          "error",
          error?.response?.data
            ?.message ||
            "Verification failed",
          "Error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form>
          <div className="space-y-6">

            {/* MOBILE SCREEN */}
            {!otpSent && (
              <>
                <div className="space-y-2">
                  <Label>
                    Mobile Number
                  </Label>

                  <Input
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(
                      e
                    ) =>
                      setMobile(
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  disabled={
                    !mobile ||
                    loading
                  }
                  onClick={
                    handleSendOtp
                  }
                >
                  {loading
                    ? "Sending..."
                    : "Send OTP"}
                </Button>
              </>
            )}

            {/* OTP SCREEN */}
            {otpSent && (
              <>
                <div>
                  <Label>
                    Enter OTP
                  </Label>

                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(
                      e
                    ) =>
                      setOtp(
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  disabled={
                    !otp ||
                    loading
                  }
                  onClick={
                    handleVerifyOtp
                  }
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={
                      loading
                    }
                    onClick={
                      handleBack
                    }
                  >
                    Back
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={
                      loading
                    }
                    onClick={
                      handleResendOtp
                    }
                  >
                    {loading
                      ? "Sending..."
                      : "Resend OTP"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}