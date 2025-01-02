import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
function BlogSection() {

   useEffect(() => {
        AOS.init({
          duration: 600, 
          easing: 'ease-in-out', 
          once: true, 
        });
      }, []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogPosts] = useState([
    {
      image: '/assets/images/blog/01-lg.jpg',
      date: '9 hours ago',
      category: 'Events',
      title: 'Etiam Dapibus Metus Aliquam Orci Venenatis, Suscipit Efficitur.',
      author: {
        name: 'Ethan Blackwood',
        avatar: '/assets/images/avatar/01.jpg',
        role: 'Engineer'
      }
    },
    {
      image: '/assets/images/blog/02-lg.jpg',
      date: 'August 30, 2023',
      category: 'Events',
      title: 'Praesent sit amet augue tincidunt, venenatis risus ut.',
      author: {
        name: 'Alexander Kaminski',
        avatar: '/assets/images/avatar/02.jpg',
        role: 'Data analysis'
      }
    },
    {
      image: '/assets/images/blog/03-lg.jpg',
      date: 'Jun 28, 2023',
      category: 'Events',
      title: 'Duis volutpat ipsum eget pretium posuere.',
      author: {
        name: 'Edwin Martins',
        avatar: '/assets/images/avatar/03.jpg',
        role: 'Security Engineer'
      }
    }
  ]);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  return (
    <section className="blog-section py-5 position-relative overflow-hidden bg-light">
      <div className="container py-4">
      <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <div className=" text-center mb-4 mb-md-5 px-3" data-aos="fade-down">
              <div className="d-inline-block font-caveat fs-3 fs-md-1 fw-medium text-primary">
                Our Latest Articles
              </div>
              <h2 className="heading-responsive fw-800 lh-sm mb-3 text-dark">
                Discover Our Latest News And Articles
              </h2>
              <div className="text-responsive text-secondary">
                Discover exciting categories.{" "}
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
              {blogPosts.map((post, index) => (
                <div key={index} className="col-md-4">
                  <article className=" h-100 border-light shadow-sm overflow-hidden">
                    <div className="position-relative overflow-hidden">
                      <Link to="/blog-details" className="stretched-link"></Link>
                      <button 
                        className="btn btn-icon btn-light position-absolute top-0 end-0 mt-3 me-3 z-index-2"
                        title="Read later"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                        </svg>
                      </button>
                      <img 
                        src={post.image} 
                        className="card-img-top image-zoom-hover"
                        alt="Blog post"
                      />
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3 mb-3 text-secondary small">
                        <span>{post.date}</span>
                        <span className="opacity-25">|</span>
                        <Link
                          to="#"
                          className="badge border border-primary text-primary bg-white text-decoration-none"
                        >
                          {post.category}
                        </Link>
                      </div>
                      <h3 className="h5 fw-semibold mb-0 post-title">
                        <Link to="/blog-details" className="text-dark text-decoration-none">
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="py-3 ">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <img 
                            src={post.author.avatar} 
                            className="rounded-circle"
                            width="48" 
                            height="48" 
                            alt={`${post.author.name}'s avatar`}
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <Link to="#" className="text-decoration-none d-block">
                            <span className="text-secondary fst-italic">By </span>
                            <span className="fw-medium text-dark">{post.author.name}</span>
                          </Link>
                          <small className="text-secondary">{post.author.role}</small>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            
          </div>
          <div className="carousel-controls-wrapper">
  <button 
    className="carousel-control-prev"
    onClick={prevSlide}
    type="button"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>

  <div className="carousel-indicators">
    {blogPosts.map((_, index) => (
      <button
        key={index}
        type="button"
        className={currentSlide === index ? 'active' : ''}
        onClick={() => setCurrentSlide(index)}
      ></button>
    ))}
  </div>

  <button 
    className="carousel-control-next"
    onClick={nextSlide}
    type="button"
  >
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