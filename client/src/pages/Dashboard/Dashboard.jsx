import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, SearchX, Sparkles, Video } from "lucide-react";
import toast from "react-hot-toast";

import AddJobModal from "../../components/common/AddJobModal/AddJobModal";
import AnalyticsCard from "../../components/common/AnalyticsCard/AnalyticsCard";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal/DeleteConfirmationModal";
import EditJobModal from "../../components/common/EditJobModal/EditJobModal";
import FollowUpReminders from "../../components/common/FollowUpReminders/FollowUpReminders";
import JobCard from "../../components/common/JobCard";
import JobCardSkeleton from "../../components/common/JobCardSkeleton/JobCardSkeleton";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import StatsCard from "../../components/common/StatsCard/StatsCard";
import ViewJobModal from "../../components/common/ViewJobModal/ViewJobModal";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Loader from "../../components/ui/Loader/Loader";
import Select from "../../components/ui/Select/Select";
import formatDate from "../../utils/formatDate";

import useAuth from "../../hooks/useAuth";

import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
} from "../../services/jobsApi";

import getFollowUpReminders from "../../utils/followUpReminders";
import {
  getJobAnalytics,
  getMonthlyApplicationsData,
  getStatusChartData,
} from "../../utils/jobAnalytics";
import { filterOptions, sortOptions } from "../../utils/selectOptions";

import "./Dashboard.css";

const MonthlyApplicationsChart = lazy(
  () =>
    import("../../components/common/MonthlyApplicationsChart/MonthlyApplicationsChart"),
);

const StatusChart = lazy(
  () => import("../../components/common/StatusChart/StatusChart"),
);

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getMeetingLink = (meetingLink) => {
  if (!meetingLink) {
    return "";
  }

  return meetingLink.startsWith("http://") || meetingLink.startsWith("https://")
    ? meetingLink
    : `https://${meetingLink}`;
};

