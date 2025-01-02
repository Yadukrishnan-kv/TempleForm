import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './TempleDetails.css';
import Footer from '../HomePage/Footer';
import Navbar from '../HomePage/Navbar';
import { FaBusAlt } from "react-icons/fa";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaTrainSubway } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';





const TempleDetails = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { templeId } = useParams();
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [temple, setTemple] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchTempleDetails();
    fetchImages();
    fetchDescriptions();
  }, [templeId]);

  const fetchTempleDetails = async () => {
    try {
      const response = await axios.get(`${ip}/api/temples/${templeId}`);
      setTemple(response.data);
    } catch (error) {
      console.error('Error fetching temple details:', error);
    }
  };
 
 

const fetchDescriptions = async () => {
    try {
        const res = await axios.get(`${ip}/api/aboutTemple/getAllaboutTemple/${templeId}`);
        setDescriptions(res.data);
    } catch (error) {
        console.error('Error fetching descriptions', error);
    }
};
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${ip}/api/Gallery/temple/${templeId}`);
      setImages(response.data);
    } catch (error) {
      setError('Failed to fetch images');
      console.error('Error fetching images:', error);
    }
  };
 



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const response = await axios.post(`${ip}/api/Bookings/Bookingsubmit`, formData);
      setFormData({ fullName: '', email: '', comment: '' });
    } catch (error) {
      setSubmitMessage('Error submitting booking. Please try again.');
    } finally {
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const poojaTimings = [
    { title: 'Nirmalyam', time: '3:00 AM to 3:30 AM' },
    { title: 'Oilabhishekam, Vakacharthu, Sankhabhishekam', time: '3:20 AM to 3:30 AM' },
    { title: 'Malar Nivedyam, Alankaram', time: '3:30 AM to 4:15 AM' },
    { title: 'Usha Nivedyam', time: '4:15 AM to 4:30 AM' },
    { title: 'Ethirettu Pooja followed by Usha Pooja', time: '4:30 AM to 6:15 AM' },
  ];

  const openingHours = [
    { day: 'Morning', time: '6:00 am - 12:00 pm' },
    { day: 'Evening', time: '3:00 pm - 6:00 pm' },
   
  ];

  const similarTemples = [
    { id: 1, name: 'Green Mart Apartment', image: 'assets/images/place/01.jpg', rating: 4.5, reviews: 2391 },
    { id: 2, name: 'Chuijhal Hotel And Restaurant', image: 'assets/images/place/02.jpg', rating: 4.5, reviews: 2391 },
    { id: 3, name: 'The Barber\'s Lounge', image: 'assets/images/place/03.jpg', rating: 4.5, reviews: 2391 },
    { id: 4, name: 'Gaming Expo Spectacle', image: 'assets/images/place/04.jpg', rating: 4.5, reviews: 2391 },
  ];

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
      '<button class="nav-button prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
      '<button class="nav-button next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'
    ]
  };

  return (
    <div className="temple-details">
      {/* Navbar component would go here */}
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
              <ul className="fs-14 fw-medium list-inline list-separator mb-0 text-muted">
                <li className="list-inline-item">
                  {temple?.darshanaTime?.morning?.from} AM - {temple?.darshanaTime?.morning?.to} PM, 
                  {temple?.darshanaTime?.evening?.from} PM - {temple?.darshanaTime?.evening?.to} PM, All days open
                </li>
              </ul>
            </div>
            <div className="col-lg-auto">
              <div className="form-check form-check-bookmark mb-2 mb-sm-0">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="jobBookmarkCheck"
                  checked={isBookmarked}
                  onChange={handleBookmark}
                />
                <label className="form-check-label" htmlFor="jobBookmarkCheck">
                  <span className="form-check-bookmark-default text-black " style={{ fontSize: '16px'}}>
                    <i className="fa-regular fa-heart me-1"><FaRegHeart />
                    </i> Save this listing
                  </span>
                  <span className="form-check-bookmark-active text-black" style={{ fontSize: '16px' }}>
                    <i className="fa-solid fa-heart me-1"><FaRegHeart /></i> Saved
                  </span>
                </label>
              </div>
              <div className="small mt-1 text-black" >46 people bookmarked this place</div>
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
                  className="img-fluid w-100"  style={{ height: '550px' }}
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
              <a className="d-block position-relative" href={`${ip}/${images[0].path}`} >
                <img 
                  className="img-fluid w-100" style={{ height: '265px' }}
                  src={`${ip}/${images[0].path}` } 
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
                {descriptions.map((descs) => (
                <p key={descs._id}>
                  {descs.description}
                </p>
                ))}
              </div>

              {/* Nearest Section */}
              <div className="mb-4">
                <h4 className="fw-semibold fs-3 mb-4">Nearest</h4>
                <div className="row g-4">
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-bus fs-18"><FaBusAlt size={18}/>
                        </i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Bus Stand</div>
                    </div>
                  </div>
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-plane fs-18"><IoAirplaneSharp size={20} />
                        </i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Airport</div>
                    </div>
                  </div>
                  <div className="col-auto col-lg-3">
                    <div className="d-flex align-items-center text-dark">
                      <div className="flex-shrink-0">
                        <i className="fa-solid fa-train fs-18"><FaTrainSubway size={20} />
                        </i>
                      </div>
                      <div className="flex-grow-1 fs-16 fw-medium ms-3">Railway station</div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-5" />

              {/* Pooja Timings Section */}
              <div className="mb-4">
                <h4 className="fw-semibold fs-3 mb-4">Pooja Timings</h4>
                <div className="row">
                  <div className="col-sm-6">
                    {poojaTimings.slice(0, Math.ceil(poojaTimings.length / 0)).map((pooja, index) => (
                      <div className="mb-3 menu pb-2" key={index}>
                        <div className="row">
                          <div className="col-sm-8">
                            <h4 className="fs-5 mb-0 menu-title">{pooja.title}</h4>
                            <div className=" menu-detail text-muted">{pooja.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-sm-6">
                    {poojaTimings.slice(Math.ceil(poojaTimings.length / 6)).map((pooja, index) => (
                      <div className="mb-3 menu pb-2" key={index + Math.ceil(poojaTimings.length / 2)}>
                        <div className="row">
                          <div className="col-sm-8">
                            <h4 className="fs-5 mb-0 menu-title">{pooja.title}</h4>
                            <div className=" menu-detail text-muted">{pooja.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 ps-xxl-5 ">
              {/* Booking Form */}
              <div className="book-form">
                <h4 className="fw-semibold mb-4">
                  Book <span className="font-caveat">online</span>
                </h4>
                <form className="row g-4" onSubmit={handleSubmit
                }>
                  <div className="col-12">
                    <div >
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
                    <div >
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
                    <div >
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
                      Book Now
                    </button>
                    <div className="powered-by">Powered by OpenTable</div>
                  </div>
                </form>
              </div>

              {/* Opening Hours */}
              <div className="border p-4 rounded-4">
                <div className="align-items-center d-flex justify-content-between mb-4">
                  <h4 className="w-semibold mb-0">Opening <span className="font-caveat text-primary">Hours</span></h4>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                  </svg>
                </div>
                {openingHours.map((item, index) => (
                  <div key={index} className="align-items-center d-flex justify-content-between mb-3">
                    <span className="fw-semibold">{item.day}</span>
                    <span className={`fs-14 ${item.day === 'Sunday' ? 'fw-medium text-danger' : ''}`}>
                      {item.time}
                    </span>
                  </div>
                ))}
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
              <div className=" text-center mb-5" data-aos="fade-down">
                <h2 className="display-5 fw-semibold mb-3 section-header__title text-capitalize">Similar Results</h2>
              </div>
            </div>
          </div>
          <OwlCarousel className="listings-carousel owl-theme" {...carouselOptions}>
            {similarTemples.map((temple) => (
              <div key={temple.id} className="card rounded-3 w-100 flex-fill overflow-hidden">
                <a href="temple_details.html" className="stretched-link"></a>
                <div className="card-img-wrap card-image-hover overflow-hidden">
                  <img src={temple.image} alt={temple.name} className="img-fluid" />
                  <div className="bg-primary card-badge d-inline-block text-white position-absolute">10% OFF</div>
                  <div className="bg-primary card-badge d-inline-block text-white position-absolute">$100 off $399: eblwc</div>
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
                    <i className="fa-solid fa-star"></i>
                    <span className="fw-medium text-primary">
                      <span className="fs-5 fw-semibold me-1">({temple.rating})</span>{temple.reviews} reviews
                    </span>
                  </div>
                  <h4 className="fs-5 fw-semibold mb-0">{temple.name}</h4>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
       <Footer/>
      {/* Footer component would go here */}
    </div>
  );
};

export default TempleDetails;
