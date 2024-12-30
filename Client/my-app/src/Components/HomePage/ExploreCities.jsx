import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import './ExploreCities.css';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import guruvayur from '../../assets/images/guruvayur_thumb.jpg';
import chottanikkara_thumb from '../../assets/images/chottanikkara_thumb.jpg';
import padmanabhaswamy_thumb from '../../assets/images/padmanabhaswamy_thumb.jpg';
import kadampuzha_thumb from '../../assets/images/kadampuzha_thumb.jpg';
import vadakkumnathan_thumb from '../../assets/images/vadakkumnathan_thumb.jpg';
import thirumandhamkunnu_thumb from '../../assets/images/thirumandhamkunnu_thumb.jpg';
import { Link } from 'react-router-dom';
// Ensure jQuery is available globally
window.jQuery = window.$ = $;

// Import Owl Carousel after setting jQuery globally
require('owl.carousel');

const ExploreCities = () => {
  const carouselRef = useRef(null);

  const temples = [
    { name: 'Guruvayur', location: 'Thrissur', image: guruvayur },
    { name: 'Chottanikkara Bhagavati Temple', location: 'Kochi', image: chottanikkara_thumb },
    { name: 'Sree Padmanabhaswamy Temple', location: 'Trivandrum', image: padmanabhaswamy_thumb },
    { name: 'Shri Kadampuzha Bhagavathy Temple', location: 'Malappuram', image: kadampuzha_thumb },
    { name: 'Sree Vadakkumnathan Temple', location: 'Thrissur', image: vadakkumnathan_thumb },
    { name: 'Sree Thirumandhamkunnu Bhagavathi Temple', location: 'Malappuram', image: thirumandhamkunnu_thumb },

  ];

  useEffect(() => {
    $(document).ready(() => {
      const $carousel = $(carouselRef.current);
      if ($carousel.length) {
        $carousel.owlCarousel({
          loop: true,
          margin: 20,
          nav: true,
          dots: false,
          responsive: {
            0: { 
              items: 1,
              margin: 10
            },
            576: { 
              items: 2,
              margin: 15
            },
            992: { 
              items: 3,
              margin: 20
            },
            1200: { 
              items: 4,
              margin: 20
            }
          },
          navText: [
            '<button class="nav-button prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
            '<button class="nav-button next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'
          ]
        });
      }
    });

    return () => {
      const $carousel = $(carouselRef.current);
      if ($carousel.length && typeof $carousel.owlCarousel === 'function') {
        $carousel.owlCarousel('destroy');
      }
    };
  }, []);

  return (
    <div className="temple-carousel-section">
      <div className="container">
        <div ref={carouselRef} className="owl-carousel temple-carousel">
          {temples.map((temple, index) => (
            <div key={index} className="temple-card">
              <div className="temple-card-image">
                <img src={temple.image} alt={temple.name} />
                <div className="temple-card-overlay">
                  <div className="temple-card-content">
                    <h2>{temple.name}</h2>
                    <p>{temple.location}</p>
                    <div className="explore-more">
                    <span>EXPLORE MORE</span> 
                      <button className="explore-button">
                      <Link to={'/TempleDetails'} style={{textDecoration:"none",color:"white"}}> <ArrowRight size={16} /></Link>
                      </button>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCities;