const getInterviewCountdown = (date, dateFormat) => {
  const interviewDate = new Date(date);

  if (Number.isNaN(interviewDate.getTime())) {
    return "Date unavailable";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const interviewDay = new Date(
    interviewDate.getFullYear(),
    interviewDate.getMonth(),
    interviewDate.getDate(),
  );

  const daysAway = Math.round(
    (interviewDay.getTime() - today.getTime()) / MILLISECONDS_PER_DAY,
  );

  const formattedDate = formatDate(interviewDate, dateFormat);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(interviewDate);

  if (daysAway === 0) {
    return `Today • ${formattedDate} at ${formattedTime}`;
  }

  if (daysAway === 1) {
    return `Tomorrow • ${formattedDate} at ${formattedTime}`;
  }

  if (daysAway > 1 && daysAway < 7) {
    return `In ${daysAway} days • ${formattedDate} at ${formattedTime}`;
  }

  if (daysAway >= 7 && daysAway < 14) {
    return `Next week • ${formattedDate} at ${formattedTime}`;
  }

  return `${formattedDate} at ${formattedTime}`;
};

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const dateFormat = currentUser?.preferences?.dateFormat || "MM/DD/YYYY";

  const notifications = {
    interviewReminders:
      currentUser?.preferences?.notifications?.interviewReminders ?? true,
    followUpReminders:
      currentUser?.preferences?.notifications?.followUpReminders ?? true,
    applicationUpdates:
      currentUser?.preferences?.notifications?.applicationUpdates ?? true,
    emailNotifications:
      currentUser?.preferences?.notifications?.emailNotifications ?? false,
  };

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
  const [sortBy, setSortBy] = useState(
    currentUser?.preferences?.defaultSort || "newest",
  );
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

  useEffect(() => {
    setSortBy(currentUser?.preferences?.defaultSort || "newest");
  }, [currentUser?.preferences?.defaultSort]);

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

        if (notifications.applicationUpdates) {
          toast.success(`"${createdJob.title}" added successfully`);
        }
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

        if (notifications.applicationUpdates) {
          toast.success(`"${savedJob.title}" updated successfully`);
        }
      })
      .catch((requestError) => {
        console.error("Failed to update job:", requestError);
        toast.error(requestError.message || "Unable to update job");
        throw requestError;
      });
  };

  const handleCompleteFollowUp = (job) => {
    const updatedJob = {
      ...job,
      followUp: {
        ...job.followUp,
        completed: true,
      },
    };

    return updateJob(job._id, updatedJob)
      .then((savedJob) => {
        setJobs((currentJobs) =>
          currentJobs.map((currentJob) =>
            currentJob._id === savedJob._id ? savedJob : currentJob,
          ),
        );

        toast.success(`Follow-up completed for "${savedJob.company}"`);
      })
      .catch((requestError) => {
        console.error("Failed to complete follow-up:", requestError);
        toast.error(requestError.message || "Unable to complete follow-up");
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

      if (notifications.applicationUpdates) {
        toast.success(`"${jobToDelete.title}" deleted successfully`);
      }

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
      case "oldest":
        return new Date(a.appliedDate) - new Date(b.appliedDate);

      case "company":
        return a.company.localeCompare(b.company);

      case "title":
        return a.title.localeCompare(b.title);

      case "newest":
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

  const statusChartData = getStatusChartData(jobs);
  const monthlyApplicationsData = getMonthlyApplicationsData(jobs);

  const { overdue, dueToday, upcoming } = getFollowUpReminders(jobs);

  const upcomingInterviews = jobs
    .filter((job) => {
      if (job.status !== "Interview" || !job.interview?.date) {
        return false;
      }

      const interviewDate = new Date(job.interview.date);

      return (
        !Number.isNaN(interviewDate.getTime()) &&
        interviewDate.getTime() >= Date.now()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.interview.date).getTime() -
        new Date(b.interview.date).getTime(),
    )
    .slice(0, 3);

  return (
    <main className="dashboard">
      <Container>
        <section className="dashboard__header">
          <h1 className="dashboard__title">
            Welcome back, {currentUser?.name || "User"}
          </h1>

          <p className="dashboard__subtitle">
            Track your applications, interviews, and saved jobs in one place.
          </p>

          <Button onClick={handleOpenAddJobModal}>Add Job</Button>
        </section>

        <section className="dashboard__cover-letter">
          <div className="dashboard__cover-letter-icon">
            <Sparkles size={28} aria-hidden="true" />
          </div>

          <div className="dashboard__cover-letter-content">
            <p className="dashboard__cover-letter-label">AI-powered tool</p>

            <h2 className="dashboard__cover-letter-title">
              Create a tailored cover letter
            </h2>

            <p className="dashboard__cover-letter-description">
              Generate a personalized cover letter for any opportunity—even
              before adding the job to Trackora.
            </p>
          </div>

          <Button onClick={() => navigate("/cover-letter")}>
            <Sparkles size={17} aria-hidden="true" />
            Generate Cover Letter
          </Button>
        </section>

        <section className="dashboard__stats">
          <StatsCard title="Applied" value={appliedJobs} />
          <StatsCard title="Interview" value={interviewJobs} />
          <StatsCard title="Saved" value={savedJobs} />
          <StatsCard title="Offer" value={offerJobs} />
        </section>

        <section className="dashboard__jobs">
          <h2 className="dashboard__section-title">Recent Applications</h2>

          {jobs.length > 0 && (
            <>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

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
            </>
          )}

          {isLoading ? (
            <div
              className="dashboard__job-list"
              role="status"
              aria-label="Loading jobs"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
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
              <SearchX
                className="dashboard__empty-icon"
                size={40}
                aria-hidden="true"
              />

              <h3 className="dashboard__empty-title">Start your job search</h3>

              <p className="dashboard__empty-text">
                Add your first opportunity or create a tailored cover letter
                before applying.
              </p>

              <div className="dashboard__empty-actions">
                <Button onClick={handleOpenAddJobModal}>
                  Add Your First Job
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/cover-letter")}
                >
                  <Sparkles size={17} aria-hidden="true" />
                  Generate Cover Letter
                </Button>
              </div>
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
                  dateFormat={dateFormat}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard__empty-state">
              <SearchX
                className="dashboard__empty-icon"
                size={40}
                aria-hidden="true"
              />

              <h3 className="dashboard__empty-title">No matching jobs</h3>

              <p className="dashboard__empty-text">
                Try a different job title, company, location, or filter.
              </p>
            </div>
          )}
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

          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Visual Insights</h2>

            <p className="dashboard__section-description">
              Understand your application progress with interactive charts.
            </p>
          </div>

          <section className="dashboard__charts">
            <Suspense fallback={<Loader />}>
              <StatusChart data={statusChartData} />
              <MonthlyApplicationsChart data={monthlyApplicationsData} />
            </Suspense>
          </section>
        </section>

        {notifications.followUpReminders && (
          <FollowUpReminders
            overdue={overdue}
            dueToday={dueToday}
            upcoming={upcoming}
            onView={handleViewJobClick}
            onComplete={handleCompleteFollowUp}
            dateFormat={dateFormat}
          />
        )}

        {notifications.interviewReminders && (
          <section className="dashboard__upcoming">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Upcoming Interviews</h2>

              <p className="dashboard__section-description">
                Your next scheduled interviews.
              </p>
            </div>

            {upcomingInterviews.length > 0 ? (
              <div className="dashboard__upcoming-list">
                {upcomingInterviews.map((job) => (
                  <article key={job._id} className="dashboard__upcoming-card">
                    <div className="dashboard__upcoming-info">
                      <div>
                        <h3 className="dashboard__upcoming-company">
                          {job.company}
                        </h3>

                        <p className="dashboard__upcoming-title">{job.title}</p>
                      </div>

                      <div className="dashboard__upcoming-details">
                        <div className="dashboard__upcoming-detail">
                          <CalendarDays size={17} aria-hidden="true" />

                          <time dateTime={job.interview.date}>
                            {getInterviewCountdown(
                              job.interview.date,
                              dateFormat,
                            )}
                          </time>
                        </div>

                        {job.interview.type && (
                          <div className="dashboard__upcoming-detail">
                            <Video size={17} aria-hidden="true" />
                            <span>{job.interview.type}</span>
                          </div>
                        )}

                        {job.interview.location && (
                          <div className="dashboard__upcoming-detail">
                            <MapPin size={17} aria-hidden="true" />
                            <span>{job.interview.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="dashboard__upcoming-actions">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleViewJobClick(job)}
                      >
                        View
                      </Button>

                      {job.interview.meetingLink && (
                        <a
                          className="dashboard__join-button"
                          href={getMeetingLink(job.interview.meetingLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="dashboard__upcoming-empty">
                <CalendarDays size={28} aria-hidden="true" />

                <div>
                  <h3>No upcoming interviews</h3>

                  <p>
                    Interview details will appear here after you schedule an
                    interview.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </Container>

      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={handleCloseAddJobModal}
        onAddJob={handleAddJob}
        defaultStatus={currentUser?.preferences?.defaultStatus || "Applied"}
        dateFormat={dateFormat}
      />

      <EditJobModal
        isOpen={isEditJobModalOpen}
        onClose={handleCloseEditJobModal}
        job={selectedJob}
        onUpdateJob={handleUpdateJob}
        dateFormat={dateFormat}
      />

      <ViewJobModal
        isOpen={isViewJobModalOpen}
        onClose={handleCloseViewJobModal}
        job={selectedJob}
        dateFormat={dateFormat}
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
