import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // Skip token for password reset endpoints (user is not authenticated)
    const passwordResetEndpoints = [
      '/v1/forget-password',
      '/v1/verify-otp',
      '/v1/reset-password'
    ];
    
    const isPasswordResetRequest = passwordResetEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (isPasswordResetRequest) {
      // Disable credentials for password reset to avoid CORS issues
      config.withCredentials = false;
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
