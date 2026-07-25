function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date =
    typeof dateValue === "string" && !dateValue.includes("T")
      ? new Date(`${dateValue}T00:00:00`)
      : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default formatDate;
