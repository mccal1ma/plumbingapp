import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import moment from "moment";
import ContractorMessages from "./ContractorMessages";
import { MessageEmployeeModal } from "../../components";

const Messages = () => {
  const { user } = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);

  useEffect(() => {
    if (user?.role === "receptionist" || user?.role === "admin") {
      fetchMessages();
      fetchDirectMessages();
    }
  }, [user]);

  // If user is contractor, show ContractorMessages component
  if (user?.role === "contractor") {
    return <ContractorMessages />;
  }

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/messages/receptionist");
      console.log("Fetched messages:", data);
      setMessages(data.messages);
      
      // Group messages by job (only job-related messages)
      const jobRelatedMessages = data.messages.filter(message => message.jobId);
      const grouped = jobRelatedMessages.reduce((acc, message) => {
        const jobId = message.jobId._id;
        if (!acc[jobId]) {
          acc[jobId] = {
            job: message.jobId,
            messages: [],
          };
        }
        acc[jobId].messages.push(message);
        return acc;
      }, {});
      
      setGroupedMessages(grouped);
      console.log("Grouped messages:", grouped);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error?.response?.data?.msg || "Failed to fetch messages");
    }
    setIsLoading(false);
  };

  const fetchDirectMessages = async () => {
    try {
      const { data } = await customFetch.get("/messages/direct");
      setDirectMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching direct messages:", error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setIsLoading(true);
    try {
      await customFetch.delete(`/messages/${messageId}`);
      toast.success("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete message");
    }
    setIsLoading(false);
  };

  return (
    <Wrapper>
      <MessageEmployeeModal 
        isOpen={showMessageModal} 
        onClose={() => {
          setShowMessageModal(false);
          fetchDirectMessages();
        }} 
      />
      
      <div className="form">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3>Messages</h3>
          <button 
            className="btn" 
            onClick={() => setShowMessageModal(true)}
            style={{ marginTop: 0 }}
          >
            Send Message to Employee
          </button>
        </div>

        {/* Direct Messages Section */}
        {directMessages.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ marginBottom: "1rem" }}>Direct Messages ({directMessages.length})</h4>
            {directMessages.map((message) => (
              <div
                key={message._id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--grey-200)",
                  borderRadius: "4px",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>
                    From: {message.senderId.firstName} {message.senderId.lastName} ({message.senderId.role})
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>
                    {moment(message.createdAt).format("MMM DD, YYYY h:mm A")}
                  </span>
                </div>
                <p style={{ marginBottom: "0.5rem" }}>{message.content}</p>
                <button
                  onClick={() => handleDelete(message._id)}
                  style={{
                    padding: "0.25rem 0.5rem",
                    background: "var(--red-dark)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <h4 style={{ marginBottom: "1rem" }}>Job Messages from Contractors</h4>
        <p style={{ color: "var(--grey-500)", marginBottom: "1rem" }}>
          Total job messages: {messages.filter(m => m.jobId).length}
        </p>

        {isLoading && <p>Loading messages...</p>}

        {!isLoading && messages.filter(m => m.jobId).length === 0 && (
          <p style={{ color: "var(--grey-500)" }}>No messages received yet</p>
        )}

        {!isLoading && Object.keys(groupedMessages).length > 0 && (
          <div>
            {Object.values(groupedMessages).map(({ job, messages: jobMessages }) => (
              <div
                key={job._id}
                style={{
                  border: "1px solid var(--grey-200)",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "var(--grey-50)",
                }}
              >
                <h4 style={{ marginBottom: "0.5rem" }}>{job.customerName}</h4>
                <p style={{ marginBottom: "0.25rem" }}>
                  <strong>Location:</strong> {job.location}
                </p>
                <p style={{ marginBottom: "0.25rem" }}>
                  <strong>Date:</strong> {job.date}
                </p>
                <p style={{ marginBottom: "1rem" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      backgroundColor:
                        job.status === "completed"
                          ? "var(--green-dark)"
                          : job.status === "in progress"
                          ? "#f0ad4e"
                          : "var(--primary-500)",
                      color: "white",
                      fontSize: "0.85rem",
                    }}
                  >
                    {job.status}
                  </span>
                </p>

                <div
                  style={{
                    borderTop: "1px solid var(--grey-200)",
                    paddingTop: "1rem",
                  }}
                >
                  <h5 style={{ marginBottom: "1rem" }}>
                    Messages ({jobMessages.length})
                  </h5>

                  {jobMessages.map((message) => (
                    <div
                      key={message._id}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid var(--grey-200)",
                        borderRadius: "4px",
                        padding: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <strong>
                          From: {message.senderId.firstName} {message.senderId.lastName} ({message.senderId.role})
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>
                          {moment(message.createdAt).format("MMM DD, YYYY h:mm A")}
                        </span>
                      </div>
                      <p style={{ marginBottom: "0.5rem" }}>{message.content}</p>
                      <button
                        onClick={() => handleDelete(message._id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "var(--red-dark)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn"
          onClick={() => {
            fetchMessages();
            fetchDirectMessages();
          }}
          style={{ marginTop: "1rem" }}
          disabled={isLoading}
        >
          Refresh All Messages
        </button>
      </div>
    </Wrapper>
  );
};

export default Messages;
