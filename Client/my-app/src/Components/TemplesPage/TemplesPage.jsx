import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import subbanner from '../../assets/images/subbanner.jpg';
import './TemplesPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Search, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const TemplePage = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [districts, setDistricts] = useState([]);
  
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
    });
    fetchDistricts();
    fetchVerifiedTemples();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  // Modified to only fetch verified temples
  const fetchVerifiedTemples = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/temples/sort`);
      // Filter verified and enabled temples on the client side
      const verifiedAndEnabledTemples = response.data.filter(temple => temple.isVerified === true && temple.enabled === true);

      // Fetch gallery images for verified and enabled temples
      const templesWithImages = await Promise.all(
        verifiedAndEnabledTemples.map(async (temple) => {
          try {
            const galleryResponse = await axios.get(`${ip}/api/Gallery/temple/${temple._id}`);
            const images = galleryResponse.data;
            return {
              ...temple,
              mainImage: images.length > 0 ? `${ip}/${images[0].path}` : null
            };
          } catch (error) {
            console.error(`Error fetching images for temple ${temple._id}:`, error);
            return {
              ...temple,
              mainImage: null
            };
          }
        })
      );

      setTemples(templesWithImages);
    } catch (error) {
      setError('Failed to fetch temples');
      console.error('Error fetching temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || temple.district === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
        <img className="bg-image" src={subbanner} alt="Temple Banner" />
        <div className="container overlay-content">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8 col-xl-7">
              <div className="section-header text-center mb-5" data-aos="fade-down">
                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                  <span style={{ color: 'white' }}>Find your</span>
                  <span className="font-caveat text-primary"> Temple </span>
                  <span style={{ color: 'white' }}>here</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="search-wrapper">
                <div className="search-field">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search temples..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="divider" />

                <div className="search-field">
                  <MapPin className="search-icon" />
                  <select 
                    className="search-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district._id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="search-button">
                  Search temples
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temple Cards Section */}
      <div className="py-5">
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-12 content">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center text-danger py-5">{error}</div>
              ) : filteredTemples.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No verified temples found</h3>
                  <p className="text-muted">Please check back later for updates.</p>
                </div>
              ) : (
                <div className="row g-4 glow">
                  {filteredTemples.map((temple) => (
                    <div key={temple._id} className="col-sm-4 d-flex">
                      <div className="card card-hover flex-fill overflow-hidden w-100 card-hover-bg no-border bg-light">
                        <Link to={`/temple/${temple._id}`} className="stretched-link"></Link>
                        <div className="card-img-wrap card-image-hover overflow-hidden">
                        <img
  src={temple.mainImage }
  alt={temple.name}
  className="temples_thumb"
 
/>
                          <div className="d-flex end-0 gap-2 me-3 mt-3 position-absolute top-0 z-1">
                            <button 
                              className="align-items-center bg-blur btn-icon d-flex justify-content-center rounded-circle shadow-sm text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                // Add favorite functionality here
                              }}
                            >
                              <Heart size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="d-flex flex-column position-relative p-3 h-24">
                          <h5 className="text-sm font-semibold mb-0">{temple.name}</h5>
                          <span className="text-xs">{temple.district}</span>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TemplePage;




