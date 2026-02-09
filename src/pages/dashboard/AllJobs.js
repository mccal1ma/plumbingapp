import { JobsContainer, SearchContainer } from '../../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AllJobs = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect contractors to their dashboard
    if (user?.role === 'contractor') {
      navigate('/contractor-dashboard');
    }
  }, [user, navigate]);

  return (
    <div>
      <SearchContainer />
      <JobsContainer />
    </div>
  );
};

export default AllJobs;
