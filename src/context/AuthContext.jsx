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

const API_BASE_URL = "https://back-end-pro.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error, fallback = "Something went wrong") => {
  const err =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    fallback;

  if (typeof err === "string") {
    return err;
  }

  if (typeof err === "object" && err !== null) {
    return err.message || err.code || JSON.stringify(err);
  }

  return String(err);
};

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

      localStorage.setItem("landchoice_user", JSON.stringify(userToStore));
      localStorage.setItem("landchoice_token", token);

      return { success: true, data: userToStore };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Login failed. Please try again."),
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      return {
        success: true,
        message: response.data?.message || "Registered successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Registration failed. Please try again."),
      };
    }
  };

  const verifyCode = async (email, code) => {
    try {
      const response = await api.post("/verify-code", { email, code });

      return {
        success: true,
        message: response.data?.message || "Email verified!",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Verification failed. Please try again."),
      };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await api.post("/resend-verification-code", { email });

      return {
        success: true,
        message: response.data?.message || "Code resent!",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Failed to resend code. Please try again."),
      };
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
      return {
        success: false,
        error: getErrorMessage(error, "Failed to send reset code. Please try again."),
      };
    }
  };

  const verifyResetCode = async (email, resetCode) => {
    try {
      const response = await api.post("/verify-reset-code", {
        email,
        reset_code: resetCode,
      });

      return {
        success: true,
        message: response.data?.message || "Code verified!",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Invalid or expired code."),
      };
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
      return {
        success: false,
        error: getErrorMessage(error, "Failed to reset password. Please try again."),
      };
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