import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import { FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const verifySchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "Code must be exactly 6 digits")
    .matches(/^[0-9]+$/, "Code must contain only numbers")
    .required("Verification code is required"),
});

const VerifyCode = () => {
  const navigate = useNavigate();
  const { verifyCode, resendVerificationCode } = useAuth();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("verify_email");
    if (!storedEmail) {
      navigate("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (errors.code) setErrors({});
    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");
    setErrors({});

    try {
      await verifySchema.validate({ code }, { abortEarly: false });
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await verifyCode(email, code);
    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess(result.message);
      localStorage.removeItem("verify_email");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setApiError(result.error);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setApiError("");
    setApiSuccess("");
    
    const result = await resendVerificationCode(email);
    setIsResending(false);

    if (result.success) {
      setApiSuccess(result.message);
      setCountdown(60);
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
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Email
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the 6-digit code sent to your email
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

          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <MdEmail className="text-blue-400 text-xl flex-shrink-0" />
            <p className="text-blue-300 text-sm break-all">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Verification Code
              </label>
              <div className="relative">
                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  value={code}
                  onChange={handleChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-center text-lg tracking-[0.5em] font-mono"
                />
              </div>
              {errors.code && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.code}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <FaSyncAlt className={isResending ? "animate-spin" : ""} size={14} />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Wrong email?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;