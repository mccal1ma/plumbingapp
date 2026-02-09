import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown, FaBell } from "react-icons/fa";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, toggleSidebar } from "../features/user/userSlice";
import { clearStore } from "../features/user/userSlice";
import { getUnreadCount } from "../features/notifications/notificationsSlice";

const NavBar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((store) => store.user);
  const { unreadCount } = useSelector((store) => store.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch for contractors and receptionists
    if (user?.role === 'contractor' || user?.role === 'receptionist') {
      dispatch(getUnreadCount());
      
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        dispatch(getUnreadCount());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>
        <div className="btn-container">
          {(user?.role === 'contractor' || user?.role === 'receptionist') && (
            <div 
              style={{ position: 'relative', marginRight: '1rem', cursor: 'pointer' }}
              onClick={() => {
                if (user?.role === 'receptionist') {
                  navigate('/notifications');
                } else {
                  navigate('/contractor-dashboard');
                }
              }}
            >
              <FaBell style={{ fontSize: '1.5rem', color: 'var(--primary-500)' }} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: 'var(--red-dark)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.firstName}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => dispatch(clearStore("Logout successful"))}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NavBar;
