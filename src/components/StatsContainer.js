import StatItem from "./StatItem";
import { 
  FaSuitcaseRolling, 
  FaCalendarCheck, 
  FaTools, 
  FaCheckCircle,
  FaDollarSign,
  FaBan
} from "react-icons/fa"; 
import Wrapper from "../assets/wrappers/StatsContainer";
import { useSelector } from "react-redux";

const StatsContainer = () => {
  const {stats} = useSelector((store) => store.allJobs);
  const defaultStats = [
    {
      title: "total jobs",
      count: stats?.totalJobs || 0,
      icon: <FaSuitcaseRolling />,
      color: "#647acb",
      bcg: "#e0e8ff"
    },
    {
      title: "active",
      count: stats?.active || 0,
      icon: <FaCalendarCheck />,
      color: "#4bb07a",
      bcg: "#e8f5f1"
    },
    {
      title: "in progress",
      count: stats?.['in progress'] || 0,
      icon: <FaTools />,
      color: "#f9c74f",
      bcg: "#fefaf0"
    },
    {
      title: "completed",
      count: stats?.completed || 0,
      icon: <FaCheckCircle />,
      color: "#06d6a0",
      bcg: "#d7f5ed"
    },
    {
      title: "payment pending",
      count: stats?.['payment pending'] || 0,
      icon: <FaDollarSign />,
      color: "#e63946",
      bcg: "#fde8e9"
    },
    {
      title: "cancelled",
      count: stats?.cancelled || 0,
      icon: <FaBan />,
      color: "#6c757d",
      bcg: "#e9ecef"
    }
  ];
  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
}
 
export default StatsContainer;