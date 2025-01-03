import React, { useEffect } from 'react';
import './HomePage.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaIgloo, FaMapLocation } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";



function Process() {
  
  useEffect(() => {
        AOS.init({
          duration: 600, 
          easing: 'ease-in-out', 
          once: true, 
        });
      }, []);
  return (
    <section className="how-it-works">
    <div className="container">
      <div className="section-header1" data-aos="fade-down">
        <h2 className="section-title1">HOW SREESHUDDHI WORKS?</h2>
        <p className="section-description">
          Temples are converted to smart e-shaalas of "SREESHUDDHI" where they are Digitally integrated in all the aspects such as, temple management, operations, administration, rituals, donation management, accounting integration, devotee management, hall bookings, room bookings, online bookings for temple visits, inventory / asset management,etc. There will be one central digitized system supporting every partner temple without creating inconvenience to existing systems. Connecting respective SREESHUDDHI's partner temple with smart e-shaala facilities will directly get virgin pure Pooja dravyas which they can use in temple or can sell it through their e-shaala hub.
        </p>
      </div>

      <div className="work-process-grid">
        <div className="work-process-left" data-aos="fade" data-aos-delay="500">
          <div className="work-process-item" >
            <div className="step-box">
            <FaMapLocation 
            className="step-icon" />
            </div>
            <div className="step-content" >
              <h4>MICRO ENTREPRENEURS</h4>
              <p>SREESHUDDHI Micro Entrepreneurs Program where devotees themselves can join hands with SREESHUDDHI to create a stable income source. This program is designed referring to an already successful social responsibility entrepreneurship model with incubator and other training facilities to ensure easy and successful implementation.</p>
            </div>
          </div>
        </div>

        <div className="work-process-right">
          <div className="work-process-item" data-aos="fade" data-aos-delay="500">
            <div className="step-box">
            <FaCalendarAlt 
            className="step-icon" />
            </div>
            <div className="step-content">
              <h4>EDUCATIONAL HUB</h4>
              <p>SREESHUDDHI'S educational hub enables knowledge seekers to learn original and authentic traditional ritual practices, Renowned Vedic Achaaryas exclusive classes, Spirituality Master classes, Yoga, spiritual healing etc.</p>
            </div>
          </div>

          <div className="work-process-item" data-aos="fade" data-aos-delay="500">
            <div className="step-box">
            <FaIgloo 
            className="step-icon" />
            </div>
            <div className="step-content">
              <h4>E-COMMERCE PLATFORM</h4>
              <p>"SREESHUDDHI" also create digital E-commerce channel for devotees and general public to access virgin pure organic products at their doorstep.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}


export default Process;



