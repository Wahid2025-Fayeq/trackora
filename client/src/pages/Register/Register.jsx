import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import { register } from "../../services/authApi";
import useAuth from "../../hooks/useAuth";
import "./Register.css";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await register(formData);

      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to create account");
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
