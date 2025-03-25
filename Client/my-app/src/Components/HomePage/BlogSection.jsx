import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function BlogSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const ip = process.env.REACT_APP_BACKEND_IP;

  // Initialize AOS animation
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // Fetch blog posts from the backend
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get(`${ip}/api/Blog/getblog`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }, [ip]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle next and previous slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  return (
    <section className="blog-section py-5 position-relative overflow-hidden bg-light">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <div className="text-center mb-4 mb-md-5 px-3" data-aos="fade-down">
              <div className="d-inline-block font-caveat fs-3 fs-md-1 fw-medium text-primary">
                Our Latest Articles
              </div>
              <h2 className="heading-responsive fw-800 lh-sm mb-3 text-dark">
                Discover Our Latest News And Articles
              </h2>
              <div className="text-responsive text-secondary">
                Discover exciting categories.{' '}
                <span className="text-primary fw-semibold">
                  Find what you're looking for.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="position-relative">
          <div className="blog-carousel overflow-hidden">
            <div
              className="row flex-nowrap transition-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {blogs.map((blog) => (
                <div key={blog._id} className="col-md-4">
                  <article className="card h-100 overflow-hidden">
                    <div className="position-relative overflow-hidden">
                      <Link
                        to="/blog-details"
                        className="h-100 position-absolute start-0 top-0 w-100 z-1"
                        aria-label="Read more"
                      ></Link>
                      <button
                        className="align-items-center bg-white btn-icon d-flex end-0 justify-content-center me-3 mt-3 position-absolute rounded-circle text-primary top-0 z-3"
                        title="Read later"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bookmark"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                        </svg>
                      </button>
                      {blog.image && (
                        <img
                          src={`${ip}/${blog.image.path}`}
                          alt={blog.title}
                          className="image-zoom-hover"
                          style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="ps-3 pt-3">
                      <div className="hstack gap-3 mb-3">
                        <span className="fs-sm small text-muted">
                          {new Date(blog.date).toLocaleDateString()}
                        </span>
                        <span className="opacity-25">|</span>
                        <Link
                          to="#"
                          className="badge border fw-semibold text-primary bg-white"
                        >
                          Events
                        </Link>
                      </div>
                      <h3 className="h5 fw-semibold mb-0 post-title overflow-hidden">
                        <Link
                          to="/blog-details"
                          className="text-dark text-decoration-none"
                        >
                          {blog.content}
                        </Link>
                      </h3>
                    </div>
                    <div className="card-footer py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          {blog.author.avatar && (
                            <img
                              src={blog.author.avatar}
                              className="rounded-circle"
                              width="48"
                              height="48"
                              alt={`${blog.author.name}'s avatar`}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <Link
                            to="#"
                            className="d-block text-dark text-decoration-none"
                          >
                            <span className="fst-italic text-muted">By </span>
                            <span className="fw-medium">{blog.author.name}</span>
                          </Link>
                          <small className="text-muted">{blog.author.role}</small>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls-wrapper">
            <button className="carousel-control-prev" onClick={prevSlide} type="button">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <div className="carousel-indicators">
              {blogs.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={currentSlide === index ? 'active' : ''}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>

            <button className="carousel-control-next" onClick={nextSlide} type="button">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
