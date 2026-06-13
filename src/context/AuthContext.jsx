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

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("landchoice_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("landchoice_user");
    const storedToken = localStorage.getItem("landchoice_token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
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
      
      if (!token) {
        return { success: false, error: "No token received from server" };
      }
      
      const userToStore = { 
        ...userData, 
        _id: userData._id || userData.id,
        id: userData.id || userData._id,
        token 
      };
      
      setUser(userToStore);
      
      localStorage.setItem("landchoice_user", JSON.stringify(userToStore));
      localStorage.setItem("landchoice_token", token);
      
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
      const response = await api.post("/register", { name, email, password });
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
      return { success: true, message: response.data?.message || "Reset code sent to email." };
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
      const response = await api.post("/reset-password", { email, new_password: newPassword });
      return { success: true, message: response.data?.message || "Password reset successfully!" };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await api.get("/posts");
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch posts.";
      return { success: false, error: errorMessage };
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const response = await api.get(`/posts/user-posts?userId=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user posts.";
      return { success: false, error: errorMessage };
    }
  };

  const createPost = async (title, content) => {
    try {
      const response = await api.post("/posts/add-post", { title, content });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to create post.";
      return { success: false, error: errorMessage };
    }
  };

  const updatePost = async (postId, title, content) => {
    try {
      const response = await api.put(`/posts/Update-post?id=${postId}`, { title, content });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to update post.";
      return { success: false, error: errorMessage };
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`/posts/delete-post?id=${postId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to delete post.";
      return { success: false, error: errorMessage };
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await api.post(`/posts/add-like?id=${postId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to like post.";
      return { success: false, error: errorMessage };
    }
  };

  const unlikePost = async (postId) => {
    try {
      const response = await api.delete(`/posts/delete-like?id=${postId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to unlike post.";
      return { success: false, error: errorMessage };
    }
  };

  const addComment = async (postId, text) => {
    try {
      const response = await api.post(`/posts/add-comment?id=${postId}`, { text });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to add comment.";
      return { success: false, error: errorMessage };
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await api.delete(`/posts/delete-comment?id=${postId}&commentId=${commentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message ||
        "Failed to delete comment.";
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    verifyCode,
    resendVerificationCode,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    fetchAllPosts,
    fetchUserPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
  };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export { AuthProvider };
export default AuthProvider;