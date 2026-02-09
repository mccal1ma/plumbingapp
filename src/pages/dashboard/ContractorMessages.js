import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import moment from "moment";

const ContractorMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/messages/contractor");
      setMessages(data.messages);
      
      // Group messages by job
      const grouped = data.messages.reduce((acc, message) => {
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
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch messages");
    }
    setIsLoading(false);
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
      <div className="form">
        <h3>My Sent Messages</h3>
        <p style={{ color: "var(--grey-500)", marginBottom: "1rem" }}>
          Total messages: {messages.length}
        </p>

        {isLoading && <p>Loading messages...</p>}

        {!isLoading && messages.length === 0 && (
          <p style={{ color: "var(--grey-500)" }}>No messages sent yet</p>
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
                          To: {message.receiverId.firstName} {message.receiverId.lastName} ({message.receiverId.role})
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
          onClick={fetchMessages}
          style={{ marginTop: "1rem" }}
          disabled={isLoading}
        >
          Refresh Messages
        </button>
      </div>
    </Wrapper>
  );
};

export default ContractorMessages;
