import React, { useEffect } from 'react';
import Navbar from '../Components/HomePage/Navbar';
import Footer from '../Components/HomePage/Footer';
import subbanner from '../assets/images/subbanner.jpg';
import './ContactPage.css'
import { Phone, Mail } from 'lucide-react';
import { FaArrowRight, FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 600, 
      easing: 'ease-in-out', 
      once: true, 
    });
  }, []);
  return (
    <>
      <Navbar/>

      <section className="  mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
        <img className="bg-image" src={subbanner} alt="Background" />
        <div className=" overlay-content py-5">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-6 col-lg-6">
              <div className="section-header1" data-aos="fade-down" >
                <div className="search-button d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title text-uppercase">
                  Contact us
                </div>
                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize text-white">
                  Do you have any<br /> questions?
                  <span className="font-caveat text-white">Let us Know!</span>
                </h2>
              </div>
            </div>
            <div className="col-md-5 col-lg-4">
  <h5 className="fw-bold mb-4">General contact</h5>
  <div className="mb-5">
    <div>1123 Fictional St, San Francisco<br className="d-none d-xxl-block" />, CA 94103</div>
    <div className="mt-4">
      <a
        className="d-block fw-medium mb-1"
        href="#"
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <Phone className="me-2" size={16} style={{ color: 'white' }} />
        <span>(123) 456-7890</span>
      </a>
      <a
        className="email-link d-block fw-medium"
        href="#"
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <Mail className="me-2" size={16} style={{ color: 'white' }} />
        <span className="__cf_email__" data-cfemail="bccfc9ccccd3cec8fcf0d5cfc8f3d292dfd3d1">[email&#160;protected]</span>
      </a>
    </div>
  </div>
  <h5 className="fw-bold mb-4">Follow us</h5>
  <div className="d-flex gap-3">
    <a
      href="#"
      className="fb d-flex align-items-center justify-content-center fs-19 rounded mr-2"
      style={{ textDecoration: 'none', color: 'white' }}
    >
      <FaFacebook size={19} />
    </a>
    <a
      href="#"
      className="tw d-flex align-items-center justify-content-center fs-21 rounded mr-2"
      style={{ textDecoration: 'none', color: 'white' }}
    >
      <FaTwitter size={21} />
    </a>
    <a
      href="#"
      className="ins d-flex align-items-center justify-content-center fs-21 rounded mr-2"
      style={{ textDecoration: 'none', color: 'white' }}
    >
      <FaInstagram size={21} />
    </a>
    <a
      href="#"
      className="pr d-flex align-items-center justify-content-center fs-21 rounded mr-2"
      style={{ textDecoration: 'none', color: 'white' }}
    >
      <FaPinterest size={21} />
    </a>
    <a
      href="#"
      className="li d-flex align-items-center justify-content-center fs-21 rounded mr-2"
      style={{ textDecoration: 'none', color: 'white' }}
    >
      <FaLinkedin size={21} />
    </a>
  </div>
</div>
          </div>
        </div>
      </section>

      <div className="py-5 bg-light mx-3 rounded-4 my-3">
        <div className="container py-5">
          <div className="row justify-content-between">
            <div className="col-md-6 col-xl-5">
              <h3 className="h1 mb-4 font-caveat text-primary">My contact data</h3>
              <div className="mb-4">
                <label className="required fw-medium mb-2">Full Name</label>
                <input type="text" className="form-control" id="firstName" placeholder="David Hall" required="" />
              </div>
              <div className="mb-4">
                <label className="required fw-medium mb-2">Your Email</label>
                <input type="email" className="form-control" id="email" placeholder="hello@email.com" />
              </div>
              <div className="mb-4">
                <label className="required fw-medium mb-2">Your Phone</label>
                <input type="number" className="form-control" id="phone" />
              </div>
            </div>
            <div className="col-md-6 col-xl-5">
              <h3 className="h1 mb-4 font-caveat text-primary">My message</h3>
              <div className="mb-4">
                <label className="required fw-medium mb-2">Your Comments</label>
                <textarea className="form-control" rows={7} placeholder="Tell us what we can help you with!"></textarea>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  YES, I AUTHORIZE THE USE OF MY PERSONAL DATA IN ACCORDANCE WITH THE PRIVACY POLICY DESCRIBED ON THE WEBSITE.
                </label>
              </div>
              <button type="submit" className="btn  btn-lg d-inline-flex hstack gap-2 mt-4 text-white" style={{backgroundColor:"#FFBD59"}}>
                <span>Send message</span>
                <span className="vr"></span>
                <i className="fa fa-arrow-right fs-14">      <FaArrowRight size={18} />
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>

     <Footer/>
    </>
  );
};

export default ContactPage;

