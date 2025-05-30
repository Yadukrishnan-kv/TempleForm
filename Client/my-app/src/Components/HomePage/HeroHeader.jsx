"use client"

import "./HomePage.css"
import "./HeroHeader.css"
import ad01 from "../../assets/images/ad01.jpg"
import ad02 from "../../assets/images/ad02.jpg"
import { Search, MapPin } from "lucide-react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function HeroHeader() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const navigate = useNavigate()

  const images = [ad01, ad02]

  const bannerButtons = ["Products", "Temples", "Services ", "Practices Registration", "Donations Trust", "Projects"]

  const bannerSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to search results page with search parameters
      const searchParams = new URLSearchParams()
      searchParams.set("q", searchTerm.trim())
      if (selectedLocation) {
        searchParams.set("location", selectedLocation)
      }
      navigate(`/search-results?${searchParams.toString()}`)
    }
  }

  return (
    <div>
      <div className="hero-header">
        <div className="hero-background dark-overlay" />
        <div className="container">
          <h1 className="hero-title">
            "SREESHUDDHI" Transcend devotee to <br />
            spiritual ecstasy.
          </h1>

          <div className="row justify-content-center" style={{ borderRadius: "30px" }}>
            <div className="col-lg-10">
              <form onSubmit={handleSearch} className="search-wrapper">
                <div className="search-field">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="What are you looking for?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="divider" />

                <div className="search-field">
                  <MapPin className="search-icon" size={18} />
                  <select
                    className="search-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Location</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="kerala">Kerala</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                  </select>
                </div>

                <button type="submit" className="search-button1">
                  Search places
                </button>
              </form>
            </div>
          </div>

          <div className="banner-carousel-container">
            <Slider {...bannerSettings}>
              <div className="banner-button-wrapper">
                <a href="#" className="banner-button">
                  Products
                </a>
              </div>
              <div className="banner-button-wrapper">
                <a href="/TemplePage" className="banner-button">
                  Temples
                </a>
              </div>
              <div className="banner-button-wrapper">
                <a href="#" className="banner-button">
                  Services
                </a>
              </div>
              <div className="banner-button-wrapper">
                <a href="#" className="banner-button">
                  Practices Registration
                </a>
              </div>
              <div className="banner-button-wrapper">
                <a href="#" className="banner-button">
                  Donations Trust
                </a>
              </div>
              <div className="banner-button-wrapper">
                <a href="#" className="banner-button">
                  Projects
                </a>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      <div className="carousel-container">
        <Slider {...carouselSettings}>
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default HeroHeader
