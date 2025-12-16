import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach DB token (persistent)
const token = localStorage.getItem("access_token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Token ${token}`;
}

export default api;
