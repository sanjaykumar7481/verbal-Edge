// UserContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';
import api from "../services/api";
import { getStoredUser, setStoredUser, setToken, getToken, clearAuth } from "../services/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/api/getuser");
      setUser(response.data.user);
      setStoredUser(response.data.user);
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (!response.data || !response.data.loggedin) {
      return { ok: false, message: response.data?.error || "Login failed" };
    }
    setToken(response.data.token);
    await loadUser();
    return { ok: true };
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const setUserPersisted = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      setStoredUser(nextUser);
    } else {
      clearAuth();
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser: setUserPersisted, login, register, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
