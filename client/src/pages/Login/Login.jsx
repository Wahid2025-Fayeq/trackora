import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const isFormValid =
    formData.identifier.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        identifier: formData.identifier.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login">
      <Container>
        <form className="login__form" onSubmit={handleSubmit} autoComplete="on">
          <h1 className="login__title">Welcome Back</h1>

          <Input
            label="Email or Username"
            type="text"
            name="identifier"
            placeholder="Enter your email or username"
            value={formData.identifier}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <div className="login__forgot-password">
            <Link to="/forgot-password" className="login__link">
              Forgot password?
            </Link>
          </div>

          {error && <p className="login__error">{error}</p>}

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Signing in..."
          >
            Sign In
          </Button>

          <p className="login__footer">
            Don't have an account?{" "}
            <Link to="/register" className="login__link">
              Create one
            </Link>
          </p>
        </form>
      </Container>
    </main>
  );
}

export default Login;
