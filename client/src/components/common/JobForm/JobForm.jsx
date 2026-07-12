import { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Select from "../../ui/Select/Select";
import Textarea from "../../ui/Textarea/Textarea";
import { statusOptions } from "../../../utils/selectOptions";
import "./JobForm.css";

const defaultInitialValues = {
  title: "",
  company: "",
  location: "",
  status: "",
  appliedDate: new Date().toISOString().split("T")[0],
  notes: "",
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
    formData.location.trim() &&
    formData.status &&
    formData.appliedDate;

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
      <Input
        label="Application Date"
        type="date"
        name="appliedDate"
        value={formData.appliedDate}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={statusOptions}
        disabled={isSubmitting}
      />
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder={`Recruiter:
Salary:
Interview Date:
Follow-up Date:
Job URL:
Notes:`}
        disabled={isSubmitting}
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
