import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute/PublicRoute";

import Landing from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <main className="app__main">
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
