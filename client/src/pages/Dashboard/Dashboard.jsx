import { useEffect, useState } from "react";
import AddJobModal from "../../components/common/AddJobModal/AddJobModal";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button/Button";
import JobCard from "../../components/common/JobCard";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../../services/jobsApi";
import StatsCard from "../../components/common/StatsCard/StatsCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";
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

  const handleOpenAddJobModal = () => {
    setIsAddJobModalOpen(true);
  };

  const handleCloseAddJobModal = () => {
    setIsAddJobModalOpen(false);
  };

  const handleCloseEditJobModal = () => {
    setIsEditJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleUpdateJob = (updatedJob) => {
    updateJob(updatedJob.id, updatedJob)
      .then((savedJob) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === savedJob.id ? savedJob : job)),
        );
      })
      .catch((error) => {
        console.error("Failed to update job:", error);
      });
  };
  const handleEditJobClick = (job) => {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  };
  const handleAddJob = (newJob) => {
    createJob(newJob)
      .then((createdJob) => {
        setJobs((prevJobs) => [createdJob, ...prevJobs]);
      })
      .catch((error) => {
        console.error("Failed to add job:", error);
      });
  };
  const handleDeleteJob = (jobId) => {
    deleteJob(jobId)
      .then(() => {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      })
      .catch((error) => {
        console.error("Failed to delete job:", error);
      });
  };
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
          <Button onClick={handleOpenAddJobModal}>Add Job</Button>
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
                  job={job}
                  onEdit={handleEditJobClick}
                  onDelete={handleDeleteJob}
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
    </main>
  );
}

export default Dashboard;
