import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiHome3Fill } from "react-icons/ri";
import { MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { SlCursor } from "react-icons/sl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog, faCalendarCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Sidebar.css";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [userPermissions, setUserPermissions] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const ip = process.env.REACT_APP_BACKEND_IP;

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${ip}/api/adminlogin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserPermissions(response.data.menuPermissions);
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const hasPermission = (menuId) => {
    if (userRole === 'admin') return true;
    return userPermissions?.[menuId] === true;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Temple</h1>
      </div>
      <nav>
        <ul>
          {/* Dashboard Menu Item */}
          {hasPermission('dashboard') && (
            <li className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}>
              <Link to="/Dashboard" onClick={() => toggleMenu("dashboard")}>
                <RiHome3Fill style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Dashboard</span>
              </Link>
            </li>
          )}

          {/* Users Menu Item */}
          {hasPermission('users') && (
            <li className={`menu-item has-submenu ${activeMenu === "users" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("users")}>
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Users</span>
                {openSubmenus.users ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.users && (
                <ul className="submenu">
                  <li><Link to="/listusers">List Users</Link></li>
                  <li><Link to="/usersrole">Role</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Registration Menu Item */}
          {hasPermission('registration') && (
            <li className={`menu-item has-submenu ${activeMenu === "registration" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("registration")}>
                <MdOutlineAppRegistration style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Registration</span>
                {openSubmenus.registration ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.registration && (
                <ul className="submenu">
                  <li><Link to="/AddSubmission">Add form</Link></li>
                  <li><Link to="/SortSubmission">List Details</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Master Menu Item */}
          {hasPermission('master') && (
            <li className={`menu-item has-submenu ${activeMenu === "master" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("master")}>
                <SlCursor style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Master</span>
                {openSubmenus.master ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.master && (
                <ul className="submenu">
                  <li><Link to="/addstate">Manage States</Link></li>
                  <li><Link to="/adddistrict">Manage Districts</Link></li>
                  <li><Link to="/addtaluk">Manage Taluks</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Blog Page Menu Item */}
          {hasPermission('blogPage') && (
            <li className={`menu-item has-submenu ${activeMenu === "blogPage" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("blogPage")}>
                <FontAwesomeIcon icon={faBlog} style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Blog Page</span>
                {openSubmenus.blogPage ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.blogPage && (
                <ul className="submenu">
                  <li><Link to="/BlogPage">List Blogs</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Enquiry Menu Item */}
          {hasPermission('enquiry') && (
            <li className={`menu-item has-submenu ${activeMenu === "enquiry" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("enquiry")}>
                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Enquiry</span>
                {openSubmenus.enquiry ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.enquiry && (
                <ul className="submenu">
                  <li><Link to="/EnquiryPage">List Enquiry</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Bookings Menu Item */}
          {hasPermission('bookings') && (
            <li className={`menu-item has-submenu ${activeMenu === "bookings" ? "active" : ""}`}>
              <button className="menu-toggle1" onClick={() => toggleSubmenu("bookings")}>
                <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Bookings</span>
                {openSubmenus.bookings ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.bookings && (
                <ul className="submenu">
                  <li><Link to="/BookingsPage">List Bookings</Link></li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;



