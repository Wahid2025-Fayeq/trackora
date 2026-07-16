import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input/Input";
import useAuth from "../../hooks/useAuth";
import { register } from "../../services/authApi";

import "./Register.css";

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialCharacter: /[^A-Za-z0-9]/,
};

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedEmail = formData.email.trim().toLowerCase();

  const passwordChecks = {
    minLength: formData.password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasUppercase: PASSWORD_REQUIREMENTS.hasUppercase.test(formData.password),
    hasLowercase: PASSWORD_REQUIREMENTS.hasLowercase.test(formData.password),
    hasNumber: PASSWORD_REQUIREMENTS.hasNumber.test(formData.password),
    hasSpecialCharacter: PASSWORD_REQUIREMENTS.hasSpecialCharacter.test(
      formData.password,
    ),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  const isFormValid =
    formData.name.trim() !== "" && isEmailValid && isPasswordValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: normalizedEmail,
        password: formData.password,
      });

      await login({
        email: normalizedEmail,
        password: formData.password,
      });

      navigate("/");
    } catch (requestError) {
      setError(requestError.message || "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register">
      <Container>
        <form className="register__form" onSubmit={handleSubmit}>
          <h1 className="register__title">Create Account</h1>

          <Input
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="email"
          />

          {formData.email.length > 0 && !isEmailValid && (
            <p className="register__error">
              Please enter a valid email address.
            </p>
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          {formData.password.length > 0 && (
            <div className="register__password-feedback" aria-live="polite">
              <ul
                className="register__password-requirements"
                aria-label="Password requirements"
              >
                <li
                  className={`register__requirement ${
                    passwordChecks.minLength
                      ? "register__requirement_valid"
                      : ""
                  }`}
                >
                  {passwordChecks.minLength ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  At least 8 characters
                </li>

                <li
                  className={`register__requirement ${
                    passwordChecks.hasUppercase
                      ? "register__requirement_valid"
                      : ""
                  }`}
                >
                  {passwordChecks.hasUppercase ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  One uppercase letter
                </li>

                <li
                  className={`register__requirement ${
                    passwordChecks.hasLowercase
                      ? "register__requirement_valid"
                      : ""
                  }`}
                >
                  {passwordChecks.hasLowercase ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  One lowercase letter
                </li>

                <li
                  className={`register__requirement ${
                    passwordChecks.hasNumber
                      ? "register__requirement_valid"
                      : ""
                  }`}
                >
                  {passwordChecks.hasNumber ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  One number
                </li>

                <li
                  className={`register__requirement ${
                    passwordChecks.hasSpecialCharacter
                      ? "register__requirement_valid"
                      : ""
                  }`}
                >
                  {passwordChecks.hasSpecialCharacter ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  One special character
                </li>
              </ul>

              {isPasswordValid && (
                <div className="register__password-strong">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>Strong password</span>
                </div>
              )}
            </div>
          )}

          {error && <p className="register__error">{error}</p>}

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <p className="register__footer">
            Already have an account?{" "}
            <Link to="/login" className="register__link">
              Sign In
            </Link>
          </p>
        </form>
      </Container>
    </main>
  );
}

export default Register;
