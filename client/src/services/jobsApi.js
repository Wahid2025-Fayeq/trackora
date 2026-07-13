import { jobs } from "../utils/constants";

const BASE_URL = "http://localhost:3001";
const USE_MOCK_API = false;

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const checkResponse = async (res) => {
  if (res.ok) {
    return res.json();
  }

  const errorData = await res.json().catch(() => ({}));

  return Promise.reject({
    status: res.status,
    message: errorData.message || `Request failed with status ${res.status}`,
  });
};

export const getJobs = () => {
  if (USE_MOCK_API) {
    return Promise.resolve(jobs);
  }

  return fetch(`${BASE_URL}/jobs`, {
    headers: getAuthHeaders(),
  }).then(checkResponse);
};

export const createJob = (jobData) => {
  if (USE_MOCK_API) {
    return Promise.resolve({
      id: Date.now(),
      ...jobData,
    });
  }

  return fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  }).then(checkResponse);
};

export const updateJob = (jobId, jobData) => {
  if (USE_MOCK_API) {
    return Promise.resolve({
      ...jobData,
      id: jobId,
    });
  }

  return fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  }).then(checkResponse);
};

export const deleteJob = (jobId) => {
  if (USE_MOCK_API) {
    return Promise.resolve({
      message: "Job deleted",
      id: jobId,
    });
  }

  return fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then(checkResponse);
};
