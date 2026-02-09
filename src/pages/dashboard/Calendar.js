import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import customFetch from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobsByDate, setJobsByDate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDateJobs, setSelectedDateJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/analytics/jobs-by-date");
      setJobsByDate(data.jobsByDate);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch jobs");
    }
    setIsLoading(false);
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      const jobCount = jobsByDate[dateStr] || 0;
      
      if (jobCount > 0) {
        return (
          <div
            style={{
              backgroundColor: "var(--primary-500)",
              borderRadius: "50%",
              color: "white",
              fontSize: "0.7rem",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            {jobCount}
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const jobCount = jobsByDate[dateStr] || 0;
    
    if (jobCount > 0) {
      setIsLoading(true);
      try {
        const { data } = await customFetch.get(`/analytics/jobs-for-date?date=${dateStr}`);
        setSelectedDateJobs(data.jobs);
        setSelectedDate(date);
        setShowModal(true);
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Failed to fetch jobs for this date");
      }
      setIsLoading(false);
    } else {
      toast.info("No jobs scheduled for this date");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "var(--primary-500)";
      case "in progress":
        return "#f0ad4e";
      case "completed":
        return "var(--green-dark)";
      case "payment pending":
        return "#5bc0de";
      default:
        return "var(--grey-500)";
    }
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "var(--green-dark)";
      case "pending":
        return "#f0ad4e";
      case "rejected":
        return "var(--red-dark)";
      case "unassigned":
        return "var(--grey-500)";
      default:
        return "var(--grey-500)";
    }
  };

  return (
    <Wrapper>
      <div className="form">
        <h3>Job Calendar</h3>
        <p style={{ color: "var(--grey-500)", marginBottom: "1rem" }}>
          Click on dates with job counts to view details
        </p>

        {isLoading && <p>Loading calendar...</p>}

        {!isLoading && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Calendar
              onClickDay={handleDateClick}
              value={selectedDate}
              tileContent={getTileContent}
              style={{ width: "100%", maxWidth: "600px" }}
            />
          </div>
        )}

        {/* Modal for showing jobs on selected date */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Jobs on {selectedDate.toLocaleDateString()}</h4>
              <p style={{ marginBottom: "1rem" }}>
                {selectedDateJobs.length} job(s) scheduled
              </p>

              {selectedDateJobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    border: "1px solid var(--grey-200)",
                    borderRadius: "4px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h5 style={{ marginBottom: "0.5rem" }}>{job.customerName}</h5>
                  <p style={{ marginBottom: "0.25rem" }}>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p style={{ marginBottom: "0.25rem" }}>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(job.status),
                        fontWeight: "bold",
                      }}
                    >
                      {job.status}
                    </span>
                  </p>
                  <p style={{ marginBottom: "0.25rem" }}>
                    <strong>Assignment:</strong>{" "}
                    <span
                      style={{
                        color: getAssignmentStatusColor(job.assignmentStatus),
                        fontWeight: "bold",
                      }}
                    >
                      {job.assignmentStatus}
                    </span>
                  </p>
                  {job.employeeAssigned && (
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Assigned to:</strong> {job.employeeAssigned.firstName} {job.employeeAssigned.lastName}
                    </p>
                  )}
                  <button
                    className="btn"
                    onClick={() => {
                      setShowModal(false);
                      navigate(`/add-job?edit=${job._id}`);
                    }}
                    style={{ marginTop: "0.75rem", width: "100%" }}
                  >
                    Edit Job
                  </button>
                </div>
              ))}

              <button
                className="btn btn-block"
                onClick={() => setShowModal(false)}
                style={{ marginTop: "1rem" }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <button
          className="btn"
          onClick={fetchJobs}
          style={{ marginTop: "2rem" }}
        >
          Refresh Calendar
        </button>
      </div>
    </Wrapper>
  );
};

export default CalendarPage;
