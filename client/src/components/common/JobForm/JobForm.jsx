import { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import "./JobForm.css";

const defaultInitialValues = {
  title: "",
  company: "",
  location: "",
};
function JobForm({
  initialValues = defaultInitialValues,
  onSubmit,
  submitButtonText = "Save",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

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

    if (!isFormValid || isSubmitting) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <Input
        label="Job Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Frontend Developer"
        disabled={isSubmitting}
      />

      <Input
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Amazon"
      />

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Arlington, VA"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={!isFormValid || isSubmitting}
        isLoading={isSubmitting}
        loadingText="Saving..."
      >
        {submitButtonText}
      </Button>
    </form>
  );
}

export default JobForm;
