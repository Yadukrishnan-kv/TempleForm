import React, { useState } from 'react';
import './Header.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';


function Header() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/AdminLogin';
    
  };
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header className="header">
      

      <div className="header-right">
       
        {/* <div className='header-leftdiv'>
          <button className="icon-button"><IoIosNotificationsOutline /></button>
        </div> */}
        <div className="user-menu" onClick={() => document.getElementById('dropdown').classList.toggle('show')}>
        <button className="icon-button" style={{fontSize:"28px"}}><FaUserCircle /></button>
        <div id="dropdown" className="dropdown">
          <Link to="/admin/profile" className="dropdown-item"><span>Profile</span></Link>
          <hr className='dropdownhr' />
          <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
        </div>
        </div>
       
      </div>
    </header>
  );
}

export default Header;

