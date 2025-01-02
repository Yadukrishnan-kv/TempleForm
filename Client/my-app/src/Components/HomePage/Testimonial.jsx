import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import './Testmonial.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import quote_white from '../../assets/images/testimonial-bg-2.jpg'
// Ensure jQuery is available globally
window.jQuery = window.$ = $;

// Import Owl Carousel after setting jQuery globally
require('owl.carousel');

const Testimonial = () => {
  const carouselRef = useRef(null);

  const testimonials = [
    {
      quote: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      author: "MARK, SOUTH EVERETT"
    },
    {
      quote: "Another testimonial can be added here to demonstrate multiple testimonials.",
      author: "JANE, NORTH SEATTLE"
    }
  ];

  useEffect(() => {
    $(document).ready(() => {
      const $carousel = $(carouselRef.current);
      if ($carousel.length) {
        $carousel.owlCarousel({
          items: 1,
          loop: true,
          margin: 0,
          nav: true,
          dots: false,
          navText: [
            '<button class="nav-button prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
            '<button class="nav-button next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'
          ],
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true
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
    <section className="testimonial-section  position-relative overflow-hidden text-white">
      <img 
        src={quote_white}
        className="bg-image js-image-parallax" 
        alt="Testimonial background" 
      />
      
      <div className="container py-4 overlay-content">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-10 col-lg-8 col-xl-7">
            <div className=" text-center mb-5" data-aos="fade-down">
              <div className="d-inline-block font-caveat fs-1 fw-medium  text-capitalize text-primary">
                Testimonial
              </div>
            </div>
          </div>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-10 col-lg-10">
            <div ref={carouselRef} className="testimonial-carousel owl-carousel owl-theme">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-item">
                  <div className="text-center mb-3">
                  </div>
                  <div className="fs-3 text-center">
                    {testimonial.quote}
                  </div>
                  <div className="text-center mt-4 fw-semibold">
                    {testimonial.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

