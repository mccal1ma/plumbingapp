import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import links from "../utils/links";

const NavLinks = ({ toggleSidebar }) => {
  const { user } = useSelector((store) => store.user);
  const userRole = user?.role || "receptionist";

  // Filter links based on user role
  const filteredLinks = links.filter((link) => {
    return link.allowedRoles.includes(userRole);
  });

  return (
    <div className="nav-links">
      {filteredLinks.map((link) => {
        const { id, text, path, icon } = link;
        return (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;