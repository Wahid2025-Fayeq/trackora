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
  interview: {
    date: "",
    type: "",
    location: "",
    meetingLink: "",
    notes: "",
  },
};

function JobForm({
  initialValues = defaultInitialValues,
  onSubmit,
  submitButtonText = "Save",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(defaultInitialValues);

  useEffect(() => {
    setFormData({
      ...defaultInitialValues,
      ...initialValues,
      interview: {
        ...defaultInitialValues.interview,
        ...initialValues.interview,
        date: initialValues.interview?.date
          ? new Date(initialValues.interview.date).toISOString().slice(0, 16)
          : "",
      },
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInterviewChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      interview: {
        ...prevData.interview,
        [name]: value,
      },
    }));
  };

  const isInterviewStatus = formData.status === "Interview";

  const isFormValid =
    formData.title.trim() &&
    formData.company.trim() &&
    formData.location.trim() &&
    formData.status &&
    formData.appliedDate &&
    (!isInterviewStatus ||
      (formData.interview.date && formData.interview.type));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    onSubmit({
      ...formData,
      interview: isInterviewStatus
        ? {
            ...formData.interview,
            date: formData.interview.date
              ? new Date(formData.interview.date).toISOString()
              : null,
          }
        : {
            date: null,
            type: "",
            location: "",
            meetingLink: "",
            notes: "",
          },
    });
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

      {isInterviewStatus && (
        <section className="job-form__interview">
          <h3 className="job-form__section-title">Interview Details</h3>

          <Input
            label="Interview Date and Time"
            type="datetime-local"
            name="date"
            value={formData.interview.date}
            onChange={handleInterviewChange}
            disabled={isSubmitting}
          />

          <Select
            label="Interview Type"
            name="type"
            value={formData.interview.type}
            onChange={handleInterviewChange}
            options={[
              { value: "", label: "Select interview type" },
              { value: "Phone", label: "Phone" },
              { value: "Video", label: "Video" },
              { value: "On-site", label: "On-site" },
            ]}
            disabled={isSubmitting}
          />

          <Input
            label="Interview Location"
            name="location"
            value={formData.interview.location}
            onChange={handleInterviewChange}
            placeholder="Arlington, VA"
            disabled={isSubmitting}
          />

          <Input
            label="Meeting Link"
            type="url"
            name="meetingLink"
            value={formData.interview.meetingLink}
            onChange={handleInterviewChange}
            placeholder="https://meet.google.com/..."
            disabled={isSubmitting}
          />

          <Textarea
            label="Interview Notes"
            name="notes"
            value={formData.interview.notes}
            onChange={handleInterviewChange}
            placeholder="Interviewers, preparation topics, questions..."
            disabled={isSubmitting}
          />
        </section>
      )}

      <Textarea
        label="General Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder={`Recruiter:
Salary:
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
