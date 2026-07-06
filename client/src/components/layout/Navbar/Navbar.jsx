import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__logo" href="/">
        Trackora
      </a>

      <nav className="navbar__links">
        <a className="navbar__link" href="/">
          Dashboard
        </a>
        <a className="navbar__link" href="/">
          Saved Jobs
        </a>
        <a className="navbar__link" href="/">
          Interviews
        </a>
      </nav>

      <div className="navbar__user">Wahid</div>
    </header>
  );
}

export default Navbar;
