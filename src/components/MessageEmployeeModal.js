import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { CharacterCounter, PhoneLink } from "./index";
import { getEmployeesForMessaging, sendMessage } from "../features/messages/messagesSlice";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const MessageEmployeeModal = ({ isOpen, onClose, jobId = null }) => {
  const dispatch = useDispatch();
  const { employees, isLoading } = useSelector((store) => store.messages);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      dispatch(getEmployeesForMessaging());
    }
  }, [isOpen, dispatch]);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedEmp = employees.find((emp) => emp._id === selectedEmployee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !content.trim()) {
      return;
    }

    const messageData = {
      receiverId: selectedEmployee,
      content: content.trim(),
      messageType: jobId ? "job_related" : "direct",
    };

    if (jobId) {
      messageData.jobId = jobId;
    }

    await dispatch(sendMessage(messageData));
    setContent("");
    setSelectedEmployee("");
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>Send Message to Employee</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "var(--grey-500)",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Search input */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Search Employee
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..."
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid var(--grey-200)",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Employee selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid var(--grey-200)",
                borderRadius: "4px",
              }}
            >
              <option value="">-- Select Employee --</option>
              {filteredEmployees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} - {emp.role} {emp.phone ? `(${formatPhoneNumber(emp.phone)})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Display phone as clickable link */}
          {selectedEmp && selectedEmp.phone && (
            <div style={{ marginBottom: "1rem", padding: "0.5rem", backgroundColor: "var(--grey-50)", borderRadius: "4px" }}>
              <strong>Phone:</strong> <PhoneLink phone={selectedEmp.phone} />
            </div>
          )}

          {/* Message content */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Message {jobId ? "(Job-Related)" : "(Direct)"}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={100}
              required
              rows={3}
              placeholder="Type your message here..."
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid var(--grey-200)",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
            <CharacterCounter current={content.length} max={100} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid var(--grey-300)",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "var(--primary-500)",
                color: "white",
                cursor: "pointer",
              }}
              disabled={isLoading || !selectedEmployee || !content.trim()}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageEmployeeModal;
