import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './TempleDetails.css';
import Footer from '../HomePage/Footer';
import Navbar from '../HomePage/Navbar';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import VazhipadBookingModal from './VazhipadBookingModal';

const TempleDetails = () => {
  const params = useParams();
  const location = useLocation();
  
  // Debug logging
  console.log('URL params:', params);
  console.log('Current location:', location);
  
  // Try to get slug from params, fallback to templeId for backward compatibility
  const { slug, templeId } = params;
  const identifier = slug || templeId;
  
  console.log('Identifier:', identifier);
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [vazhipads, setVazhipads] = useState([]);
  const [selectedVazhipad, setSelectedVazhipad] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otherTemples, setOtherTemples] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    comment: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    if (identifier) {
      fetchTempleDetails();
    } else {
      setError('No temple identifier provided');
      setLoading(false);
    }
  }, [identifier]);

  const fetchTempleDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // Check if identifier looks like a MongoDB ObjectId (24 hex characters)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
      
      if (isObjectId) {
        // Use the old ID-based endpoint
        console.log('Fetching by ID:', identifier);
        response = await axios.get(`${ip}/api/temples/${identifier}`);
      } else {
        // Use the new slug-based endpoint
        console.log('Fetching by slug:', identifier);
        response = await axios.get(`${ip}/api/temples/slug/${identifier}`);
      }
      
      setTemple(response.data);
      console.log('Temple data:', response.data);
      
      // Only after we have the temple data with its ID, fetch related data
      if (response.data && response.data._id) {
        await Promise.all([
          fetchImages(response.data._id),
          fetchPoojas(response.data._id),
          fetchVazhipads(response.data._id),
          fetchOtherTemples(response.data.district, response.data._id)
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching temple details:', error);
      if (error.response?.status === 404) {
        setError('Temple not found');
      } else {
        setError('Error loading temple details');
      }
      setLoading(false);
    }
  };

  const fetchOtherTemples = async (district, currentTempleId) => {
    try {
      const response = await axios.get(`${ip}/api/temples/byDistrict/${district}`);
      const filteredTemples = response.data.filter(t => t._id !== currentTempleId);
      setOtherTemples(filteredTemples.slice(0, 4));
    } catch (error) {
      console.error('Error fetching other temples:', error);
    }
  };

  const fetchImages = async (templeId) => {
    if (!templeId) {
      console.error('No temple ID provided for fetching images');
      return;
    }
    
    try {
      console.log('Fetching images for temple ID:', templeId);
      const response = await axios.get(`${ip}/api/Gallery/temple/${templeId}`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchPoojas = async (templeId) => {
    if (!templeId) {
      console.error('No temple ID provided for fetching poojas');
      return;
    }
    
    try {
      console.log('Fetching poojas for temple ID:', templeId);
      const response = await axios.get(`${ip}/api/PoojaRoutes/GetPoojas/${templeId}`);
      setPoojas(response.data);
    } catch (error) {
      console.error("Error fetching poojas:", error);
    }
  };

  const fetchVazhipads = async (templeId) => {
    if (!templeId) {
      console.error('No temple ID provided for fetching vazhipads');
      return;
    }
    
    try {
      console.log('Fetching vazhipads for temple ID:', templeId);
      const response = await axios.get(`${ip}/api/VazhipadRoutes/GetVazhipads/${templeId}`);
      setVazhipads(response.data);
    } catch (error) {
      console.error("Error fetching vazhipads:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ip}/api/Bookings/Bookingsubmit`, {
        ...formData,
        templeId: temple?._id
      });
      setFormData({ fullName: '', email: '', comment: '' });
      setSubmitMessage('Message sent successfully!');
    } catch (error) {
      setSubmitMessage('Error submitting booking. Please try again.');
    }
  };

  const handleVazhipadClick = (vazhipad) => {
    setSelectedVazhipad(vazhipad);
    setIsModalOpen(true);
  };

  const carouselOptions = {
    items: 4,
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      992: { items: 3 },
      1200: { items: 4 }
    },
    navText: [
      '<button class="nav-button prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
      '<button class="nav-button next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'
    ]
  };

  if (loading) {
    return (
      <div className="temple-details">
        <Navbar/>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading temple details...</p>
        </div>
        <Footer/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="temple-details">
        <Navbar/>
        <div className="container py-5">
          <div className="text-center">
            <h2>Temple Not Found</h2>
            <p>{error}</p>
            <p className="text-muted">
              URL: {location.pathname}<br/>
              Identifier: {identifier || 'undefined'}
            </p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="temple-details">
      <Navbar/>
      
      {/* Details Header Section */}
      <div className="py-4">
        <div className="container">
          <div className="justify-content-between row align-items-center g-4">
            <div className="col-lg col-xxl-8">
              <h1 className="h2 page-header-title fw-semibold">{temple?.name}</h1>
              <ul className="list-inline list-separator d-flex align-items-center mb-2">
                <li className="list-inline-item">
                  <span>{temple?.district}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container">
        <div className="rounded-4 overflow-hidden">
          <div className="row gx-2">
            <div className="col-md-8">
              {images[2] && (
                <a className="d-block position-relative" href={`${ip}/${images[2].path}`}>
                  <img 
                    className="img-fluid w-100"  
                    style={{ height: '550px' }}
                    src={`${ip}/${images[2].path}`} 
                    alt={images[2].caption || "Gallery 1"} 
                  />
                  <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                    <span className="align-items-center btn btn-light btn-sm d-flex d-md-none fw-semibold gap-2">
                      <i className="fa-solid fa-expand"></i>
                      <span> View photos</span>
                    </span>
                  </div>
                </a>
              )}
            </div>
            <div className="col-md-4 d-none d-md-inline-block">
              {images[1] && (
                <a className="d-block mb-2" href={`${ip}/${images[1].path}`}>
                  <img 
                    className="img-fluid w-100" 
                    src={`${ip}/${images[1].path}`} 
                    alt={images[1].caption || "Gallery 2"} 
                  />
                </a>
              )}
              {images[0] && (
                <a className="d-block position-relative" href={`${ip}/${images[0].path}`}>
                  <img 
                    className="img-fluid w-100" 
                    style={{ height: '265px' }}
                    src={`${ip}/${images[0].path}`} 
                    alt={images[0].caption || "Gallery 3"} 
                  />
                  <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                    <span className="align-items-center btn btn-light btn-sm d-md-inline-flex d-none fw-semibold gap-2">
                      <i className="fa-solid fa-expand"></i>
                      <span> View photos</span>
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 content">
              {/* About Section */}
              <div className="mb-4">
                <h4 className="fw-semibold fs-3 mb-4">About {temple?.name}</h4>
                <p>{temple?.description}</p>
              </div>

              {/* Nearest Section */}
              <div className="mb-4">
                <h4 className="fw-semibold fs-3 mb-4">Nearest</h4>
                <div className="row g-4">
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-bus fs-18"></i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Bus Stand</div>
                    </div>
                  </div>
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-plane fs-18"></i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Airport</div>
                    </div>
                  </div>
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-train fs-18"></i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Railway station</div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-5" />

              {/* Pooja Timings Section */}
              <div className="mb-4">
                <div className="row">
                  <div className="col-sm-6">
                    <h4 className="fw-semibold fs-3 mb-4">Pooja Timings</h4>
                    {poojas.map((pooja) => (
                      <div className="mb-3 menu pb-2" key={pooja._id}>
                        <div className="row">
                          <div className="col-sm-8">
                            <h4 className="fs-5 mb-0 menu-title">{pooja.name}</h4>
                            <div className="menu-detail text-muted">{pooja.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-sm-6">
                    <h4 className="fw-semibold fs-3 mb-4">Vazhipad</h4>
                    {vazhipads.map((vazhipad) => (
                      <div
                        className="mb-3 menu pb-2"
                        key={vazhipad._id}
                        onClick={() => handleVazhipadClick(vazhipad)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="row">
                          <div className="col-sm-8">
                            <h4 className="fs-5 mb-0 menu-title">{vazhipad.name}</h4>
                            <div className="menu-detail text-muted">₹{vazhipad.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {isModalOpen && (
                <VazhipadBookingModal 
                  vazhipad={selectedVazhipad} 
                  onClose={() => setIsModalOpen(false)} 
                  templeId={temple?._id} 
                />
              )}
            </div>
            
            <div className="col-lg-4 ps-xxl-5">
              {/* Opening Hours */}
              <div className="border p-4 rounded-4">
                <div className="align-items-center d-flex justify-content-between mb-4">
                  <h4 className="w-semibold mb-0">Opening <span className="font-caveat text-primary">Hours</span></h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                  </svg>
                </div>
                <div className="align-items-center d-flex justify-content-between mb-3">
                  <span className="fw-semibold">Morning</span>
                  <span className="fw-semibold">{temple?.darshanaTime?.morning?.from} AM - {temple?.darshanaTime?.morning?.to} PM</span>
                </div>
                <div className="align-items-center d-flex justify-content-between mb-3">
                  <span className="fw-semibold">Evening</span>
                  <span className="fw-semibold">{temple?.darshanaTime?.evening?.from} PM - {temple?.darshanaTime?.evening?.to} PM</span>
                </div>
              </div>
              <br/>
              
              {/* Booking Form */}
              <div className="book-form">
                <h4 className="fw-semibold mb-4"></h4>
                <form className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-12">
                    <div>
                      <label className="required">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter your name" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div>
                      <label className="required">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter your email address" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div>
                      <label className="required">Comment</label>
                      <textarea 
                        className="form-control" 
                        rows="7" 
                        placeholder="Tell us what we can help you with!"
                        required
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Send message
                    </button>
                    <div className="powered-by">Powered by OpenTable</div>
                  </div>
                </form>
                {submitMessage && (
                  <div className="mt-3 alert alert-info">
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Results Section */}
      <div className="py-5 position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8 col-xl-7">
              <div className="text-center mb-5" data-aos="fade-down">
                <h2 className="display-5 fw-semibold mb-3 section-header__title text-capitalize">Similar Results</h2>
              </div>
            </div>
          </div>
          {otherTemples.length > 0 && (
            <OwlCarousel className="listings-carousel owl-theme" {...carouselOptions}>
              {otherTemples.map((temple) => (
                <div key={temple._id} className="card rounded-3 w-100 flex-fill overflow-hidden">
                  {/* Use slug if available, otherwise fall back to ID */}
                  <a href={`/temple/${temple.slug || temple._id}`} className="stretched-link"></a>
                  <div className="card-img-wrap card-image-hover overflow-hidden">
                    <img 
                      src={`${ip}/${temple.image}`} 
                      alt={temple.name} 
                      className="img-fluid"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="d-flex end-0 gap-2 me-3 mt-3 position-absolute top-0 z-1">
                      <a href="#" className="btn-icon shadow-sm d-flex align-items-center justify-content-center text-primary bg-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Bookmark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                        </svg>
                      </a>
                      <a href="#" className="btn-icon shadow-sm d-flex align-items-center justify-content-center text-primary bg-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Quick View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex flex-column h-100 position-relative p-4">
                    <div className="align-items-center bg-primary cat-icon d-flex justify-content-center position-absolute rounded-circle text-white">
                      <i className="fa-solid fa-shop"></i>
                    </div>
                    <div className="align-items-center d-flex flex-wrap gap-1 text-primary card-start">
                      <span className="fw-medium text-primary"></span>
                    </div>
                    <h4 className="fs-5 fw-semibold mb-0">{temple.name}</h4>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default TempleDetails;