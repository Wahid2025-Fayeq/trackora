import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import JobCard from "../../components/common/JobCard";
import { getJobs } from "../../utils/jobsApi";
import StatsCard from "../../components/common/StatsCard/StatsCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import { SearchX } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");

    getJobs()
      .then((jobsData) => {
        setJobs(jobsData);
      })
      .catch((error) => {
        console.error("Failed to load jobs:", error);
        setJobs([]);
        setError("Unable to load jobs. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;

  const interviewJobs = jobs.filter((job) => job.status === "Interview").length;

  const savedJobs = jobs.filter((job) => job.status === "Saved").length;

  const offerJobs = jobs.filter((job) => job.status === "Offer").length;

  return (
    <main className="dashboard">
      <Container>
        <section className="dashboard__header">
          <h1 className="dashboard__title">Welcome back, Wahid</h1>
          <p className="dashboard__subtitle">
            Track your applications, interviews, and saved jobs in one place.
          </p>
        </section>
        <section className="dashboard__stats">
          <StatsCard title="Applied" value={appliedJobs} />
          <StatsCard title="Interview" value={interviewJobs} />
          <StatsCard title="Saved" value={savedJobs} />
          <StatsCard title="Offer" value={offerJobs} />
        </section>
        <section className="dashboard__jobs">
          <h2 className="dashboard__section-title">Recent Applications</h2>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {isLoading ? (
            <p className="dashboard__loading">Loading jobs...</p>
          ) : error ? (
            <div className="dashboard__error">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="dashboard__job-list">
              {filteredJobs.map((job) => (
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
          ) : (
            <div className="dashboard__empty-state">
              <SearchX className="dashboard__empty-icon" size={40} />
              <h3 className="dashboard__empty-title">No jobs found</h3>
              <p className="dashboard__empty-text">
                Try searching for a different job title, company, or location.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}

export default Dashboard;
