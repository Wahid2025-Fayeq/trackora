import { Link } from "react-router-dom";
import { BarChart3, CalendarClock, FileText, SearchCheck } from "lucide-react";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import useAuth from "../../hooks/useAuth";

import "./Landing.css";

function Landing() {
  const { isLoggedIn } = useAuth();

  return (
    <main className="landing">
      <section className="landing__hero">
        <Container>
          <div className="landing__hero-content">
            <div className="landing__hero-text">
              <p className="landing__eyebrow">
                A smarter way to manage your job search
              </p>

              <h1 className="landing__title">
                Organize every application and move your career forward.
              </h1>

              <p className="landing__subtitle">
                Track applications, interviews, documents, and progress from one
                simple and secure workspace.
              </p>

              <div className="landing__hero-actions">
                <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                  <Button>
                    {isLoggedIn ? "Open Dashboard" : "Start Tracking"}
                  </Button>
                </Link>

                {!isLoggedIn && (
                  <Link className="landing__secondary-link" to="/login">
                    I already have an account
                  </Link>
                )}
              </div>
            </div>

            <div
              className="landing__preview"
              aria-label="Trackora dashboard preview"
            >
              <div className="landing__preview-header">
                <span />
                <span />
                <span />
              </div>

              <div className="landing__preview-body">
                <div className="landing__preview-heading">
                  <div>
                    <p>Welcome back</p>
                    <h2>Your Job Search</h2>
                  </div>

                  <span>+ Add Job</span>
                </div>

                <div className="landing__preview-stats">
                  <div>
                    <strong>24</strong>
                    <span>Applications</span>
                  </div>

                  <div>
                    <strong>6</strong>
                    <span>Interviews</span>
                  </div>

                  <div>
                    <strong>3</strong>
                    <span>Offers</span>
                  </div>
                </div>

                <div className="landing__preview-jobs">
                  <div>
                    <span>Software Engineer</span>
                    <small>Applied</small>
                  </div>

                  <div>
                    <span>Frontend Developer</span>
                    <small>Interview</small>
                  </div>

                  <div>
                    <span>IT Support Specialist</span>
                    <small>Saved</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="landing__features">
        <Container>
          <div className="landing__section-heading">
            <p className="landing__eyebrow">Everything in one place</p>

            <h2>Stay focused throughout your job search</h2>

            <p>
              Trackora gives you the tools to organize opportunities and
              understand your progress.
            </p>
          </div>

          <div className="landing__feature-grid">
            <article className="landing__feature-card">
              <SearchCheck size={24} aria-hidden="true" />

              <h3>Application tracking</h3>

              <p>
                Save job details and move each application through your hiring
                pipeline.
              </p>
            </article>

            <article className="landing__feature-card">
              <BarChart3 size={24} aria-hidden="true" />

              <h3>Progress analytics</h3>

              <p>
                View application trends, interview activity, and status
                breakdowns.
              </p>
            </article>

            <article className="landing__feature-card">
              <CalendarClock size={24} aria-hidden="true" />

              <h3>Interview planning</h3>

              <p>Store interview dates, meeting links, locations, and notes.</p>
            </article>

            <article className="landing__feature-card">
              <FileText size={24} aria-hidden="true" />

              <h3>Document management</h3>

              <p>
                Keep resumes, cover letters, and job descriptions connected to
                each application.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Landing;
