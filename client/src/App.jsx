import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
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
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "14px 18px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
