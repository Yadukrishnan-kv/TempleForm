import React, { useState } from 'react';
import './Header.css';
import { CiCalendar, CiSearch } from "react-icons/ci";
import { PiNotePencil } from "react-icons/pi";
import { TbMessageCircle } from "react-icons/tb";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdMarkEmailUnread } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";

function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className='header-leftdiv'>
          <button className="icon-button"><CiCalendar /></button>
        </div>
        <div className='header-leftdiv'>
          <button className="icon-button"><PiNotePencil /></button>
        </div>
        <div className='header-leftdiv'>
          <button className="icon-button"><TbMessageCircle /></button>
        </div>
        <div className={`search-bar ${isSearchVisible ? 'visible' : ''}`}>
          <input type="text" placeholder="Search..." />
          <button type="submit"><CiSearch /></button>
        </div>
      </div>

      <div className="header-right">
        <div className='header-leftdiv'>
          <button className="icon-button"><BsBrightnessHigh /></button>
        </div>
        <div className='header-leftdiv'>
          <button className="icon-button"><MdMarkEmailUnread /></button>
        </div>
        <div className='header-leftdiv'>
          <button className="icon-button"><IoIosNotificationsOutline /></button>
        </div>
        <div className="user-menu">
          {/* User avatar can be added here */}
        </div>
        <button className="search-toggle" onClick={toggleSearch}>
          <CiSearch />
        </button>
      </div>
    </header>
  );
}

export default Header;

