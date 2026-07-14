import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import toast from "react-hot-toast";

import AddJobModal from "../../components/common/AddJobModal/AddJobModal";
import AnalyticsCard from "../../components/common/AnalyticsCard/AnalyticsCard";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal/DeleteConfirmationModal";
import EditJobModal from "../../components/common/EditJobModal/EditJobModal";
import JobCard from "../../components/common/JobCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import StatsCard from "../../components/common/StatsCard/StatsCard";
import ViewJobModal from "../../components/common/ViewJobModal/ViewJobModal";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Select from "../../components/ui/Select/Select";

import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
} from "../../services/jobsApi";
import { getJobAnalytics } from "../../utils/jobAnalytics";
import { filterOptions, sortOptions } from "../../utils/selectOptions";

import "./Dashboard.css";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadJobs = () => {
    setIsLoading(true);
    setError("");

    return getJobs()
      .then((jobsData) => {
        setJobs(jobsData);
      })
      .catch((requestError) => {
        console.error("Failed to load jobs:", requestError);
        setJobs([]);

        if (requestError.status === 401) {
          localStorage.removeItem("jwt");
          setError("Your session has expired. Please sign in again.");
          toast.error("Your session has expired");
          return;
        }

        setError("Unable to load jobs. Please try again.");
        toast.error("Unable to load jobs");
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

  const handleCloseAddJobModal = () => {
    setIsAddJobModalOpen(false);
  };

  const handleViewJobClick = (job) => {
    setSelectedJob(job);
    setIsViewJobModalOpen(true);
  };

  const handleCloseViewJobModal = () => {
    setIsViewJobModalOpen(false);
    setSelectedJob(null);
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
        setJobs((currentJobs) => [createdJob, ...currentJobs]);
        toast.success(`"${createdJob.title}" added successfully`);
      })
      .catch((requestError) => {
        console.error("Failed to add job:", requestError);
        toast.error(requestError.message || "Unable to add job");
        throw requestError;
      });
  };

  const handleUpdateJob = (updatedJob) => {
    return updateJob(updatedJob._id, updatedJob)
      .then((savedJob) => {
        setJobs((currentJobs) =>
          currentJobs.map((job) => (job._id === savedJob._id ? savedJob : job)),
        );

        toast.success(`"${savedJob.title}" updated successfully`);
      })
      .catch((requestError) => {
        console.error("Failed to update job:", requestError);
        toast.error(requestError.message || "Unable to update job");
        throw requestError;
      });
  };

  const handleDeleteJob = (jobId) => {
    const selectedJobToDelete = jobs.find((job) => job._id === jobId);

    if (!selectedJobToDelete) {
      toast.error("Unable to find this job");
      return;
    }

    setJobToDelete(selectedJobToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteJob(jobToDelete._id);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobToDelete._id),
      );

      toast.success(`"${jobToDelete.title}" deleted successfully`);

      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (requestError) {
      console.error("Failed to delete job:", requestError);

      if (requestError.status === 401) {
        localStorage.removeItem("jwt");
        setError("Your session has expired. Please sign in again.");
        toast.error("Your session has expired");
        return;
      }

      toast.error(requestError.message || "Unable to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearchTerm = searchTerm.toLowerCase();

    const matchesSearch = `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(normalizedSearchTerm);

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
              onChange={(event) => setStatusFilter(event.target.value)}
              options={filterOptions}
            />

            <Select
              label="Sort By"
              name="sortBy"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
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
                Try a different job title, company, location, or filter.
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        jobTitle={jobToDelete?.title}
        isDeleting={isDeleting}
      />
    </main>
  );
}

export default Dashboard;
