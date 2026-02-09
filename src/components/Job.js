import { FaLocationArrow, FaBriefcase, FaCalendarAlt, FaUser, FaQuestionCircle, FaClock, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import { useDispatch, useSelector } from "react-redux";
import JobInfo from "./JobInfo";
import moment from "moment";
import { deleteJob, setEditJob } from "../features/user/job/jobSlice";
import { canEditJob, canDeleteJob } from "../utils/permissions";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const Job = ({
  _id,
  location,
  customerName,
  customerPhone,
  date,
  description,
  employeeAssigned,
  position,
  jobLocation,
  jobType,
  createdAt,
  status,
  assignmentStatus,
  rejectionReason,
  rejectedBy,
  createdBy,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const dateCreated = moment(createdAt).format("MMM Do, YYYY");
  const dateOfAppointment = moment(date).format("MMM Do, YYYY");
  
  //because of the space in "payment pending" we need to adjust the className
  let statusCSS = status;
  if(status === 'payment pending'){
    statusCSS = 'payment-pending';
  } else if(status === 'in progress'){
    statusCSS = 'in-progress';
  }

  // Get assignment status badge color
  const getAssignmentStatusColor = () => {
    if (!assignmentStatus) return '';
    switch (assignmentStatus) {
      case 'accepted':
        return 'var(--green-dark)';
      case 'pending':
        return '#f0ad4e';
      case 'rejected':
        return 'var(--red-dark)';
      default:
        return 'var(--grey-500)';
    }
  };

  const showEditButton = canEditJob(user?.role, createdBy, user?.userId);
  const showDeleteButton = canDeleteJob(user?.role, createdBy, user?.userId);

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{customerName.charAt(0)}</div>
        <div className="info">
          <h5>{customerName}</h5>
          <p>customer</p>
          
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={location} />
          {customerPhone && (
            <JobInfo 
              icon={<FaPhone />} 
              text={
                <a href={`tel:${customerPhone}`} style={{ color: "var(--primary-500)", textDecoration: "none" }}>
                  {formatPhoneNumber(customerPhone)}
                </a>
              } 
            />
          )}
          <JobInfo icon={<FaCalendarAlt />} text={`Date of Appointment: ${dateOfAppointment}`} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <JobInfo icon={<FaQuestionCircle />} text={description} />
          <JobInfo icon={<FaUser />} text={employeeAssigned ? (typeof employeeAssigned === 'object' ? `${employeeAssigned.firstName} ${employeeAssigned.lastName}` : employeeAssigned) : 'Unassigned'} />
          <JobInfo icon={<FaClock />} text={`Date created: ${dateCreated}`} />
          <div className={`status ${statusCSS}`}>{status}</div>
          {assignmentStatus && (
            <div
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: getAssignmentStatusColor(),
                color: 'white',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
              }}
            >
              {assignmentStatus}
            </div>
          )}
          {rejectionReason && (
            <p style={{ marginTop: '0.5rem', color: 'var(--red-dark)', fontSize: '0.9rem' }}>
              <strong>Rejection Reason:</strong> {rejectionReason}
              {rejectedBy && ` - ${typeof rejectedBy === 'object' ? `${rejectedBy.firstName} ${rejectedBy.lastName}` : rejectedBy}`}
            </p>
          )}

        </div>
        <footer>
          <div className="actions">
            {showEditButton && (
              <Link
                to="/add-job"
                className="btn edit-btn"
                onClick={() =>
                  dispatch(
                    setEditJob({
                      editJobId: _id,
                      location,
                      customerName,
                      customerPhone: formatPhoneNumber(customerPhone),
                      date,
                      description,
                      employeeAssigned: typeof employeeAssigned === 'object' ? employeeAssigned._id : employeeAssigned,
                      position,
                      jobLocation,
                      jobType,
                      createdAt,
                      status,
                    }),
                  )
                }
              >
                Edit
              </Link>
            )}
            {showDeleteButton && (
              <button
                type="button"
                className="btn delete-btn"
                onClick={() => dispatch(deleteJob(_id))}
              >
                delete
              </button>
            )}
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
