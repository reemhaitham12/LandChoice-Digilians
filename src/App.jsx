import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyCode from "./Pages/VerifyCode";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyResetCode from "./Pages/VerifyResetCode";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;