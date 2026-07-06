import Container from "../../components/ui/Container";
import JobCard from "../../components/common/JobCard";
import { jobs } from "../../utils/constants";
import "./Dashboard.css";

function Dashboard() {
  return (
    <main className="dashboard">
      <Container>
        <section className="dashboard__header">
          <h1 className="dashboard__title">Welcome back, Wahid</h1>
          <p className="dashboard__subtitle">
            Track your applications, interviews, and saved jobs in one place.
          </p>
        </section>

        <section className="dashboard__jobs">
          <h2 className="dashboard__section-title">Recent Applications</h2>

          <div className="dashboard__job-list">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                status={job.status}
                appliedDate={job.appliedDate}
                location={job.location}
              />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

export default Dashboard;
