import { useEffect, useState } from "react";

import Loader from "../components/ui/Loader/Loader";
import AuthContext from "../context/AuthContext";

import {
  deleteAccount as deleteAccountRequest,
  getCurrentUser,
  login as loginRequest,
  updateCurrentUser,
  updatePreferences as updatePreferencesRequest,
  uploadAvatar,
} from "../services/authApi";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setIsCheckingToken(false);
      return;
    }

    getCurrentUser(token)
      .then((response) => {
        const userData = response.user || response;

        setCurrentUser(userData);
        setIsLoggedIn(true);

        if (userData.preferences?.theme) {
          localStorage.setItem("theme", userData.preferences.theme);
        }
      })
      .catch((error) => {
        console.error("Token check failed:", error);

        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => {
        setIsCheckingToken(false);
      });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const userTheme = currentUser?.preferences?.theme;

    const selectedTheme = userTheme || storedTheme || "system";

    if (userTheme) {
      localStorage.setItem("theme", userTheme);
    }

    const root = document.documentElement;
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        selectedTheme === "system"
          ? systemThemeQuery.matches
            ? "dark"
            : "light"
          : selectedTheme;

      root.setAttribute("data-theme", resolvedTheme);
    };

    applyTheme();

    if (selectedTheme !== "system") {
      return undefined;
    }

    systemThemeQuery.addEventListener("change", applyTheme);

    return () => {
      systemThemeQuery.removeEventListener("change", applyTheme);
    };
  }, [currentUser?.preferences?.theme]);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);

    const token = response.token;
    const user = response.user || response.data?.user;

    if (!token) {
      throw new Error("The server did not return a token");
    }

    if (!user) {
      throw new Error("The server did not return user information");
    }

    localStorage.setItem("jwt", token);

    if (user.preferences?.theme) {
      localStorage.setItem("theme", user.preferences.theme);
    }

    setCurrentUser(user);
    setIsLoggedIn(true);

    return user;
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const response = await updateCurrentUser(token, profileData);
    const updatedUser = response.user || response;

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const savePreferences = async (preferences) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    localStorage.setItem("theme", preferences.theme);

    const response = await updatePreferencesRequest(token, preferences);
    const updatedUser = response.user || response;

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const uploadProfileAvatar = async (file) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const response = await uploadAvatar(token, file);
    const updatedUser = response.user || response;

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const deleteAccount = async (confirmation) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const response = await deleteAccountRequest(token, confirmation);

    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const authContextValue = {
    currentUser,
    isLoggedIn,
    login,
    logout,
    updateProfile,
    savePreferences,
    uploadProfileAvatar,
    deleteAccount,
  };

  if (isCheckingToken) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
