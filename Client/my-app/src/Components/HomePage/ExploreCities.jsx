import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import './ExploreCities.css';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Ensure jQuery is available globally
window.jQuery = window.$ = $;
require('owl.carousel');

const ExploreCities = () => {
  const carouselRef = useRef(null);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/temples/sort`);
      const filteredTemples = response.data.filter(temple =>
        temple.isVerified &&  temple.subscriped && temple.enabled && temple.show
      );

      const templesWithImages = await Promise.all(
        filteredTemples.map(async temple => {
          try {
            const galleryResponse = await axios.get(`${ip}/api/Gallery/temple/${temple._id}`);
            const images = galleryResponse.data;
            return {
              ...temple,
              mainImage: images.length > 0 ? `${ip}/${images[0].path}` : null,
            };
          } catch (error) {
            console.error(`Error fetching images for temple ${temple._id}:`, error);
            return {
              ...temple,
              mainImage: null,
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

  useEffect(() => {
    if (temples.length > 0) {
      $(document).ready(() => {
        const $carousel = $(carouselRef.current);
        if ($carousel.length) {
          $carousel.owlCarousel({
            loop: true,
            margin: 24,
            nav: true,
            dots: false,
            responsive: {
              0: { items: 1, margin: 16 },
              768: { items: 2, margin: 20 },
              1024: { items: 3, margin: 10 },
              1280: { items: 4 }
            },
            navText: [
              '<button class="nav-button prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
              '<button class="nav-button next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>',
            ],
          });
        }
      });
    }

    return () => {
      const $carousel = $(carouselRef.current);
      if ($carousel.length && typeof $carousel.owlCarousel === 'function') {
        $carousel.owlCarousel('destroy');
      }
    };
  }, [temples]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="temple-carousel-section">
      <div className="container">
        <div ref={carouselRef} className="owl-carousel temple-carousel">
          {temples.map(temple => (
            <div key={temple._id} className="temple-card">
                <Link 
                        to={`/TempleDetails/${temple._id}`} style={{ textDecoration: 'none' }}>
              <div className="temple-card-image">
                <img src={temple.mainImage} alt={temple.name} />
                <div className="temple-card-overlay">
                  <div className="temple-card-content">
                    <h2>{temple.name}</h2>
                    <p style={{color:"white"}}>{temple.district}</p>
                    <div className="explore-more">
                      <span style={{color:"white"}}>EXPLORE MORE</span>
                      <Link 
                        to={`/TempleDetails/${temple._id}` } style={{ textDecoration: 'none' }}
                        className="explore-button"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCities;

