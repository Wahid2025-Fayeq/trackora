import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authApi";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setResetUrl("");
    setError("");
    setIsSubmitting(true);

    try {
      const data = await forgotPassword(email);

      setMessage(data.message);

      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="forgot-password">
      <section className="forgot-password__card">
        <h1 className="forgot-password__title">Forgot password?</h1>

        <p className="forgot-password__description">
          Enter your email address to receive a password reset link.
        </p>

        <form className="forgot-password__form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          {error && <p className="forgot-password__error">{error}</p>}

          {message && <p className="forgot-password__success">{message}</p>}

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!email.trim() || isSubmitting}
          >
            Send reset link
          </Button>

          {resetUrl && (
            <a className="forgot-password__reset-link" href={resetUrl}>
              Open password reset page
            </a>
          )}
        </form>

        <Link className="forgot-password__back-link" to="/login">
          Back to login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
