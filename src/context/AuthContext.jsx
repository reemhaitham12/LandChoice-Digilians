import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Use /api prefix - Vite will proxy this to the backend
const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("landchoice_user");
    const storedToken = localStorage.getItem("landchoice_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("landchoice_user");
        localStorage.removeItem("landchoice_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user: userData } = response.data;
      
      const userToStore = {
        ...userData,
        token,
      };
      
      setUser(userToStore);
      
      if (rememberMe) {
        localStorage.setItem("landchoice_user", JSON.stringify(userToStore));
        localStorage.setItem("landchoice_token", token);
      }
      
      return { success: true, data: userToStore };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });
      return { success: true, message: response.data?.message || "Registered successfully!" };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const verifyCode = async (email, code) => {
    try {
      const response = await api.post("/verify-code", { email, code });
      return { success: true, message: response.data?.message || "Email verified!" };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Verification failed. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await api.post("/resend-verification-code", { email });
      return { success: true, message: response.data?.message || "Code resent!" };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to resend code. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("landchoice_user");
    localStorage.removeItem("landchoice_token");
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/forgot-password", { email });
      return {
        success: true,
        message: response.data?.message || "Reset code sent to email.",
      };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset code. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const verifyResetCode = async (email, resetCode) => {
    try {
      const response = await api.post("/verify-reset-code", { email, reset_code: resetCode });
      return { success: true, message: response.data?.message || "Code verified!" };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Invalid or expired code.";
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const response = await api.post("/reset-password", {
        email,
        new_password: newPassword,
      });
      return {
        success: true,
        message: response.data?.message || "Password reset successfully!",
      };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyCode,
    resendVerificationCode,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;