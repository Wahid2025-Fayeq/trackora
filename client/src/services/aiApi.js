const BASE_URL = "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const checkResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  const errorData = await response.json().catch(() => ({}));

  return Promise.reject({
    status: response.status,
    message:
      errorData.message || `Request failed with status ${response.status}`,
  });
};

export const generateCoverLetter = ({
  jobTitle,
  company,
  jobDescription,
  experience,
}) => {
  return fetch(`${BASE_URL}/api/ai/cover-letter`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      jobTitle,
      company,
      jobDescription,
      experience,
    }),
  }).then(checkResponse);
};
