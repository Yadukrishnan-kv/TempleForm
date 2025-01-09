import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiHome3Fill } from "react-icons/ri";
import { MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { SlCursor } from "react-icons/sl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog, faCalendarCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { IoLogoBuffer } from "react-icons/io";
import axios from "axios";
import "./Sidebar.css";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [userPermissions, setUserPermissions] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const ip = process.env.REACT_APP_BACKEND_IP;

  const logMenuAction = async (module, subModule = null) => {
    // Only log if we have a specific subModule
    if (!subModule) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${ip}/api/adminlogin/log-menu`, {
        module,
        subModule,
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error logging menu action:', error);
    }
  };

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const handleSubmenuClick = async (module, subModule) => {
    await logMenuAction(module, subModule);
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
              <Link 
                to="/Dashboard" 
                onClick={() => handleSubmenuClick("Dashboard", "Dashboard View")}
              >
                <RiHome3Fill style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Dashboard</span>
              </Link>
            </li>
          )}

          {/* Users Menu Item */}
          {hasPermission('users') && (
            <li className={`menu-item has-submenu ${activeMenu === "users" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("users")}
              >
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
                  <li>
                    <Link 
                      to="/listusers"
                      onClick={() => handleSubmenuClick("Users", "List Users")}
                    >
                      List Users
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/usersrole"
                      onClick={() => handleSubmenuClick("Users", "Role")}
                    >
                      Role
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Registration Menu Item */}
          {hasPermission('registration') && (
            <li className={`menu-item has-submenu ${activeMenu === "registration" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("registration")}
              >
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
                  <li>
                    <Link 
                      to="/AddSubmission"
                      onClick={() => handleSubmenuClick("Registration", "Add Form")}
                    >
                      Add form
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/SortSubmission"
                      onClick={() => handleSubmenuClick("Registration", "List Details")}
                    >
                      List Details
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Log Menu Item */}
          {hasPermission('log') && (
            <li className={`menu-item has-submenu ${activeMenu === "log" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("log")}
              >
                <IoLogoBuffer style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
                <span className="menu-name">Log</span>
                {openSubmenus.log ? (
                  <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
                ) : (
                  <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
                )}
              </button>
              {openSubmenus.log && (
                <ul className="submenu">
                  <li>
                    <Link 
                      to="/log"
                      onClick={() => handleSubmenuClick("Log", "Log Details")}
                    >
                      Log Details
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Master Menu Item */}
          {hasPermission('master') && (
            <li className={`menu-item has-submenu ${activeMenu === "master" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("master")}
              >
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
                  <li>
                    <Link 
                      to="/addstate"
                      onClick={() => handleSubmenuClick("Master", "Manage States")}
                    >
                      Manage States
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/adddistrict"
                      onClick={() => handleSubmenuClick("Master", "Manage Districts")}
                    >
                      Manage Districts
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/addtaluk"
                      onClick={() => handleSubmenuClick("Master", "Manage Taluks")}
                    >
                      Manage Taluks
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Blog Page Menu Item */}
          {hasPermission('blogPage') && (
            <li className={`menu-item has-submenu ${activeMenu === "blogPage" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("blogPage")}
              >
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
                  <li>
                    <Link 
                      to="/BlogPage"
                      onClick={() => handleSubmenuClick("Blog", "List Blogs")}
                    >
                      List Blogs
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Enquiry Menu Item */}
          {hasPermission('enquiry') && (
            <li className={`menu-item has-submenu ${activeMenu === "enquiry" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("enquiry")}
              >
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
                  <li>
                    <Link 
                      to="/EnquiryPage"
                      onClick={() => handleSubmenuClick("Enquiry", "List Enquiry")}
                    >
                      List Enquiry
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Bookings Menu Item */}
          {hasPermission('bookings') && (
            <li className={`menu-item has-submenu ${activeMenu === "bookings" ? "active" : ""}`}>
              <button 
                className="menu-toggle1" 
                onClick={() => toggleSubmenu("bookings")}
              >
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
                  <li>
                    <Link 
                      to="/BookingsPage"
                      onClick={() => handleSubmenuClick("Bookings", "List Bookings")}
                    >
                      List Bookings
                    </Link>
                  </li>
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

