import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {showStats} from "../../features/allJobs/allJobsSlice";
import {Loading, StatsContainer, ChartsContainer} from "../../components";

const Stats = () => {
  const { isLoading, montlyAppointments } = useSelector((store) => store.allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showStats());
  }, []);
  if(isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainer />
      {montlyAppointments.length > 0 && <ChartsContainer />}
    </>
  )
}

export default Stats;
