import "./TimePicker.css";

const hourOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

const minuteOptions = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const convertToTwelveHourTime = (time) => {
  if (!time) {
    return {
      hour: "",
      minute: "",
      period: "AM",
    };
  }

  const [hourString, minute = "00"] = time.split(":");
  const hour24 = Number(hourString);

  if (Number.isNaN(hour24)) {
    return {
      hour: "",
      minute: "",
      period: "AM",
    };
  }

  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return {
    hour: String(hour12).padStart(2, "0"),
    minute,
    period,
  };
};

const convertToTwentyFourHourTime = (hour, minute, period) => {
  if (!hour || !minute || !period) {
    return "";
  }

  let hour24 = Number(hour);

  if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  }

  if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

function TimePicker({
  label = "Time",
  value = "",
  onChange,
  disabled = false,
  error = "",
}) {
  const { hour, minute, period } = convertToTwelveHourTime(value);

  const updateTime = (nextValues) => {
    const nextHour = nextValues.hour ?? hour;
    const nextMinute = nextValues.minute ?? minute;
    const nextPeriod = nextValues.period ?? period;

    onChange(convertToTwentyFourHourTime(nextHour, nextMinute, nextPeriod));
  };

  return (
    <div className="time-picker">
      <label className="time-picker__label">{label}</label>

      <div className="time-picker__controls">
        <div className="time-picker__select-wrapper">
          <select
            className="time-picker__select"
            aria-label="Interview hour"
            value={hour}
            onChange={(event) =>
              updateTime({
                hour: event.target.value,
                minute: minute || "00",
              })
            }
            disabled={disabled}
          >
            <option value="">Hour</option>

            {hourOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="time-picker__select-wrapper">
          <select
            className="time-picker__select"
            aria-label="Interview minute"
            value={minute}
            onChange={(event) =>
              updateTime({
                minute: event.target.value,
              })
            }
            disabled={disabled || !hour}
          >
            <option value="">Minute</option>

            {minuteOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="time-picker__select-wrapper">
          <select
            className="time-picker__select time-picker__select_period"
            aria-label="AM or PM"
            value={period}
            onChange={(event) =>
              updateTime({
                period: event.target.value,
              })
            }
            disabled={disabled || !hour}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {error && (
        <span className="time-picker__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default TimePicker;
