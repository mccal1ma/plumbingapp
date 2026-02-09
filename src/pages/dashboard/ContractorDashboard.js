import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import { getNotifications, getUnreadCount } from "../../features/notifications/notificationsSlice";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import moment from "moment";
import { CharacterCounter } from "../../components";

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((store) => store.notifications);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [messageForm, setMessageForm] = useState({
    jobId: "",
    content: "",
  });
  const [showMessageForm, setShowMessageForm] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    dispatch(getNotifications());
    dispatch(getUnreadCount());
    fetchAcceptedJobs();
  }, [dispatch]);

  const fetchAcceptedJobs = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/jobs");
      // Filter to only show accepted jobs in this section (pending ones are shown in notifications)
      const accepted = data.jobs.filter(job => job.assignmentStatus === "accepted");
      setAcceptedJobs(accepted);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch jobs");
    }
    setIsLoading(false);
  };

  const handleAccept = async (jobId) => {
    setIsLoading(true);
    try {
      await customFetch.patch(`/jobs/${jobId}/accept`);
      toast.success("Job accepted successfully");
      
      // Small delay to ensure backend update completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refresh notifications and unread count
      await dispatch(getNotifications()).unwrap();
      await dispatch(getUnreadCount()).unwrap();
      
      fetchAcceptedJobs();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to accept job");
    }
    setIsLoading(false);
  };

  const handleReject = async (jobId) => {
    setIsLoading(true);
    try {
      await customFetch.patch(`/jobs/${jobId}/reject`, {
        rejectionReason,
      });
      toast.success("Job rejected successfully");
      setRejectionReason("");
      setShowRejectionForm(null);
      
      // Small delay to ensure backend update completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await dispatch(getNotifications()).unwrap();
      await dispatch(getUnreadCount()).unwrap();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to reject job");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageForm.content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    try {
      // Get the job to find the receptionist (creator)
      const job = acceptedJobs.find((j) => j._id === messageForm.jobId);
      if (!job) {
        toast.error("Job not found");
        return;
      }

      console.log("Sending message for job:", job);
      console.log("Receiver ID:", job.createdBy);

      await customFetch.post("/messages", {
        jobId: messageForm.jobId,
        receiverId: job.createdBy,
        content: messageForm.content,
      });

      toast.success("Message sent successfully");
      setMessageForm({ jobId: "", content: "" });
      setShowMessageForm(null);
    } catch (error) {
      console.error("Message send error:", error);
      toast.error(error?.response?.data?.msg || "Failed to send message");
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    setUpdatingStatus(jobId);
    try {
      await customFetch.patch(`/jobs/${jobId}`, { status: newStatus });
      toast.success("Job status updated successfully");
      fetchAcceptedJobs();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to update job status");
    }
    setUpdatingStatus(null);
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      "active": ["in progress"],
      "in progress": ["payment pending"],
      "payment pending": ["completed"],
      "completed": []
    };
    return statusFlow[currentStatus] || [];
  };

  // Filter pending notifications
  const pendingNotifications = notifications.filter(
    (notif) => 
      notif.type === "job_assigned" && 
      !notif.isRead &&
      notif.jobId?.assignmentStatus === "pending"
  );

  // Separate accepted jobs into active and payment pending
  const activeJobs = acceptedJobs.filter(job => 
    job.status !== "payment pending" && job.status !== "completed"
  );
  const paymentPendingJobs = acceptedJobs.filter(job => 
    job.status === "payment pending" || job.status === "completed"
  );

  return (
    <Wrapper>
      <div className="form">
        <h3>Contractor Dashboard</h3>

        {/* Pending Job Assignments */}
        <div style={{ marginBottom: "2rem" }}>
          <h4>Pending Job Assignments ({pendingNotifications.length})</h4>
          {pendingNotifications.length === 0 && (
            <p style={{ color: "var(--grey-500)" }}>No pending assignments</p>
          )}

          {pendingNotifications.map((notif) => (
            <div
              key={notif._id}
              style={{
                border: "1px solid var(--grey-200)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "var(--grey-50)",
              }}
            >
              <h5>{notif.jobId?.customerName}</h5>
              <p>
                <strong>Location:</strong> {notif.jobId?.location}
              </p>
              <p>
                <strong>Date:</strong> {notif.jobId?.date}
              </p>
              <p>
                <strong>Description:</strong> {notif.jobId?.description || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {notif.jobId?.status}
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>
                {moment(notif.createdAt).fromNow()}
              </p>

              {showRejectionForm === notif.jobId?._id ? (
                <div style={{ marginTop: "1rem" }}>
                  <label htmlFor={`rejection-${notif.jobId._id}`}>
                    Rejection Reason (Optional):
                  </label>
                  <textarea
                    id={`rejection-${notif.jobId._id}`}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--grey-300)",
                    }}
                    rows="3"
                  />
                  <button
                    onClick={() => handleReject(notif.jobId._id)}
                    className="btn"
                    style={{
                      marginRight: "0.5rem",
                      background: "var(--red-dark)",
                    }}
                    disabled={isLoading}
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectionForm(null);
                      setRejectionReason("");
                    }}
                    className="btn clear-btn"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => handleAccept(notif.jobId._id)}
                    className="btn"
                    style={{ marginRight: "0.5rem", background: "var(--green-dark)" }}
                    disabled={isLoading}
                  >
                    Accept Job
                  </button>
                  <button
                    onClick={() => setShowRejectionForm(notif.jobId._id)}
                    className="btn"
                    style={{ background: "var(--red-dark)" }}
                    disabled={isLoading}
                  >
                    Reject Job
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        <div style={{ marginBottom: "2rem" }}>
          <h4>My Active Jobs ({activeJobs.length})</h4>
          {isLoading && <p>Loading jobs...</p>}
          {!isLoading && activeJobs.length === 0 && (
            <p style={{ color: "var(--grey-500)" }}>No active jobs</p>
          )}

          {activeJobs.map((job) => (
            <div
              key={job._id}
              style={{
                border: "1px solid var(--grey-200)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h5>{job.customerName}</h5>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Date:</strong> {job.date}
              </p>
              <p>
                <strong>Status:</strong> {job.status}
              </p>
              <p>
                <strong>Description:</strong> {job.description || "N/A"}
              </p>

              {/* Status Update Dropdown */}
              {getNextStatusOptions(job.status).length > 0 && (
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <label htmlFor={`status-${job._id}`} style={{ marginRight: "0.5rem" }}>
                    <strong>Update Status:</strong>
                  </label>
                  <select
                    id={`status-${job._id}`}
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    disabled={updatingStatus === job._id}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--grey-300)",
                    }}
                  >
                    <option value={job.status}>{job.status}</option>
                    {getNextStatusOptions(job.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {showMessageForm === job._id ? (
                <form onSubmit={handleSendMessage} style={{ marginTop: "1rem" }}>
                  <label htmlFor={`message-${job._id}`}>Send Message to Receptionist:</label>
                  <textarea
                    id={`message-${job._id}`}
                    value={messageForm.content}
                    onChange={(e) =>
                      setMessageForm({ ...messageForm, content: e.target.value })
                    }
                    placeholder="Type your message..."
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--grey-300)",
                    }}
                    rows="3"
                    maxLength={100}
                    required
                  />
                  <CharacterCounter current={messageForm.content.length} max={100} />
                  <button
                    type="submit"
                    className="btn"
                    style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                    disabled={isLoading}
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageForm(null);
                      setMessageForm({ jobId: "", content: "" });
                    }}
                    className="btn clear-btn"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setShowMessageForm(job._id);
                    setMessageForm({ jobId: job._id, content: "" });
                  }}
                  className="btn"
                  style={{ marginTop: "0.5rem" }}
                  disabled={isLoading}
                >
                  Send Message
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment Pending Jobs */}
        <div style={{ marginBottom: "2rem" }}>
          <h4>Payment Pending ({paymentPendingJobs.length})</h4>
          {paymentPendingJobs.length === 0 && (
            <p style={{ color: "var(--grey-500)" }}>No jobs awaiting payment</p>
          )}

          {paymentPendingJobs.map((job) => (
            <div
              key={job._id}
              style={{
                border: "1px solid var(--grey-200)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: job.status === "completed" ? "var(--green-light)" : "#fff9e6",
              }}
            >
              <h5>{job.customerName}</h5>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Date:</strong> {job.date}
              </p>
              <p>
                <strong>Status:</strong> {job.status}
              </p>
              <p>
                <strong>Description:</strong> {job.description || "N/A"}
              </p>

              {showMessageForm === job._id ? (
                <form onSubmit={handleSendMessage} style={{ marginTop: "1rem" }}>
                  <label htmlFor={`message-${job._id}`}>Send Message to Receptionist:</label>
                  <textarea
                    id={`message-${job._id}`}
                    value={messageForm.content}
                    onChange={(e) =>
                      setMessageForm({ ...messageForm, content: e.target.value })
                    }
                    placeholder="Type your message..."
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--grey-300)",
                    }}
                    rows="3"
                    maxLength={100}
                    required
                  />
                  <CharacterCounter current={messageForm.content.length} max={100} />
                  <button
                    type="submit"
                    className="btn"
                    style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                    disabled={isLoading}
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageForm(null);
                      setMessageForm({ jobId: "", content: "" });
                    }}
                    className="btn clear-btn"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setShowMessageForm(job._id);
                    setMessageForm({ jobId: job._id, content: "" });
                  }}
                  className="btn"
                  style={{ marginTop: "0.5rem" }}
                  disabled={isLoading}
                >
                  Send Message
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default ContractorDashboard;
