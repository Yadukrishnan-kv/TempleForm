"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"
import subbanner from "../../assets/images/subbanner.jpg"
import { MapPin, Heart } from "lucide-react"
import Aos from "aos"

function SearchResults() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  const locationQuery = searchParams.get("location") || ""

  const [temples, setTemples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(locationQuery)
  const [districts, setDistricts] = useState([])
  const [imageCache, setImageCache] = useState({})

  const ip = process.env.REACT_APP_BACKEND_IP

  // Initialize AOS and fetch data
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    })
    fetchDistricts()
    if (searchQuery && ip) {
      searchTemples(searchQuery)
    }
  }, [searchQuery, ip])

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

  // Main function to search temples
  const searchTemples = async (query) => {
    setLoading(true)
    setError("")

    try {
      // Fetch all temples
      const response = await axios.get(`${ip}/api/temples/sort`)
      console.log("API Response:", response.data)

      // Filter verified, enabled temples by search query
      const filteredTemples = Array.isArray(response.data)
        ? response.data.filter(
            (temple) =>
              temple.name.toLowerCase().includes(query.toLowerCase()) &&
              temple.isVerified === true &&
              temple.enabled === true,
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
      setError("Failed to search temples")
      toast.error("Failed to search temples")
    } finally {
      setLoading(false)
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

  // Filter temples based on location
  const filteredTemples = temples.filter((temple) => {
    const matchesLocation = !selectedLocation || temple.district === selectedLocation
    return matchesLocation
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
                  <span style={{ color: "white" }}>Search Results for</span>
                  <span className="font-caveat text-primary"> "{searchQuery}" </span>
                </h2>
               
              </div>
            </div>
          </div>

          {/* Location Filter */}
         
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
                  <h3>No temples found for "{searchQuery}"</h3>
                  <p className="text-muted">Try searching with different keywords or check back later.</p>
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
                                key={`${temple._id}-${temple.mainImage}`}
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

export default SearchResults
