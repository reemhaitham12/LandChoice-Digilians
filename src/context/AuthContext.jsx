
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("landchoice_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const getErrorMessage = (
  error,
  fallback = "Something went wrong"
) => {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("landchoice_user");
    const storedToken = localStorage.getItem("landchoice_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("landchoice_user");
        localStorage.removeItem("landchoice_token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      const userToStore = {
        ...userData,
        token,
      };

      setUser(userToStore);

      localStorage.setItem(
        "landchoice_user",
        JSON.stringify(userToStore)
      );

      localStorage.setItem(
        "landchoice_token",
        token
      );

      return {
        success: true,
        data: userToStore,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Login failed"
        ),
      };
    }
  };

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      const response = await api.post(
        "/register",
        {
          name,
          email,
          password,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Registration failed"
        ),
      };
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("landchoice_user");
    localStorage.removeItem("landchoice_token");
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

