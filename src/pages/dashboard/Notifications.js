import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getNotifications, markAsRead, deleteNotification, getUnreadCount } from "../../features/notifications/notificationsSlice";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import moment from "moment";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading } = useSelector((store) => store.notifications);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notifId) => {
    try {
      await dispatch(markAsRead(notifId)).unwrap();
      dispatch(getUnreadCount()); // Update count immediately
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (notifId) => {
    try {
      await dispatch(deleteNotification(notifId)).unwrap();
      dispatch(getUnreadCount()); // Update count immediately
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleGoToJob = (jobId, notifId) => {
    handleMarkAsRead(notifId);
    navigate(`/add-job?edit=${jobId}`);
  };

  return (
    <Wrapper>
      <div className="form">
        <h3>{user?.role === "admin" ? "All Notifications (System-Wide)" : "Notifications"}</h3>
        {isLoading && <p>Loading notifications...</p>}
        {!isLoading && notifications.length === 0 && (
          <p style={{ color: "var(--grey-500)" }}>No notifications</p>
        )}

        {notifications.map((notif) => (
          <div
            key={notif._id}
            style={{
              border: "1px solid var(--grey-200)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: notif.isRead ? "white" : "var(--grey-50)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                {user?.role === "admin" && notif.userId && (
                  <p style={{ fontSize: "0.9rem", color: "var(--primary-500)", marginBottom: "0.5rem" }}>
                    <strong>User:</strong> {notif.userId.firstName} {notif.userId.lastName} ({notif.userId.role}) - {notif.userId.email}
                  </p>
                )}{user?.role === "admin" && notif.userId ? (
                  <p style={{ fontWeight: notif.isRead ? "normal" : "bold", marginBottom: "0.5rem" }}>
                    Sent to {notif.userId.firstName}: "{notif.message}"
                  </p>
                ) : (
                <p style={{ fontWeight: notif.isRead ? "normal" : "bold", marginBottom: "0.5rem" }}>
                  {notif.message}
                </p>
                )}
                {notif.jobId && (
                  <p style={{ fontSize: "0.9rem", color: "var(--grey-600)", marginBottom: "0.5rem" }}>
                    <strong>Job ID:</strong> {notif.jobId._id?.slice(-6)} | 
                    <strong> Customer:</strong> {notif.jobId.customerName} | 
                    <strong> Status:</strong> {notif.jobId.status}
                  </p>
                )}
                <p style={{ fontSize: "0.85rem", color: "var(--grey-500)" }}>
                  {moment(notif.createdAt).fromNow()} {notif.isRead ? "(Read)" : "(Unread)"}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {notif.jobId && (
                <button
                  onClick={() => handleGoToJob(notif.jobId._id, notif._id)}
                  className="btn"
                  style={{ background: "var(--primary-500)" }}
                >
                  Go to Job
                </button>
              )}
              {!notif.isRead && user?.role !== "admin" && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="btn"
                  style={{ background: "var(--green-dark)" }}
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => handleDelete(notif._id)}
                className="btn"
                style={{ background: "var(--red-dark)" }}
              >
                {user?.role === "admin" ? "Permanently Delete" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default Notifications;
