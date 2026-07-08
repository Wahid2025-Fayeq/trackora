import { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import "./AddJobModal.css";

function AddJobModal({ isOpen, onClose, onAddJob }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.title.trim() &&
    formData.company.trim() &&
    formData.location.trim();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }
    onAddJob({
      ...formData,
      status: "Applied",
      appliedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    setFormData({
      title: "",
      company: "",
      location: "",
    });

    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="add-job-modal" onClick={onClose}>
      <div
        className="add-job-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="add-job-modal__close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="add-job-modal__title">Add New Job</h2>

        <form className="add-job-modal__form" onSubmit={handleSubmit}>
          <Input
            label="Job Title"
            name="title"
            placeholder="Frontend Developer"
            value={formData.title}
            onChange={handleChange}
          />

          <Input
            label="Company"
            name="company"
            placeholder="Google"
            value={formData.company}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            placeholder="Arlington, VA"
            value={formData.location}
            onChange={handleChange}
          />

          <Button type="submit" disabled={!isFormValid}>
            Save Job
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;
