import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import { FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const verifyResetSchema = Yup.object().shape({
  resetCode: Yup.string()
    .length(6, "Code must be exactly 6 digits")
    .matches(/^[0-9]+$/, "Code must contain only numbers")
    .required("Reset code is required"),
});

const VerifyResetCode = () => {
  const navigate = useNavigate();
  const { verifyResetCode } = useAuth();
  const [resetCode, setResetCode] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");
    if (!storedEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setResetCode(value);
    if (errors.resetCode) setErrors({});
    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");
    setErrors({});

    try {
      await verifyResetSchema.validate({ resetCode }, { abortEarly: false });
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await verifyResetCode(email, resetCode);
    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess(result.message);
      setTimeout(() => {
        navigate("/reset-password");
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
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Reset Code
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
                Reset Code
              </label>
              <div className="relative">
                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  value={resetCode}
                  onChange={handleChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-center text-lg tracking-[0.5em] font-mono"
                />
              </div>
              {errors.resetCode && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.resetCode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCode;