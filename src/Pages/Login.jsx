import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import * as Yup from "yup";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    try {
      await loginSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await login(formData.email, formData.password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020618] flex items-start justify-center px-4 pt-28 pb-8 md:items-center md:pt-12">
      <div className="w-full max-w-md">
        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_0_40px_rgba(59,130,246,0.1)] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaLock className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to your LandChoice account
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group select-none">

                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
        ${rememberMe
                        ? "bg-blue-500/15 border-[#020618] shadow-[0_0_12px_rgba(59,130,246,0.35)]"
                        : "bg-[#020618] border-gray-600 group-hover:border-gray-500"
                      }`}
                  >
                    <svg
                      className={`w-3 h-3 text-blue-300 transition-all duration-200
          ${rememberMe
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-50"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;