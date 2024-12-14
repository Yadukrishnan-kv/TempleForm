import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiHome3Fill } from "react-icons/ri";
import { MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
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
          <li className={`menu-item has-submenu ${activeMenu === "registration" ? "active" : ""}`}>
            <button className="menu-toggle" onClick={() => toggleSubmenu("registration")}>
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
                  <Link to="/form">List Details</Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`menu-item has-submenu ${activeMenu === "sort" ? "active" : ""}`}>
            <button className="menu-toggle" onClick={() => toggleSubmenu("sort")}>
              <MdOutlineAppRegistration style={{ fontSize: "25px", color: "rgb(85, 139, 47)" }} />
              <span className="menu-name">Sort</span>
              {openSubmenus.sort ? (
                <AiOutlineDown style={{ marginLeft: "auto", fontSize: "18px" }} />
              ) : (
                <AiOutlineRight style={{ marginLeft: "auto", fontSize: "18px" }} />
              )}
            </button>
            {openSubmenus.sort && (
              <ul className="submenu">
                <li>
                  <Link to="/SortSubmission">List Sort</Link>
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

