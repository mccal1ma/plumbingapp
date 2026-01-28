import StatItem from "./StatItem";
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa"; 
import Wrapper from "../assets/wrappers/StatsContainer";
import { useSelector } from "react-redux";

const StatsContainer = () => {
  const {stats} = useSelector((store) => store.allJobs);
  const defaultStats = [
    {
      title: "total jobs",
      count: stats.totalJobs,
      icon: <FaSuitcaseRolling />,
      color: "#647acb",
      bcg: "#e0e8ff"
    },
    {
      title: "upcoming appointments",
      count: stats.upcomingAppointments,
      icon: <FaCalendarCheck />,
      color: "#4bb07a",
      bcg: "#e8f5f1"
    },
    {
      title: "pending jobs",
      count: stats.pendingJobs,
      icon: <FaBug />,
      color: "#f9c74f",
      bcg: "#fefaf0"
    }
  ];
  return (
    <Wrapper>
      <div className="stats-center">
        {defaultStats.map((item, index) => {
          return <StatItem key={index} {...item} />;
        })}
      </div>
    </Wrapper>
  );
}
 
export default StatsContainer;