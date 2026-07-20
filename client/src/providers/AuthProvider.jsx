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
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
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

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const { token, user } = response;

    if (!token) {
      throw new Error("The server did not return a token");
    }

    if (!user) {
      throw new Error("The server did not return user information");
    }

    localStorage.setItem("jwt", token);
    setCurrentUser(user);
    setIsLoggedIn(true);

    return user;
  };

  useEffect(() => {
    const selectedTheme = currentUser?.preferences?.theme || "system";
    const root = document.documentElement;

    const applyTheme = () => {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      const resolvedTheme =
        selectedTheme === "system"
          ? systemPrefersDark
            ? "dark"
            : "light"
          : selectedTheme;

      root.dataset.theme = resolvedTheme;
    };

    applyTheme();

    if (selectedTheme !== "system") {
      return;
    }

    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    systemThemeQuery.addEventListener("change", applyTheme);

    return () => {
      systemThemeQuery.removeEventListener("change", applyTheme);
    };
  }, [currentUser?.preferences?.theme]);

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const updatedUser = await updateCurrentUser(token, profileData);

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const savePreferences = async (preferences) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const updatedUser = await updatePreferencesRequest(token, preferences);

    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const uploadProfileAvatar = async (file) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const updatedUser = await uploadAvatar(token, file);

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
