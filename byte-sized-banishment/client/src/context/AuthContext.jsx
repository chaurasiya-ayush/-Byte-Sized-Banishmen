import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
          return data;
      };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
