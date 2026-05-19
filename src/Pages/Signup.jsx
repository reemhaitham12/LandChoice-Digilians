import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .matches(/@gmail\.com$/, "Email must end with @gmail.com")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");
    setErrors({});

    try {
      await signupSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      formData.fullName,
      formData.email,
      formData.password
    );
    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess(result.message);
      localStorage.setItem("verify_email", formData.email);
      setTimeout(() => {
        navigate("/verify-code");
      }, 1500);
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-[0_0_40px_rgba(59,130,246,0.1)] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaUser className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Join LandChoice today
            </p>
          </div>

          {apiSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
              {apiSuccess}
            </div>
          )}

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.fullName}</p>
              )}
            </div>

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
                  placeholder="Create a password (min 8 chars)"
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

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-red-400 text-xs">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;