import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {showStats} from "../../features/allJobs/allJobsSlice";
import {Loading, StatsContainer, ChartsContainer} from "../../components";
import {useNavigate} from "react-router-dom";

const Stats = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { isLoading, montlyAppointments } = useSelector((store) => store.allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirect contractors to their dashboard
    if (user?.role === 'contractor') {
      navigate('/contractor-dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(showStats());
  }, []);
  
  if(isLoading) {
    return <Loading center />;
  }
  
  return (
    <>
      <StatsContainer />
      {montlyAppointments && montlyAppointments.length > 0 && <ChartsContainer />}
    </>
  )
}

export default Stats;
