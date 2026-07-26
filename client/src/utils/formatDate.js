const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";

const padNumber = (value) => String(value).padStart(2, "0");

const parseDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date =
    typeof dateValue === "string" && !dateValue.includes("T")
      ? new Date(`${dateValue}T00:00:00`)
      : new Date(dateValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getDatePickerFormat = (dateFormat = DEFAULT_DATE_FORMAT) => {
  switch (dateFormat) {
    case "DD/MM/YYYY":
      return "dd/MM/yyyy";

    case "YYYY-MM-DD":
      return "yyyy-MM-dd";

    case "MM/DD/YYYY":
    default:
      return "MM/dd/yyyy";
  }
};

function formatDate(dateValue, dateFormat = DEFAULT_DATE_FORMAT) {
  const date = parseDate(dateValue);

  if (!date) {
    return "";
  }

  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const year = date.getFullYear();

  switch (dateFormat) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;

    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;

    case "MM/DD/YYYY":
    default:
      return `${month}/${day}/${year}`;
  }
}

export default formatDate;
