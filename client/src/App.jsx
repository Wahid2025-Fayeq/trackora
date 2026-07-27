import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute/PublicRoute";
import Loader from "./components/ui/Loader/Loader";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const CoverLetter = lazy(() => import("./pages/CoverLetter/CoverLetter"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function App() {
  return (
    <>
      <Navbar />

      <main className="app__main">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cover-letter"
              element={
                <ProtectedRoute>
                  <CoverLetter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            padding: "14px 18px",
            boxShadow: "var(--shadow-card)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success-text, #16a34a)",
              secondary: "var(--color-surface)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-danger)",
              secondary: "var(--color-surface)",
            },
          },
        }}
      />
    </>
  );
}

export default App;
