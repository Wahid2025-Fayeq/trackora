import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import useAuth from "../../hooks/useAuth";
import { resetPassword } from "../../services/authApi";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await resetPassword(token, password);

      logout();

      setSuccessMessage(
        response.message ||
          "Password reset successfully. Redirecting to login...",
      );

      toast.success(response.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message: "Your password was reset. Please sign in again.",
          },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          "This password reset link is invalid, expired, or already used.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="reset-password">
      <section className="reset-password__card">
        {successMessage ? (
          <div className="reset-password__success">
            <h1 className="reset-password__title">Password Reset Successful</h1>

            <p className="reset-password__subtitle">{successMessage}</p>
          </div>
        ) : (
          <>
            <h1 className="reset-password__title">Reset Password</h1>

            <p className="reset-password__subtitle">
              Enter and confirm your new password.
            </p>

            <form
              className="reset-password__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Input
                label="New Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
              />

              {error && (
                <p className="reset-password__error" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Reset Password
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;
