import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getCurrentUser, login as loginRequest } from "../services/authApi";
import Loader from "../components/ui/Loader/Loader";

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
