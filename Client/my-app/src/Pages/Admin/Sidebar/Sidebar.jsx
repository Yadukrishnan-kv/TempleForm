import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiHome3Fill } from "react-icons/ri";
import { MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { SlCursor } from "react-icons/sl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog, faCalendarCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.css";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Temple</h1>
      </div>
      <nav>
        <ul>
          <li className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}>
            <Link to="/Dashboard" onClick={() => toggleMenu("dashboard")}>
              <RiHome3Fill style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Dashboard</span>
              
            </Link>
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "Users" ? "active" : ""}`}>
            
            <button className="menu-toggle1" onClick={() => toggleSubmenu("Users")}>
              
              <FontAwesomeIcon icon= {faUsers}  style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Users</span>
              {openSubmenus.Users ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.Users && (
              <ul className="submenu">
                 <li>
                  <Link to="/listusers">List Users</Link>
                </li>
                <li>
                  <Link to="/usersrole">Role</Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "sort" ? "active" : ""}`}>
            
            <button className="menu-toggle1" onClick={() => toggleSubmenu("sort")}>
              
              <MdOutlineAppRegistration style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Registration</span>
              {openSubmenus.sort ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.sort && (
              <ul className="submenu">
                 <li>
                  <Link to="/AddSubmission">Add form</Link>
                </li>
                <li>
                  <Link to="/SortSubmission">List Details</Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "master" ? "active" : ""}`}>
            <button className="menu-toggle1" onClick={() => toggleSubmenu("master")}>
            <SlCursor 
            style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">master</span>
              {openSubmenus.master ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.master && (
              <ul className="submenu">
                <li>
                  <Link to="/addstate">Manage States</Link>
                </li>
                <li>
                  <Link to="/adddistrict">Manage Districts</Link>
                </li>
                <li>
                  <Link to="/addtaluk">Manage Taluks</Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "BlogPage" ? "active" : ""}`}>
            
            <button className="menu-toggle1" onClick={() => toggleSubmenu("BlogPage")}>
              
            <FontAwesomeIcon icon={faBlog} 
            style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">BlogPage</span>
              {openSubmenus.BlogPage ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.BlogPage && (
              <ul className="submenu">
                 <li>
                  <Link to="/BlogPage">List Blogs</Link>
                </li>
               
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "Enquiry" ? "active" : ""}`}>
            
            <button className="menu-toggle1" onClick={() => toggleSubmenu("Enquiry")}>
              
            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Enquiry</span>
              {openSubmenus.Enquiry ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.Enquiry && (
              <ul className="submenu">
                 <li>
                  <Link to="/EnquiryPage">List Enquiry</Link>
                </li>
               
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "BookingsPage" ? "active" : ""}`}>
            
            <button className="menu-toggle1" onClick={() => toggleSubmenu("BookingsPage")}>
              
            <FontAwesomeIcon icon={faCalendarCheck} 
            style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Bookings</span>
              {openSubmenus.BookingsPage ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.BookingsPage && (
              <ul className="submenu">
                 <li>
                  <Link to="/BookingsPage">List Bookings</Link>
                </li>
               
              </ul>
            )}
          </li>
          
        </ul>
        
      </nav>
    </div>
  );
}

export default Sidebar;

