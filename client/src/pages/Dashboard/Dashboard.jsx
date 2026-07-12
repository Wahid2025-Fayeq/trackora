import { useEffect, useState } from "react";
import AddJobModal from "../../components/common/AddJobModal/AddJobModal";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button/Button";
import ViewJobModal from "../../components/common/ViewJobModal/ViewJobModal";
import JobCard from "../../components/common/JobCard";
import { getJobAnalytics } from "../../utils/jobAnalytics";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../../services/jobsApi";
import AnalyticsCard from "../../components/common/AnalyticsCard/AnalyticsCard";
import StatsCard from "../../components/common/StatsCard/StatsCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import Select from "../../components/ui/Select/Select";
import { filterOptions, sortOptions } from "../../utils/selectOptions";
import EditJobModal from "../../components/common/EditJobModal/EditJobModal";
import { SearchX } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const loadJobs = () => {
    setIsLoading(true);
    setError("");

    return getJobs()
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
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleOpenAddJobModal = () => {
    setIsAddJobModalOpen(true);
  };

  const handleViewJobClick = (job) => {
    setSelectedJob(job);
    setIsViewJobModalOpen(true);
  };

  const handleCloseViewJobModal = () => {
    setIsViewJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleCloseAddJobModal = () => {
    setIsAddJobModalOpen(false);
  };

  const handleEditJobClick = (job) => {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  };

  const handleCloseEditJobModal = () => {
    setIsEditJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleAddJob = (newJob) => {
    return createJob(newJob)
      .then((createdJob) => {
        setJobs((prevJobs) => [createdJob, ...prevJobs]);
      })
      .catch((error) => {
        console.error("Failed to add job:", error);
        throw error;
      });
  };

  const handleUpdateJob = (updatedJob) => {
    return updateJob(updatedJob._id, updatedJob)
      .then((savedJob) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === savedJob._id ? savedJob : job)),
        );
      })
      .catch((error) => {
        console.error("Failed to update job:", error);
        throw error;
      });
  };

  const handleDeleteJob = (jobId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!isConfirmed) {
      return;
    }

    deleteJob(jobId)
      .then(() => {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        console.error("Failed to delete job:", error);
      });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "Oldest":
        return new Date(a.appliedDate) - new Date(b.appliedDate);

      case "Company":
        return a.company.localeCompare(b.company);

      case "Title":
        return a.title.localeCompare(b.title);

      case "Newest":
      default:
        return new Date(b.appliedDate) - new Date(a.appliedDate);
    }
  });

  const {
    totalJobs,
    appliedJobs,
    interviewJobs,
    savedJobs,
    offerJobs,
    activeJobs,
    interviewRate,
    offerRate,
  } = getJobAnalytics(jobs);

  return (
    <main className="dashboard">
      <Container>
        <section className="dashboard__header">
          <h1 className="dashboard__title">Welcome back, Wahid</h1>

          <p className="dashboard__subtitle">
            Track your applications, interviews, and saved jobs in one place.
          </p>

          <Button onClick={handleOpenAddJobModal}>Add Job</Button>
        </section>

        <section className="dashboard__stats">
          <StatsCard title="Applied" value={appliedJobs} />
          <StatsCard title="Interview" value={interviewJobs} />
          <StatsCard title="Saved" value={savedJobs} />
          <StatsCard title="Offer" value={offerJobs} />
        </section>
        <section className="dashboard__analytics">
          <h2 className="dashboard__section-title">Job Search Analytics</h2>

          <div className="dashboard__analytics-summary">
            <div>
              <span className="dashboard__analytics-label">Total Jobs</span>
              <strong className="dashboard__analytics-value">
                {totalJobs}
              </strong>
            </div>

            <div>
              <span className="dashboard__analytics-label">Active Jobs</span>
              <strong className="dashboard__analytics-value">
                {activeJobs}
              </strong>
            </div>
          </div>

          <div className="dashboard__analytics-list">
            <AnalyticsCard
              title="Interview Rate"
              value={interviewRate}
              suffix="%"
            />

            <AnalyticsCard title="Offer Rate" value={offerRate} suffix="%" />
          </div>
        </section>
        <section className="dashboard__jobs">
          <h2 className="dashboard__section-title">Recent Applications</h2>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="dashboard__filters">
            <Select
              label="Filter"
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={filterOptions}
            />

            <Select
              label="Sort By"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
          {isLoading ? (
            <p className="dashboard__loading">Loading jobs...</p>
          ) : error ? (
            <div className="dashboard__error">
              <h3>Something went wrong</h3>
              <p>{error}</p>

              <Button variant="secondary" onClick={loadJobs}>
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="dashboard__empty-state">
              <SearchX className="dashboard__empty-icon" size={40} />

              <h3 className="dashboard__empty-title">No jobs yet</h3>

              <p className="dashboard__empty-text">
                Add your first job application to get started.
              </p>
            </div>
          ) : sortedJobs.length > 0 ? (
            <div className="dashboard__job-list">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onView={handleViewJobClick}
                  onEdit={handleEditJobClick}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard__empty-state">
              <SearchX className="dashboard__empty-icon" size={40} />

              <h3 className="dashboard__empty-title">No matching jobs</h3>

              <p className="dashboard__empty-text">
                Try a different job title, company, or location.
              </p>
            </div>
          )}
        </section>
      </Container>

      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={handleCloseAddJobModal}
        onAddJob={handleAddJob}
      />

      <EditJobModal
        isOpen={isEditJobModalOpen}
        onClose={handleCloseEditJobModal}
        job={selectedJob}
        onUpdateJob={handleUpdateJob}
      />
      <ViewJobModal
        isOpen={isViewJobModalOpen}
        onClose={handleCloseViewJobModal}
        job={selectedJob}
      />
    </main>
  );
}

export default Dashboard;
