import React, { useState } from 'react';
import './HomePage.css';
import './HeroHeader.css';
import ad01 from '../../assets/images/ad01.jpg';
import ad02 from '../../assets/images/ad02.jpg';
import { Search, MapPin } from 'lucide-react';

function HeroHeader() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    [ad01, ad02], // First slide: two images
    [ad02, ad01], // Second slide: two images
  ];

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < images.length - 1) setCurrentSlide(currentSlide + 1);
  };

  return (
    <div>
      <div className="hero-header">
        <div className="hero-background dark-overlay" />
        <div className="container">
          <h1 className="hero-title">
            "SREESHUDDHI"  Transcend devotee to <br />
            spiritual ecstasy.
          </h1>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="search-wrapper">
                <div className="search-field">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="What are you looking for?"
                  />
                </div>

                <div className="divider" />

                <div className="search-field">
                  <MapPin className="search-icon" size={18} />
                  <select className="search-select">
                    <option value="">Location</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="kerala">Kerala</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                  </select>
                </div>

                <button type="submit" className="search-button1">
                  Search places
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="carousel-container">
        <div className="carousel-images">
          {images[currentSlide].map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${currentSlide + 1} - Image ${index + 1}`}
              className="carousel-image"
            />
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className={`carousel-button prev-button ${
            currentSlide === 0 ? 'disabled' : ''
          }`}
          disabled={currentSlide === 0}
        >
          &#8249;
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className={`carousel-button next-button ${
            currentSlide === images.length - 1 ? 'disabled' : ''
          }`}
          disabled={currentSlide === images.length - 1}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

export default HeroHeader;

