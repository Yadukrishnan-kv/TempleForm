import React from "react"
import { Heart, Phone, Mail, MapPin, Clock, Calendar, Info } from 'lucide-react'
import Navbar from "../HomePage/Navbar"
import Footer from "../HomePage/Footer"
import './TempleDetails.css'
import gallery01 from '../../assets/images/gallery01.jpg'
import gallery02 from '../../assets/images/gallery02.jpg'
import gallery03 from '../../assets/images/gallery03.jpg'

function TempleDetails() {
  const galleryImages = [
    {
      src: gallery01,
      alt: "Temple main view"
    },
    {
      src: gallery02,
      alt: "Temple side view"
    },
    {
      src: gallery03, 
      alt: "Temple interior"
    }
  ]

  const poojaTimings = [
    { time: "3:00 AM - 4:30 AM", name: "Nirmalya Darshanam" },
    { time: "4:30 AM - 5:00 AM", name: "Abhishekam" },
    { time: "5:00 AM - 6:30 AM", name: "Ganapathi Homam" },
    { time: "6:30 AM - 7:00 AM", name: "Usha Pooja" },
    { time: "7:00 AM - 8:30 AM", name: "Morning Sheeveli" },
    { time: "8:30 AM - 10:00 AM", name: "Prasanna Pooja" },
    { time: "11:30 AM - 12:30 PM", name: "Uccha Pooja" },
    { time: "4:30 PM - 6:00 PM", name: "Deeparadhana" },
    { time: "7:00 PM - 8:30 PM", name: "Evening Sheeveli" },
    { time: "8:30 PM - 9:15 PM", name: "Athazha Pooja" }
  ]

  const facilities = [
    "Free Parking",
    "Wheelchair Accessibility",
    "Prasadam Counter",
    "Rest Rooms",
    "Drinking Water",
    "Shoe Stand",
    "Cloak Room",
    "Medical Facility",
    "Information Center",
    "Book Store"
  ]

  return (
    <div className="temple-details">
      <Navbar/>

      <main>
        {/* Temple Header Section */}
        <div className="header-section">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="temple-title">Guruvayur Shri Krishna Temple</h1>
                <ul className="temple-info list-unstyled d-flex flex-wrap  ">
                  <li className="d-flex align-items-center">
                    Thrissur
                  </li>
                  <li className="d-flex align-items-center">
                    3:00 AM - 12:30 PM, 4:30 PM - 9:15 PM, All days open
                </li>
                </ul>
              </div>
              <div className="col-md-4 text-md-end">
               <span style={{ marginRight: "90px" }}>
               <Heart className="icon" />
               Save this listing
               </span>
               <p className="bookmark-count mt-2">
               46 people bookmarked this place
               </p> 
            </div>
            </div>
          </div>
        </div>

        {/* Temple Gallery Section */}
        <div className="container py-4">
          <div className="gallery-section">
            <div className="row g-3">
              <div className="col-md-8">
                <img 
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  className="main-image"
                />
              </div>
              <div className="col-md-4">
                <div className="row g-3">
                  {galleryImages.slice(1, 3).map((image, index) => (
                    <div key={index} className="col-12">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="side-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
      <div className="container">
        <div className="row">
          {/* Main Content Section */}
          <div className="col-lg-8 content">
            <div className="mb-4">
              <h4 className="fw-semibold fs-3 mb-4">About Guruvayur</h4>
              <p>
                Guruvayur Temple is a Hindu temple dedicated to Guruvayurappan (four-armed form of the Vishnu), located
                in the town of Guruvayur in Kerala, India. Administrated by the Guruvayur Devaswom Board, it is one of
                the most important places of worship for Hindus in Kerala and Tamil Nadu and is often referred to as
                Bhuloka Vaikunta (Holy Abode of Vishnu on Earth).
              </p>
              <p>
                The temple is classified among the 108 Abhimana Kshethram of Vaishnavate tradition. The central icon is
                a four-armed standing Vishnu carrying the conch Panchajanya, the discus Sudarshana, the mace Kaumodaki,
                and a lotus with a tulasi garland.
              </p>
            </div>

            {/* Nearest Section */}
            <div className="mb-4">
              <h4 className="fw-semibold fs-3 mb-4">Nearest</h4>
              <div className="row g-4">
                {[
                  { icon: 'fa-bus', label: 'Bus Stand' },
                  { icon: 'fa-plane', label: 'Airport' },
                  { icon: 'fa-train', label: 'Railway Station' }
                ].map((item, index) => (
                  <div className="col-auto col-lg-3" key={index}>
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className={`fa-solid ${item.icon} fs-18`}></i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-5" />
            <div style={{display:"flex"}}>
            {/* Pooja Timings Section */}
            <div className="mb-4">
              <h4 className="fw-semibold fs-3 mb-4">Pooja Timings</h4>
              <div className="row">
                <div className="col-sm-6">
                  {[
                    { title: 'Nirmalyam', time: '3:00 AM to 3:30 AM' },
                    { title: 'Oilabhishekam, Vakacharthu, Sankhabhishekam', time: '3:20 AM to 3:30 AM' },
                    { title: 'Malar Nivedyam, Alankaram', time: '3:30 AM to 4:15 AM' },
                    { title: 'Usha Nivedyam', time: '4:15 AM to 4:30 AM' },
                    { title: 'Ethirettu Pooja followed by Usha Pooja', time: '4:30 AM to 6:15 AM' }
                  ].map((pooja, index) => (
                    <div className="menu pb-2" key={index}>
                      <h4 className="fs-17 mb-0 menu-title">{pooja.title}</h4>
                      <div className="fs-14 menu-detail text-muted">{pooja.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="fw-semibold fs-3 mb-4">Pooja Timings</h4>
              <div className="row">
                <div className="col-sm-6">
                  {[
                    { title: 'Nirmalyam', time: '3:00 AM to 3:30 AM' },
                    { title: 'Oilabhishekam, Vakacharthu, Sankhabhishekam', time: '3:20 AM to 3:30 AM' },
                    { title: 'Malar Nivedyam, Alankaram', time: '3:30 AM to 4:15 AM' },
                    { title: 'Usha Nivedyam', time: '4:15 AM to 4:30 AM' },
                    { title: 'Ethirettu Pooja followed by Usha Pooja', time: '4:30 AM to 6:15 AM' }
                  ].map((pooja, index) => (
                    <div className="menu pb-2" key={index}>
                      <h4 className="fs-17 mb-0 menu-title">{pooja.title}</h4>
                      <div className="fs-14 menu-detail text-muted">{pooja.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
            
          </div>

          {/* Sidebar Section */}
          <div className="col-lg-4 ps-xxl-5 ">
            {/* Booking Form */}
            <div className="border mb-4 p-4 rounded-4">
              <h4 className="fw-semibold mb-4">
                Book <span className="font-caveat text-primary">online</span>
              </h4>
              <form className="row g-4">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label className="required fw-medium mb-2">Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter your name" required />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label className="required fw-medium mb-2">Email Address</label>
                    <input type="text" className="form-control" placeholder="Enter your email address" />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label className="required fw-medium mb-2">Comment</label>
                    <textarea
                      className="form-control"
                      rows="7"
                      placeholder="Tell us what we can help you with!"
                    ></textarea>
                  </div>
                </div>
                <div className="col-sm-12">
                  <button type="submit" className="btn btn-primary w-100">
                    Book Now
                  </button>
                </div>
              </form>
            </div>

            {/* Opening Hours */}
            <div className="border p-4 rounded-4">
              <h4 className="fw-semibold mb-4">
                Opening <span className="font-caveat text-primary">Hours</span>
              </h4>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Monday</span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Tuesday</span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Wednesday</span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Thursday
                </span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Friday</span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Saturday
                </span>
                <span className="fs-14">8:00 AM - 6:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">Sunday</span>
                <span className="fs-14">Close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

          {/* Facilities Section */}
          <div className="content-section mt-4">
            <div className="content-card">
              <h2 className="section-title">Temple Facilities</h2>
              <div className="row g-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="col-md-4">
                    <div className="facility-card">
                      <div className="facility-dot"></div>
                      <span>{facility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="content-section mt-4 mb-4">
            <div className="content-card">
              <h2 className="section-title">Contact Information</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone className="icon" />
                  <div>
                    <h3>Phone</h3>
                    <p>+91 487 255 2338</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Mail className="icon" />
                  <div>
                    <h3>Email</h3>
                    <p>info@guruvayurtemple.org</p>
                  </div>
                </div>
                <div className="contact-item">
                  <MapPin className="icon" />
                  <div>
                    <h3>Address</h3>
                    <p>East Nada, Guruvayur, Kerala 680101, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  )
}

export default TempleDetails;





