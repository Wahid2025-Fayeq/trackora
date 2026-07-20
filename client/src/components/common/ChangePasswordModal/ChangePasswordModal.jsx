import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import CloseButton from "../../ui/CloseButton/CloseButton";
import { changePassword } from "../../../services/authApi";

import "./ChangePasswordModal.css";

const initialFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    setErrors((previousErrors) => {
      const nextErrors = {
        ...previousErrors,
        [name]: "",
        form: "",
      };

      if (name === "newPassword") {
        if (
          value &&
          updatedFormData.confirmPassword &&
          value !== updatedFormData.confirmPassword
        ) {
          nextErrors.confirmPassword = "Passwords do not match";
        } else if (
          value &&
          updatedFormData.confirmPassword &&
          value === updatedFormData.confirmPassword
        ) {
          nextErrors.confirmPassword = "";
        }

        if (value && !passwordPattern.test(value)) {
          nextErrors.newPassword =
            "Password must contain at least 8 characters, uppercase, lowercase, number, and special character";
        } else if (value && value === updatedFormData.currentPassword) {
          nextErrors.newPassword =
            "New password must be different from your current password";
        } else {
          nextErrors.newPassword = "";
        }
      }

      if (name === "confirmPassword") {
        if (value && value !== updatedFormData.newPassword) {
          nextErrors.confirmPassword = "Passwords do not match";
        } else {
          nextErrors.confirmPassword = "";
        }
      }

      if (name === "currentPassword") {
        if (
          updatedFormData.newPassword &&
          value === updatedFormData.newPassword
        ) {
          nextErrors.newPassword =
            "New password must be different from your current password";
        } else if (
          updatedFormData.newPassword &&
          passwordPattern.test(updatedFormData.newPassword)
        ) {
          nextErrors.newPassword = "";
        }
      }

      return nextErrors;
    });
  };

  const isFormValid =
    formData.currentPassword.trim() !== "" &&
    passwordPattern.test(formData.newPassword) &&
    formData.confirmPassword.trim() !== "" &&
    formData.newPassword === formData.confirmPassword &&
    formData.newPassword !== formData.currentPassword;

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (!passwordPattern.test(formData.newPassword)) {
      nextErrors.newPassword =
        "Password must contain at least 8 characters, uppercase, lowercase, number, and special character";
    } else if (formData.newPassword === formData.currentPassword) {
      nextErrors.newPassword =
        "New password must be different from your current password";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("You are not signed in");
      }

      await changePassword(token, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData(initialFormData);
      setErrors({});
      toast.success("Password changed successfully");
      onClose();
    } catch (error) {
      setErrors({
        form: error.message || "Unable to change password",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="change-password-modal" onMouseDown={handleOverlayClick}>
      <div
        className="change-password-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        <div className="change-password-modal__header">
          <div>
            <h2
              className="change-password-modal__title"
              id="change-password-title"
            >
              Change Password
            </h2>

            <p className="change-password-modal__description">
              Enter your current password and choose a new one.
            </p>
          </div>

          <CloseButton
            onClick={onClose}
            disabled={isSubmitting}
            ariaLabel="Close change password dialog"
          />
        </div>

        <form className="change-password-modal__form" onSubmit={handleSubmit}>
          {errors.form && (
            <p className="change-password-modal__error" role="alert">
              {errors.form}
            </p>
          )}

          <Input
            label="Current password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <Input
            label="New password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <div className="change-password-modal__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
