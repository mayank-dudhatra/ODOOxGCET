import api from "./api";

export const signup = (credentials) => api.post("/auth/signup", credentials);
export const login = (credentials) => api.post("/auth/login", credentials);
