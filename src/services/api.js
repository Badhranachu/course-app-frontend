import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ALWAYS attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // 🔥 FIX HERE
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
