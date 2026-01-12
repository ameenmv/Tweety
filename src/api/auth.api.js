import api from "./axios";

export const registerApi = (data) => {
  return api.post("/v1/register", data);
};
