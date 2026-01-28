import { FormRow, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleChange, clearValues, createJob, editJob } from "../../features/user/job/jobSlice";
import {useEffect} from "react";

const AddJob = () => {
  const {
    isLoading,
    customerName,
    status,
    statusOptions,
    jobType,
    jobTypeOptions,
    location,
    date,
    description,
    employeeAssigned,
    isEditing,
    editJobId,
  } = useSelector((store) => store.job);
  const dispatch = useDispatch();

 
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !customerName ||
      !location ||
      !date ||
      !description ||
      !employeeAssigned ||
      !jobType
    ) {
      toast.error("Please fill out all fields");
      return;
    }
    dispatch(createJob({
      customerName,
      location, 
      date,
      description,
      employeeAssigned,
      jobType,
      status,
    }));
  };
  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // dispatch update job input
    dispatch(handleChange({ name, value }));
  };

  if (isEditing) {
    dispatch(editJob({jobId: editJobId, job: {
      customerName,
      location,
      date,
      description,
      employeeAssigned,
      jobType,
      status,
    }}));
  }

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        <div className="form-center">
          <FormRow
            type="text"
            name="customerName"
            labelText="Customer Name"
            value={customerName}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="location"
            value={location}
            handleChange={handleJobInput}
          />
          <FormRow
            type="date"
            name="date"
            value={date}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="description"
            value={description}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="employeeAssigned"
            labelText="Employee Assigned"
            value={employeeAssigned}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            list={jobTypeOptions}
            name="jobType"
            labelText="Job Type"
            value={jobType}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            list={statusOptions}
            name="status"
            value={status}
            handleChange={handleJobInput}
          />
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-block clear-btn"
              onClick={() => dispatch(clearValues())}
            >clear</button>
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isEditing
                  ? "save changes"
                  : "add job"}
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
