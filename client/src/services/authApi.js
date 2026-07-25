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

export function register({ name, username, email, password }) {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      username,
      email,
      password,
    }),
  }).then(checkResponse);
}

export function login({ identifier, password }) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
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

export function updateCurrentUser(token, { name, email }) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
    }),
  }).then(checkResponse);
}

export function updatePreferences(token, preferences) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      preferences,
    }),
  }).then(checkResponse);
}

export const uploadAvatar = async (token, file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await fetch(`${BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return checkResponse(response);
};

export function forgotPassword(email) {
  return fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then(checkResponse);
}

export function resetPassword(token, password) {
  return fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  }).then(checkResponse);
}

export function changePassword(token, { currentPassword, newPassword }) {
  return fetch(`${BASE_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  }).then(checkResponse);
}

export function deleteAccount(token, confirmation) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      confirmation,
    }),
  }).then(checkResponse);
}
