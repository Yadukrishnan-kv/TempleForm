

"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"
import subbanner from "../../assets/images/subbanner.jpg"
import { Search, MapPin, Heart } from "lucide-react"
import Aos from "aos"

function TempleByType() {
  const { type } = useParams()
  const [temples, setTemples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [districts, setDistricts] = useState([])
  const [selectedTempleType, setSelectedTempleType] = useState("")
  const [imageCache, setImageCache] = useState({})

  const [templeTypes, setTempleTypes] = useState([
    { en: "Madam" },
    { en: "Desakshetram" },
    { en: "Kudumbakshetram" },
    { en: "Bajanamadam" },
    { en: "Sevagramam" },
    { en: "Kaavukal" },
    { en: "Sarppakaav" },
  ])

  const ip = process.env.REACT_APP_BACKEND_IP

  // Initialize AOS and fetch districts only once
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    })
    fetchDistricts()
  }, [])

  // Fetch temples when type parameter changes
  useEffect(() => {
    if (type && ip) {
      console.log("Fetching temples for type:", type)
      setSelectedTempleType(type) // Set the dropdown to match the URL parameter
      fetchTemplesByType(type)
    }
  }, [type, ip])

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`)
      setDistricts(response.data)
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }

  // Function to fetch images for a specific temple
  const fetchTempleImages = async (templeId) => {
    // Check if image is already cached
    if (imageCache[templeId]) {
      return imageCache[templeId]
    }

    try {
      const galleryResponse = await axios.get(`${ip}/api/Gallery/temple/${templeId}`)
      const images = galleryResponse.data

      // Try different image indices as fallback
      let mainImage = null
      if (images.length > 0) {
        // Try index 2 first, then 0, then 1
        if (images[2] && images[2].path) {
          mainImage = `${ip}/${images[2].path}`
        } else if (images[0] && images[0].path) {
          mainImage = `${ip}/${images[0].path}`
        } else if (images[1] && images[1].path) {
          mainImage = `${ip}/${images[1].path}`
        }
      }

      // Cache the image
      setImageCache((prev) => ({
        ...prev,
        [templeId]: mainImage,
      }))

      return mainImage
    } catch (error) {
      console.error(`Error fetching images for temple ${templeId}:`, error)
      return null
    }
  }

  // Main function to fetch temples by type
  const fetchTemplesByType = async (templeType) => {
    setLoading(true)
    setError("")

    try {
      // Fetch temples
      const response = await axios.get(`${ip}/api/temples/sort`)
      console.log("API Response:", response.data)

      // Filter verified, enabled temples by type
      const filteredTemples = Array.isArray(response.data)
        ? response.data.filter(
            (temple) => temple.templeType === templeType && temple.isVerified === true && temple.enabled === true,
          )
        : []

      console.log("Filtered temples:", filteredTemples)

      // Fetch images for each temple
      const templesWithImages = await Promise.all(
        filteredTemples.map(async (temple) => {
          const mainImage = await fetchTempleImages(temple._id)
          return {
            ...temple,
            mainImage,
          }
        }),
      )

      setTemples(templesWithImages)
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to fetch temples")
      toast.error("Failed to fetch temples")
    } finally {
      setLoading(false)
    }
  }

  // Handle temple type change from dropdown
  const handleTempleTypeChange = (e) => {
    const newTempleType = e.target.value
    setSelectedTempleType(newTempleType)

    if (newTempleType) {
      // Fetch temples for the newly selected type
      fetchTemplesByType(newTempleType)
    } else {
      // If "All Temple Types" is selected, fetch temples for the original type from URL
      fetchTemplesByType(type)
    }
  }

  // Handle image loading errors
  const handleImageError = async (templeId, event) => {
    console.log("Image failed to load for temple:", templeId)

    // Remove from cache and try to refetch
    setImageCache((prev) => {
      const newCache = { ...prev }
      delete newCache[templeId]
      return newCache
    })

    // Try to fetch image again
    const newImage = await fetchTempleImages(templeId)
    if (newImage && event.target) {
      event.target.src = newImage
    }
  }

  // Filter temples based on search and location (but not temple type since we fetch by type)
  const filteredTemples = temples.filter((temple) => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || temple.district === selectedLocation
    return matchesSearch && matchesLocation
  })

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
        <img className="bg-image" src={subbanner || "/placeholder.svg"} alt="Temple Banner" />
        <div className="container overlay-content">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8 col-xl-7">
              <div className="text-center mb-5" data-aos="fade-down">
                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                  <span style={{ color: "white" }}>Find your</span>
                  <span className="font-caveat text-primary"> {selectedTempleType || type} </span>
                  <span style={{ color: "white" }}>temples here</span>
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
                    {districts.map((district) => (
                      <option key={district._id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="divider" />

                <div className="search-field">
                  <select className="search-select" value={selectedTempleType} onChange={handleTempleTypeChange}>
                    <option value="">All Temple Types</option>
                    {templeTypes.map((typeOption) => (
                      <option key={typeOption.en} value={typeOption.en}>
                        {typeOption.en}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="search-button1"
                  onClick={() => fetchTemplesByType(selectedTempleType || type)}
                >
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
                  <h3>No {selectedTempleType || type} temples found</h3>
                  <p className="text-muted">Please check back later for updates.</p>
                </div>
              ) : (
                <div className="row g-4 glow">
                  {filteredTemples.map((temple) => (
                    <div key={temple._id} className="col-sm-4 d-flex">
                      <div className="card card-hover flex-fill overflow-hidden w-100 card-hover-bg no-border bg-light">
                        <Link to={`/TempleDetails/${temple._id}`} className="stretched-link">
                          <div className="card-img-wrap card-image-hover overflow-hidden">
                            {temple.mainImage ? (
                              <img
                                src={temple.mainImage || "/placeholder.svg"}
                                alt={temple.name}
                                className="temples_thumb"
                                onError={(e) => handleImageError(temple._id, e)}
                                key={`${temple._id}-${temple.mainImage}`} // Force re-render when image changes
                              />
                            ) : (
                              <div className="temples_thumb d-flex align-items-center justify-content-center bg-light">
                                <span className="text-muted">No Image</span>
                              </div>
                            )}

                            <div className="d-flex end-0 gap-2 me-3 mt-3 position-absolute top-0 z-1">
                              <button
                                className="align-items-center bg-blur btn-icon d-flex justify-content-center rounded-circle shadow-sm text-white"
                                onClick={(e) => {
                                  e.preventDefault()
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
  )
}

export default TempleByType
