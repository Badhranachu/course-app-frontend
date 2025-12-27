import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach DRF token (initial load)
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Token ${token}`;
}

// 🔁 Always attach token before request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
