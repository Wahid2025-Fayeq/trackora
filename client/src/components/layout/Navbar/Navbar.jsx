import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Settings, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../ui/Button/Button";
import useAuth from "../../../hooks/useAuth";

import "./Navbar.css";

function Navbar() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);

    logout();
    navigate("/login");
  };

  const handleMenuLinkClick = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <Link className="navbar__logo" to="/">
        Trackora
      </Link>

      <button
        type="button"
        className="navbar__menu-button"
        onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
        aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="main-navigation"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        id="main-navigation"
        className={`navbar__links ${
          isMobileMenuOpen ? "navbar__links_open" : ""
        }`}
        aria-label="Main navigation"
      >
        {isLoggedIn ? (
          <>
            <Link className="navbar__link" to="/" onClick={handleMenuLinkClick}>
              Dashboard
            </Link>

            <div className="navbar__user-menu" ref={userMenuRef}>
              <button
                className="navbar__user-button"
                type="button"
                onClick={() =>
                  setIsUserMenuOpen((currentValue) => !currentValue)
                }
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-controls="navbar-user-dropdown"
              >
                <span className="navbar__avatar" aria-hidden="true">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="navbar__user-name">
                  {currentUser?.name || "User"}
                </span>

                <ChevronDown
                  className={`navbar__chevron ${
                    isUserMenuOpen ? "navbar__chevron_open" : ""
                  }`}
                  size={18}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen && (
                <div
                  id="navbar-user-dropdown"
                  className="navbar__dropdown"
                  role="menu"
                >
                  <div className="navbar__dropdown-header">
                    <strong>{currentUser?.name || "User"}</strong>
                    <span>{currentUser?.email}</span>
                  </div>

                  <div className="navbar__dropdown-divider" />

                  <Link
                    className="navbar__dropdown-item"
                    to="/profile"
                    role="menuitem"
                    onClick={handleMenuLinkClick}
                  >
                    <User size={17} aria-hidden="true" />
                    Profile
                  </Link>

                  <Link
                    className="navbar__dropdown-item"
                    to="/settings"
                    role="menuitem"
                    onClick={handleMenuLinkClick}
                  >
                    <Settings size={17} aria-hidden="true" />
                    Settings
                  </Link>

                  <div className="navbar__dropdown-divider" />

                  <Button
                    size="small"
                    variant="secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              className="navbar__link"
              to="/login"
              onClick={handleMenuLinkClick}
            >
              Sign In
            </Link>

            <Link
              className="navbar__link"
              to="/register"
              onClick={handleMenuLinkClick}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
