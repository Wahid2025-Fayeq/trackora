const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const BASE_URL = (configuredApiUrl || "http://localhost:3001").replace(
  /\/+$/,
  "",
);

export default BASE_URL;
