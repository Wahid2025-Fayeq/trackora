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

    if (!isFormValid) {
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
      />

      <Input
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Amazon"
      />

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Arlington, VA"
      />

      <Button type="submit" variant="primary" disabled={!isFormValid}>
        {submitButtonText}
      </Button>
    </form>
  );
}

export default JobForm;
