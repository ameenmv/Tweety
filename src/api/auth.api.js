import api from "./axios";

export const registerApi = (data) => {
  return api.post("/v1/register", data);
};

export const loginApi = (data) => {
  return api.post("/v1/login", data);
};

// Password Reset APIs
export const forgotPasswordApi = (data) => {
  return api.post("/v1/forget-password", data);
};

export const verifyOtpApi = (data) => {
  return api.post("/v1/verify-otp", data);
};

export const resetPasswordApi = (data) => {
  return api.post("/v1/reset-password", data);
};
