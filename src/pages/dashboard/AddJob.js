import { FormRow, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { formatPhoneInput, stripPhoneFormatting } from "../../utils/phoneFormatter";
import {
  handleChange,
  clearValues,
  createJob,
  editJob,
  setEditJob,
} from "../../features/user/job/jobSlice";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import customFetch from "../../utils/axios";

const AddJob = () => {
  const {
    isLoading,
    customerName,
    customerPhone,
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
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    // Redirect contractors away from this page
    if (user?.role === 'contractor') {
      navigate('/contractor-dashboard');
      return;
    }

    // Fetch contractors list
    const fetchContractors = async () => {
      try {
        const { data } = await customFetch.get("/jobs/contractors");
        setContractors(data.contractors);
      } catch (error) {
        console.error("Failed to fetch contractors", error);
      }
    };
    
    fetchContractors();

    // Check for edit parameter in URL
    const searchParams = new URLSearchParams(window.location.search);
    const editJobIdFromUrl = searchParams.get('edit');
    
    if (editJobIdFromUrl) {
      const fetchJobForEdit = async () => {
        try {
          const { data } = await customFetch.get(`/jobs`);
          const jobToEdit = data.jobs.find(job => job._id === editJobIdFromUrl);
          
          if (jobToEdit) {
            dispatch(setEditJob({
              editJobId: jobToEdit._id,
              customerName: jobToEdit.customerName,
              customerPhone: jobToEdit.customerPhone,
              location: jobToEdit.location,
              date: jobToEdit.date,
              description: jobToEdit.description,
              employeeAssigned: jobToEdit.employeeAssigned?._id || jobToEdit.employeeAssigned,
              jobType: jobToEdit.jobType,
              status: jobToEdit.status,
            }));
          } else {
            toast.error("Job not found");
            navigate('/all-jobs');
          }
        } catch (error) {
          toast.error("Failed to load job");
          navigate('/all-jobs');
        }
      };
      
      fetchJobForEdit();
    }
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !customerName ||
      !customerPhone ||
      !location ||
      !date ||
      !description ||
      !employeeAssigned ||
      !jobType
    ) {
      toast.error("Please fill out all fields");
      return;
    }

     if (isEditing) {
    dispatch(
      editJob({
        jobId: editJobId,
        job: {
          customerName,
          customerPhone: stripPhoneFormatting(customerPhone),
          location,
          date,
          description,
          employeeAssigned,
          jobType,
          status,
        },
      }),
      ).then(() => {
        navigate('/all-jobs');}
    );
    return
  }

    dispatch(
      createJob({
        customerName,
        customerPhone: stripPhoneFormatting(customerPhone),
        location,
        date,
        description,
        employeeAssigned,
        jobType,
        status,
      }),
      ).then(() => {
        navigate('/all-jobs');}
    );
  };
  const handleJobInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    
    // Format phone number as user types
    if (name === 'customerPhone') {
      value = formatPhoneInput(value);
    }
    
    // dispatch update job input
    dispatch(handleChange({ name, value }));
  };

 

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
            type="tel"
            name="customerPhone"
            labelText="Customer Phone"
            value={customerPhone}
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
          <div className="form-row">
            <label htmlFor="employeeAssigned" className="form-label">
              Assign to Contractor
            </label>
            <select
              name="employeeAssigned"
              id="employeeAssigned"
              value={employeeAssigned}
              onChange={handleJobInput}
              className="form-select"
            >
              <option value="">Select Contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor._id} value={contractor._id}>
                  {contractor.firstName} {contractor.lastName} - {contractor.email}
                </option>
              ))}
            </select>
          </div>
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
            >
              clear
            </button>
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
