import { FaClipboardList } from "react-icons/fa";
import { MdQueryStats } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

const links = [
  {
    id: 1,
    text: "Stats",
    path: "/",
    icon: <FaClipboardList />,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    id: 2,
    text: "All Jobs",
    path: "all-jobs",
    icon: <MdQueryStats />,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    id: 3,
    text: "Add Job",
    path: "add-job",
    icon: <MdOutlinePostAdd />,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    id: 4,
    text: "My Jobs",
    path: "contractor-dashboard",
    icon: <FaTasks />,
    allowedRoles: ["contractor"],
  },
  {
    id: 5,
    text: "Calendar",
    path: "calendar",
    icon: <FaCalendarAlt />,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    id: 6,
    text: "Messages",
    path: "messages",
    icon: <FaEnvelope />,
    allowedRoles: ["admin", "receptionist", "contractor"],
  },
  {
    id: 7,
    text: "Notifications",
    path: "notifications",
    icon: <FaBell />,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    id: 8,
    text: "Manage Employees",
    path: "manage-employees",
    icon: <FaUsers />,
    allowedRoles: ["admin"],
  },
  {
    id: 9,
    text: "Analytics",
    path: "analytics",
    icon: <FaChartLine />,
    allowedRoles: ["admin"],
  },
  {
    id: 10,
    text: "Profile",
    path: "profile",
    icon: <ImProfile />,
    allowedRoles: ["admin", "receptionist", "contractor"],
  },
];

export default links;