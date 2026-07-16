const BASE_URL = "http://localhost:3001";

function checkResponse(res) {
  return res.text().then((text) => {
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server returned an invalid response (${res.status})`);
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data;
  });
}

export function register({ name, email, password }) {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  }).then(checkResponse);
}

export function login({ email, password }) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
}

export function getCurrentUser(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
}

export function updateCurrentUser(token, { name }) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  }).then(checkResponse);
}

export const uploadAvatar = async (token, file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await fetch("http://localhost:3001/users/me/avatar", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return checkResponse(response);
};
