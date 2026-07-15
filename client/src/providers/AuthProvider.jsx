import { useEffect, useState } from "react";

import Loader from "../components/ui/Loader/Loader";
import AuthContext from "../context/AuthContext";
import {
  getCurrentUser,
  login as loginRequest,
  updateCurrentUser,
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

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("You are not signed in");
    }

    const updatedUser = await updateCurrentUser(token, profileData);

    setCurrentUser(updatedUser);

    return updatedUser;
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
