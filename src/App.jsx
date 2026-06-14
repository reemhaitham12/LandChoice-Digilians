import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import  Home  from './Pages/Home';
import  Explore  from './Pages/Explore';
import  SalaryFit  from './Pages/SalaryFit';
import  ComparyCountry  from './Pages/CompareCountry';
import  Checklist  from './Pages/CheckList';
import  News  from './Pages/News';
import  CountryDetails  from './Pages/CountryDetails';
import  NotFound  from './Pages/NotFound';
import AuthProvider, { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyCode from "./Pages/VerifyCode";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyResetCode from "./Pages/VerifyResetCode";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Community from "./Pages/Community";

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const routers = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: 'explore', element: <Explore /> },
      { path: 'salary-fit', element: <SalaryFit /> },
      { path: 'compare', element: <ComparyCountry /> },
      { path: 'checklist', element: <Checklist /> },
      { path: 'news', element: <News /> },
      { path: 'country/:id', element: <CountryDetails /> },
      { path: 'community', element: <Community /> },

      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'verify-code', element: <VerifyCode /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-reset-code', element: <VerifyResetCode /> },
      { path: 'reset-password', element: <ResetPassword /> },

      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routers} />
    </AuthProvider>
  );
}

export default App;