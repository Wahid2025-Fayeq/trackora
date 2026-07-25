import { FaGithub, FaLinkedin } from "react-icons/fa";

import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <h3>Trackora</h3>

          <p>Track your job search with confidence.</p>
        </div>

        <div className="footer__social">
          <a
            href="https://github.com/Wahid2025-Fayeq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>

      <p className="footer__copyright">
        &copy; {year} Trackora. Built by Wahid Fayeq.
      </p>
    </footer>
  );
}

export default Footer;
