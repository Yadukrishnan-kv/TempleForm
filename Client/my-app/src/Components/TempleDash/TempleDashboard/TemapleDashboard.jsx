import React, { useEffect, useState } from 'react';
import '../../TempleDash/TempleDashboard/TempleDashboard.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import logo1 from '../../../assets/images/logo.png';

function TemapleDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Signin');
      return;
    }
    await fetchProfile(token);
  };

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${ip}/api/UserRoutes/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setFullName(response.data.fullName);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/Signin';
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`Templedashcontainerrr ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="Templedashcontainer">
        <aside className={`Templedashsidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="Templedashlogo">
            {/* <img className="sidebar-brand_icon" src={logo1} alt="Logo" height={70} /> */}
          </div>
          <nav className="Templedashside-menu">
            <Link to="/TemapleDash" 
                  title={isSidebarCollapsed ? "Dashboard" : ""} 
                  className={`Templedashside-link ${location.pathname === '/TemapleDash' ? 'active' : ''}`}>
              <i className="fa fa-clock"></i>
              {!isSidebarCollapsed && 'Dashboard'}
            </Link>
            <hr />
            <Link to="/FormDetails" 
                  title={isSidebarCollapsed ? "Form Details" : ""} 
                  className={`Templedashside-link ${location.pathname === '/FormDetails' ? 'active' : ''}`}>
              <i className="fa fa-plus"></i>
              {!isSidebarCollapsed && 'Form Details'}
            </Link>
            <Link to="/PoojaForm" 
                  title={isSidebarCollapsed ? "Pooja Form" : ""} 
                  className={`Templedashside-link ${location.pathname === '/PoojaForm' ? 'active' : ''}`}>
              <i className="fa fa-message"></i>
              {!isSidebarCollapsed && 'Pooja Form'}
            </Link>
            <Link to="/VazhipadForm" 
                  title={isSidebarCollapsed ? "Vazhipad Form" : ""} 
                  className={`Templedashside-link ${location.pathname === '/VazhipadForm' ? 'active' : ''}`}>
              <i className="fa fa-star"></i>
              {!isSidebarCollapsed && 'Vazhipad Form'}
            </Link>
            <Link to="/VazhipadBookings" 
                  title={isSidebarCollapsed ? "Bookings" : ""} 
                  className={`Templedashside-link ${location.pathname === '/VazhipadBookings' ? 'active' : ''}`}>
              <i className="fa fa-calendar"></i>
              {!isSidebarCollapsed && 'Bookings'}
            </Link>
            <Link to="/subscriptionPayment" 
                  title={isSidebarCollapsed ? "Subscription" : ""} 
                  className={`Templedashside-link ${location.pathname === '/subscriptionPayment' ? 'active' : ''}`}>
              <i className="fa fa-list"></i>
              {!isSidebarCollapsed && 'Subscription'}
            </Link>
            <Link to="/UserProfile" 
                  title={isSidebarCollapsed ? "Profile" : ""} 
                  className="Templedashside-link">
              <i className="fa fa-user-edit"></i>
              {!isSidebarCollapsed && 'Profile'}
            </Link>
            <a href="#" onClick={handleLogout} title={isSidebarCollapsed ? "Logout" : ""} className="Templedashside-link">
              <i className="fa fa-sign-out"></i>
              {!isSidebarCollapsed && 'Logout'}
            </a>
          </nav>
        </aside>

        <main className="Templedashmain-content">
          <header className="Templedashnavbar">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="fa fa-bars"></i>
            </button>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/TemplePage">Temples</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
          
          </header>
        </main>
      </div>
    </div>
  );
}

export default TemapleDashboard;
