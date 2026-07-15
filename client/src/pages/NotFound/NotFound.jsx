import { Link } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";

import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found">
      <Container>
        <section className="not-found__content">
          <span className="not-found__code">404</span>

          <h1 className="not-found__title">Page not found</h1>

          <p className="not-found__text">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <Link className="not-found__link" to="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </section>
      </Container>
    </main>
  );
}

export default NotFound;
