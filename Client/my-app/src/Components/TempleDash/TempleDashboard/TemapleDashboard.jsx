import React, { useEffect, useState } from 'react'
import '../../TempleDash/TempleDashboard/TempleDashboard.css'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

import logo1 from '../../../assets/images/logo.png';
import axios from 'axios';



function TemapleDashboard() {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [profile, setProfile] = useState(null)
      const [isEditing, setIsEditing] = useState(false)
      const [fullName, setFullName] = useState("")
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [error, setError] = useState("")
      const navigate = useNavigate()
      const location = useLocation();

      const ip = process.env.REACT_APP_BACKEND_IP


  useEffect(() => {
    checkAuthAndFetchProfile()
  }, [])

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/Signin")
      return
    }
    await fetchProfile(token)
  }

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${ip}/api/UserRoutes/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(response.data)
      setFullName(response.data.fullName)
      setEmail(response.data.email)
    } catch (error) {
      console.error("Error fetching profile:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      } else {
        setError("Failed to fetch profile data")
      }
    }
  }


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      };
      const { templeId } = useParams()

      const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/Signin';
        
      };




      return (
    
   <div class="Templedashcontainerrr">
 
 <div class="Templedashcontainer">
    
    <aside class="Templedashsidebar">
      <div class="Templedashlogo"> <img
                   className="sidebar-brand_icon"
                   src={logo1}
                   alt="Logo"
                   height={70}
                 /></div>
      <nav class="Templedashside-menu">
            <Link to="/TemapleDash" className={`Templedashside-link ${location.pathname === '/TemapleDash' ? 'active' : ''}`} style={{ textDecoration: "none" }}>
             <i class="fa fa-clock"></i> Dashboard </Link>
        <hr/>
            <Link to="/FormDetails" className={`Templedashside-link ${location.pathname === '/FormDetails' ? 'active' : ''}`} style={{ textDecoration: "none" }}>
         <i class="fa fa-plus"></i> Form Details
        </Link>
        <Link to={'/PoojaForm'} className={`Templedashside-link ${location.pathname === '/PoojaForm' ? 'active' : ''}`} style={{textDecoration:"none"}}>
         <i class="fa fa-message"></i> Pooja Form 
        </Link>
        <Link to={'/VazhipadForm'} className={`Templedashside-link ${location.pathname === '/VazhipadForm' ? 'active' : ''}`} style={{textDecoration:"none"}}>
        <i class="fa fa-star"></i> Vazhipad Form
        </Link>
        <Link to={'/VazhipadBookings'} className={`Templedashside-link ${location.pathname === '/VazhipadBookings' ? 'active' : ''}`} style={{textDecoration:"none"}}>
       <i class="fa fa-calendar"></i> Bookings
        </Link>
        <Link to={'/subscriptionPayment'} className={`Templedashside-link ${location.pathname === '/subscriptionPayment' ? 'active' : ''}`} style={{textDecoration:"none"}}>
        <i class="fa fa-list"></i> subscription
        </Link>
       
       
         <Link to={'/UserProfile'} style={{textDecoration:"none"}}>
     <i class="fa fa-user-edit"></i>Profile
       </Link>
        <a href="#" onClick={handleLogout}>Logout</a>
         </nav>
    </aside>

  
    <main class="Templedashmain-content">
      <header class="Templedashnavbar">
        <button class="menu-toggle"><i class="fa fa-bars"></i></button>
        <nav>
             <Link to={'/'} style={{textDecoration:"none"}}>Home </Link>
             <Link to={'/VazhipadBookings'} style={{textDecoration:"none"}}>Dashboard </Link>
             <Link to={'/about'} style={{textDecoration:"none"}}>
          About Us </Link>
             <Link to={'/contact'} style={{textDecoration:"none"}}>Contact Us </Link>
        </nav>
        <div class="Templedashprofile">
          
          <span>{fullName}<br/><small>{email}</small></span>
        </div>
      </header>

     
    </main>
  </div>
  
</div>
  )
}

export default TemapleDashboard