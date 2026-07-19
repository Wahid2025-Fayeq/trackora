import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Select from "../../ui/Select/Select";
import Textarea from "../../ui/Textarea/Textarea";
import { statusOptions } from "../../../utils/selectOptions";

import "./JobForm.css";

const formatDateForState = (date) => {
  if (!date) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const defaultInitialValues = {
  title: "",
  company: "",
  location: "",
  status: "",
  appliedDate: formatDateForState(new Date()),
  notes: "",
  interview: {
    date: "",
    time: "",
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
    const interviewDate = initialValues.interview?.date
      ? new Date(initialValues.interview.date)
      : null;

    setFormData({
      ...defaultInitialValues,
      ...initialValues,
      interview: {
        ...defaultInitialValues.interview,
        ...initialValues.interview,
        date: interviewDate ? formatDateForState(interviewDate) : "",
        time: interviewDate ? interviewDate.toTimeString().slice(0, 5) : "",
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

  const handleApplicationDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      appliedDate: formatDateForState(date),
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

  const handleInterviewDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      interview: {
        ...prevData.interview,
        date: formatDateForState(date),
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
      (formData.interview.date &&
        formData.interview.time &&
        formData.interview.type));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    const interviewDateTime =
      isInterviewStatus && formData.interview.date && formData.interview.time
        ? new Date(
            `${formData.interview.date}T${formData.interview.time}`,
          ).toISOString()
        : null;

    const interviewData = {
      date: interviewDateTime,
      type: formData.interview.type,
      location: formData.interview.location,
      meetingLink: formData.interview.meetingLink,
      notes: formData.interview.notes,
    };

    onSubmit({
      ...formData,
      interview: isInterviewStatus
        ? interviewData
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
        placeholder="Amazon"
        disabled={isSubmitting}
      />

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Arlington, VA"
        disabled={isSubmitting}
      />

      <div className="job-form__datepicker">
        <label
          className="job-form__datepicker-label"
          htmlFor="application-date"
        >
          Application Date
        </label>

        <div className="job-form__datepicker-input">
          <DatePicker
            id="application-date"
            selected={
              formData.appliedDate
                ? new Date(`${formData.appliedDate}T00:00:00`)
                : null
            }
            onChange={handleApplicationDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select application date"
            disabled={isSubmitting}
            popperPlacement="bottom-start"
            popperClassName="job-form__datepicker-popper"
            calendarClassName="job-form__calendar"
            wrapperClassName="job-form__datepicker-wrapper"
            showPopperArrow={false}
          />

          <Calendar
            className="job-form__datepicker-icon"
            size={16}
            aria-hidden="true"
          />
        </div>
      </div>

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

          <div className="job-form__interview-datetime">
            <div className="job-form__datepicker">
              <label
                className="job-form__datepicker-label"
                htmlFor="interview-date"
              >
                Interview Date
              </label>

              <div className="job-form__datepicker-input">
                <DatePicker
                  id="interview-date"
                  selected={
                    formData.interview.date
                      ? new Date(`${formData.interview.date}T00:00:00`)
                      : null
                  }
                  onChange={handleInterviewDateChange}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select interview date"
                  disabled={isSubmitting}
                  popperPlacement="bottom-start"
                  popperClassName="job-form__datepicker-popper"
                  calendarClassName="job-form__calendar"
                  wrapperClassName="job-form__datepicker-wrapper"
                  showPopperArrow={false}
                />

                <Calendar
                  className="job-form__datepicker-icon"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>

            <Input
              label="Interview Time"
              type="time"
              name="time"
              value={formData.interview.time}
              onChange={handleInterviewChange}
              disabled={isSubmitting}
            />
          </div>

          <Select
            label="Interview Type"
            name="type"
            value={formData.interview.type}
            onChange={handleInterviewChange}
            options={[
              {
                value: "",
                label: "Select interview type",
              },
              {
                value: "Phone",
                label: "Phone",
              },
              {
                value: "Video",
                label: "Video",
              },
              {
                value: "On-site",
                label: "On-site",
              },
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
