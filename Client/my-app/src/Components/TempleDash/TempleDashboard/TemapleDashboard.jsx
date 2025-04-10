import React, { useState } from 'react'
import '../../TempleDash/TempleDashboard/TempleDashboard.css'
import { Link, useParams } from 'react-router-dom';
import logo1 from '../../../assets/images/logo.png';



function TemapleDashboard() {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      };
      const { templeId } = useParams()

      const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/Signin';
        
      };
      return (
    
   <div>
 
 <div class="Templedashcontainer">
    
    <aside class="Templedashsidebar">
      <div class="Templedashlogo"> <img
                   className="sidebar-brand_icon"
                   src={logo1}
                   alt="Logo"
                   height={70}
                 /></div>
      <nav class="Templedashside-menu">
        <a href="#" class="active"><i class="fa fa-clock"></i> Dashboard</a>
        <hr/>
        <Link to={'/FormDetails'} style={{textDecoration:"none"}}>
            <a href="#" ><i class="fa fa-plus"></i> Form Details</a>
        </Link>
        <Link to={'/PoojaForm'} style={{textDecoration:"none"}}>
          <a href="#"><i class="fa fa-message"></i> PoojaForm </a>
        </Link>
        <Link to={'/subscriptionPayment'} style={{textDecoration:"none"}}>
        <a href="#"><i class="fa fa-list"></i> subscriptionPayment</a>
        </Link>
        <Link to={'/VazhipadForm'} style={{textDecoration:"none"}}>
        <a href="#"><i class="fa fa-star"></i> VazhipadForm</a>
        </Link>
        <Link to={'/VazhipadBookings'} style={{textDecoration:"none"}}>
        <a href="#"><i class="fa fa-calendar"></i> Bookings</a>
        </Link>

        <Link to={'/UserProfile'} style={{textDecoration:"none"}}>
             <a href="#"><i class="fa fa-user-edit"></i>Edit Profile</a>
       </Link>
        <a href="#"><i class="fa fa-user-edit" onClick={handleLogout} ></i>Logout</a>


      </nav>
    </aside>

  
    <main class="Templedashmain-content">
      <header class="Templedashnavbar">
        <button class="menu-toggle"><i class="fa fa-bars"></i></button>
        <nav>
          <a href="#">Home</a>
          <a href="#">Dashboard</a>
          <a href="#">Listing</a>
          <a href="#">Explore</a>
          <a href="#">Template</a>
        </nav>
        <div class="Templedashprofile">
          <i class="fa fa-expand"></i>
          <i class="fa fa-moon"></i>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
          <span>Naeem Khan<br/><small>[email protected]</small></span>
        </div>
      </header>

      <section class="form-section">
        <h2>Basic Informations</h2>
        <div class="form-row">
          <input type="text" placeholder="Listing Title *" />
          <select>
            <option>Category *</option>
          </select>
        </div>
        <input type="text" placeholder="Tags *" />
        <h2>Location</h2>
        <div class="form-row">
          <select>
            <option>Select City *</option>
          </select>
          <input type="text" placeholder="8706 Herrick Ave, Valley..." />
        </div>
        <div class="form-row">
          <select>
            <option>State *</option>
          </select>
          <input type="text" placeholder="Zip-Code *" />
        </div>
      </section>
    </main>
  </div>
  
</div>
  )
}

export default TemapleDashboard