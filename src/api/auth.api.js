import api from "./axios";

export const registerApi = (data) => {
  return api.post("/v1/register", data);
};

export const loginApi = (data) => {
  return api.post("/v1/login", data);
};
