import { Link, useNavigate } from "react-router-dom";
import Button from "../../ui/Button/Button";
import useAuth from "../../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="navbar__logo" to="/">
        Trackora
      </Link>

      <nav className="navbar__links">
        {isLoggedIn ? (
          <>
            <Link className="navbar__link" to="/">
              Dashboard
            </Link>

            <div className="navbar__user">
              <span className="navbar__user-name">{currentUser?.name}</span>

              <Button size="small" variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link className="navbar__link" to="/login">
              Sign In
            </Link>

            <Link className="navbar__link" to="/register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
