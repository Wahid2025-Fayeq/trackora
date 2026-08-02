import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import DateInput from "../../ui/DateInput/DateInput";
import Select from "../../ui/Select/Select";
import Textarea from "../../ui/Textarea/Textarea";
import { statusOptions } from "../../../utils/selectOptions";
import { getDatePickerFormat } from "../../../utils/formatDate";

import "./JobForm.css";

const formatDateForState = (date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const createInterviewDateTime = (date, time) => {
  if (!date || !time) {
    return null;
  }

  const interviewDateTime = new Date(`${date}T${time}:00`);

  if (Number.isNaN(interviewDateTime.getTime())) {
    return null;
  }

  return interviewDateTime;
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

  followUp: {
    date: "",
    completed: false,
    notes: "",
  },
};

function JobForm({
  initialValues = defaultInitialValues,
  defaultStatus = "Applied",
  dateFormat = "MM/DD/YYYY",
  onSubmit,
  submitButtonText = "Save",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => ({
    ...defaultInitialValues,
    status: initialValues.status || defaultStatus,
  }));

  const [interviewError, setInterviewError] = useState("");

  const datePickerFormat = getDatePickerFormat(dateFormat);

  useEffect(() => {
    const interviewDate = initialValues.interview?.date
      ? new Date(initialValues.interview.date)
      : null;

    const followUpDate = initialValues.followUp?.date
      ? new Date(initialValues.followUp.date)
      : null;

    setFormData({
      ...defaultInitialValues,
      ...initialValues,
      status: initialValues.status || defaultStatus,

      interview: {
        ...defaultInitialValues.interview,
        ...initialValues.interview,

        date:
          interviewDate && !Number.isNaN(interviewDate.getTime())
            ? formatDateForState(interviewDate)
            : "",

        time:
          interviewDate && !Number.isNaN(interviewDate.getTime())
            ? interviewDate.toTimeString().slice(0, 5)
            : "",
      },

      followUp: {
        ...defaultInitialValues.followUp,
        ...initialValues.followUp,

        date:
          followUpDate && !Number.isNaN(followUpDate.getTime())
            ? formatDateForState(followUpDate)
            : "",
      },
    });

    setInterviewError("");
  }, [initialValues, defaultStatus]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (name === "status") {
      setInterviewError("");
    }
  };

  const handleApplicationDateChange = (date) => {
    setFormData((previousData) => ({
      ...previousData,
      appliedDate: formatDateForState(date),
    }));
  };

  const handleInterviewChange = (event) => {
    const { name, value } = event.target;

    setInterviewError("");

    setFormData((previousData) => ({
      ...previousData,

      interview: {
        ...previousData.interview,
        [name]: value,
      },
    }));
  };

  const handleInterviewDateChange = (date) => {
    setInterviewError("");

    setFormData((previousData) => ({
      ...previousData,

      interview: {
        ...previousData.interview,
        date: formatDateForState(date),
      },
    }));
  };

  const handleFollowUpChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,

      followUp: {
        ...previousData.followUp,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleFollowUpDateChange = (date) => {
    setFormData((previousData) => ({
      ...previousData,

      followUp: {
        ...previousData.followUp,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setInterviewError("");

    if (!isFormValid || isSubmitting) {
      return;
    }

    let interviewData = {
      date: null,
      time: "",
      type: "",
      location: "",
      meetingLink: "",
      notes: "",
    };

    if (isInterviewStatus) {
      const { date, time, type } = formData.interview;

      if (!date || !time || !type) {
        setInterviewError("Interview date, time, and type are required.");
        return;
      }

      const interviewDateTime = createInterviewDateTime(date, time);

      if (!interviewDateTime) {
        setInterviewError("Please enter a valid interview date and time.");
        return;
      }

      if (interviewDateTime.getTime() <= Date.now()) {
        setInterviewError("The interview date and time must be in the future.");
        return;
      }

      interviewData = {
        ...formData.interview,
        date: interviewDateTime.toISOString(),
      };
    }

    const followUpData = {
      date: formData.followUp.date
        ? new Date(`${formData.followUp.date}T12:00:00`).toISOString()
        : null,

      completed: formData.followUp.completed,
      notes: formData.followUp.notes.trim(),
    };

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      interview: interviewData,
      followUp: followUpData,
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
            withPortal
            inputMode="none"
            customInput={<DateInput />}
            selected={
              formData.appliedDate
                ? new Date(`${formData.appliedDate}T00:00:00`)
                : null
            }
            onChange={handleApplicationDateChange}
            dateFormat={datePickerFormat}
            placeholderText="Select application date"
            disabled={isSubmitting}
            calendarClassName="job-form__calendar"
            wrapperClassName="job-form__datepicker-wrapper"
            showPopperArrow={false}
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
                  withPortal
                  inputMode="none"
                  customInput={<DateInput />}
                  selected={
                    formData.interview.date
                      ? new Date(`${formData.interview.date}T00:00:00`)
                      : null
                  }
                  onChange={handleInterviewDateChange}
                  dateFormat={datePickerFormat}
                  placeholderText="Select interview date"
                  disabled={isSubmitting}
                  minDate={new Date()}
                  calendarClassName="job-form__calendar"
                  wrapperClassName="job-form__datepicker-wrapper"
                  showPopperArrow={false}
                />
              </div>
            </div>

            <Input
              className="interview-time-input"
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

          {interviewError && (
            <p className="job-form__error" role="alert">
              {interviewError}
            </p>
          )}
        </section>
      )}

      <section className="job-form__follow-up">
        <h3 className="job-form__section-title">Follow-up Reminder</h3>

        <div className="job-form__datepicker">
          <label
            className="job-form__datepicker-label"
            htmlFor="follow-up-date"
          >
            Follow-up Date
          </label>

          <div className="job-form__datepicker-input">
            <DatePicker
              id="follow-up-date"
              withPortal
              inputMode="none"
              customInput={<DateInput />}
              selected={
                formData.followUp.date
                  ? new Date(`${formData.followUp.date}T00:00:00`)
                  : null
              }
              onChange={handleFollowUpDateChange}
              dateFormat={datePickerFormat}
              placeholderText="Select follow-up date"
              disabled={isSubmitting}
              minDate={new Date()}
              calendarClassName="job-form__calendar"
              wrapperClassName="job-form__datepicker-wrapper"
              showPopperArrow={false}
            />
          </div>
        </div>

        <Textarea
          label="Follow-up Notes"
          name="notes"
          value={formData.followUp.notes}
          onChange={handleFollowUpChange}
          placeholder="Email the recruiter, send a LinkedIn message..."
          disabled={isSubmitting}
        />

        {formData.followUp.date && (
          <label className="job-form__checkbox">
            <input
              type="checkbox"
              name="completed"
              checked={formData.followUp.completed}
              onChange={handleFollowUpChange}
              disabled={isSubmitting}
            />

            <span>Follow-up completed</span>
          </label>
        )}
      </section>

      <Textarea
        label="General Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder={`Recruiter:
Salary:
Job URL:
Additional notes:`}
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
