import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import subbanner from '../../assets/images/subbanner.jpg';
import { Search, MapPin, Heart } from 'lucide-react';




function TempleByType() {
  const { type } = useParams();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedTempleType, setSelectedTempleType] = useState('');
   
    const [templeTypes, setTempleTypes] = useState([
                  { en: "Madam" },
                  { en: "Kudumbakshetram" },
                  { en: "Bajanamadam" },
                  { en: "Sevagramam" },
                  { en: "Kaavukal"},
                  { en: "Sarppakaav" },
    ]);
  const ip = process.env.REACT_APP_BACKEND_IP;
  useEffect(() => {
   
    fetchDistricts();
    fetchVerifiedTemples();
  }, []);

  useEffect(() => {
    console.log('Fetching temples for type:', type);
    const fetchTemples = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ip}/api/temples/all`);
        console.log('API Response:', response.data);
        const filteredTemples = Array.isArray(response.data)
          ? response.data.filter((temple) => temple.templeType === type)
          : [];
        setTemples(filteredTemples);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch temples');
        toast.error('Failed to fetch temples');
      } finally {
        setLoading(false);
      }
    };
    if (ip) {
      fetchTemples();
    } else {
      setError('Backend URL is not defined');
      toast.error('Backend URL is not defined');
      setLoading(false);
    }
  }, [type, ip]);




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
              mainImage: images.length > 0 ? `${ip}/${images[2].path}` : null
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

  const fetchTemples = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/temples/sort`, {
        params: {
         
          templeType: filters.templeType,
        }
      });
      setTemples(response.data || []);
    } catch (error) {
      console.error("Error fetching temples:", error);
      setError('Failed to fetch temples');
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
   
    fetchDistricts();
    fetchVerifiedTemples();
  }, []);

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || temple.district === selectedLocation;
    const matchesTempleType = !selectedTempleType || temple.templeType === selectedTempleType;
    return matchesSearch && matchesLocation && matchesTempleType;
  });



  return (
    <div>

     <Navbar />
 {/* Hero Section */}
      <section className="mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
        <img className="bg-image" src={subbanner} alt="Temple Banner" />
        <div className="container overlay-content">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8 col-xl-7">
              <div className=" text-center mb-5" data-aos="fade-down">
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
                <div className="divider" />

              <div className="search-field">
              <select 
              className="search-select"
            value={selectedTempleType}
              onChange={(e) => setSelectedTempleType(e.target.value)}
  >
    <option value="">All Temple Types</option>
    {templeTypes.map(type => (
      <option key={type.en} value={type.en}>
        {type.en} 
      </option>
    ))}
  </select>
</div>

                <button type="submit" className="search-button1">
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
                        <Link to={`/TempleDetails/${temple._id}`} className="stretched-link">
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
                        </Link>
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


    </div>
  );
}

export default TempleByType;