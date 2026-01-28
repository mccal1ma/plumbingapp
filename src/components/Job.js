import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import { useDispatch } from "react-redux";
import JobInfo from "./JobInfo";
import moment from "moment";
import { deleteJob, setEditJob } from "../features/user/job/jobSlice";
const Job = ({
  _id,
  location,
  customerName,
  date,
  description,
  employeeAssigned,
  position,
  jobLocation,
  jobType,
  createdAt,
  status,
}) => {
  const dispatch = useDispatch();

  const dateCreated = moment(createdAt).format("MMM Do, YYYY");
  
  //because of the space in "payment pending" we need to adjust the className
  let statusCSS = status;
  if(status === 'payment pending'){
    statusCSS = 'payment-pending';
  } else if(status === 'in progress'){
    statusCSS = 'in-progress';
  }
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{customerName.charAt(0)}</div>
        <div className="info">
          <h5>Job</h5>
          <p>{customerName}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={location} />
          <JobInfo icon={<FaCalendarAlt />} text={`Date of Appointment: ${date}`} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <JobInfo icon={<FaBriefcase />} text={description} />
          <JobInfo icon={<FaBriefcase />} text={employeeAssigned} />
          <JobInfo icon={<FaCalendarAlt />} text={`Date created: ${dateCreated}`} />
          <div className={`status ${statusCSS}`}>{status}</div>

        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              className="btn edit-btn"
              onClick={() =>
                dispatch(
                  setEditJob({
                    editJobId: _id,
                    location,
                    customerName,
                    date,
                    description,
                    employeeAssigned,
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
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => dispatch(deleteJob(_id))}
            >
              delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
