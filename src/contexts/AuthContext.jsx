import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Token ${token}`;

    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });

    const { token, user } = res.data;

    localStorage.setItem("access_token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;

    setUser(user);
    return res.data;
  };

  const signup = async (email, full_name, password, password2) => {
    const res = await api.post("/auth/signup/", {
      email,
      full_name,
      password,
      password2,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
