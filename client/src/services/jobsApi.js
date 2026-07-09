import { jobs } from "../utils/constants";

const BASE_URL = "http://localhost:3001";
const USE_MOCK_API = false;

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Error: ${res.status}`);
};

export const getJobs = () => {
  if (USE_MOCK_API) {
    return Promise.resolve(jobs);
  }

  return fetch(`${BASE_URL}/jobs`).then(checkResponse);
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  }).then(checkResponse);
};

export const deleteJob = (jobId) => {
  if (USE_MOCK_API) {
    return Promise.resolve({ message: "Job deleted", id: jobId });
  }

  return fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  }).then(checkResponse);
};
