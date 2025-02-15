import { useEffect } from 'react';
import './About.css';
import Navbar from '../HomePage/Navbar';
import subbanner from '../../assets/images/subbanner.jpg'
import about01 from '../../assets/images/about01.jpg'
import about02 from '../../assets/images/about02.jpg'
import about03 from '../../assets/images/about03.jpg'
import about04 from '../../assets/images/about04.jpg'
import brand_logo1 from '../../assets/images/brand-logo/01.png'
import brand_logo2 from '../../assets/images/brand-logo/02.png'
import brand_logo3 from '../../assets/images/brand-logo/03.png'
import brand_logo4 from '../../assets/images/brand-logo/04.png'
import brand_logo5 from '../../assets/images/brand-logo/05.png'
import brand_logo6 from '../../assets/images/brand-logo/06.png'
import Footer from '../HomePage/Footer';
import CountUp from "react-countup";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from 'react-router-dom';






const About = () => {

  const location = useLocation();

  useEffect(() => {
      if (location.hash) {
          const element = document.querySelector(location.hash);
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }, [location]);
   useEffect(() => {
      AOS.init({
        duration: 600, 
        easing: 'ease-in-out', 
        once: true, 
      });
    }, []);

  const timelineData = [
    {
      content: "Repeated meetings with Thantri Samaj and  other key official gave birth to a larger vision and  goal.",
    },
    {
      content: "The first milestone Sreeshuddhi has been  officially launched on November 2023.",
    },
    {
      content: "Product Sourcing and Various initiatives  such as conceptual framework, MVP plan, etc..."
    },
    {
      content: "MVP Launch phase. Trademark registration, Digital Presence, startup registration, etc..",
    }
  ];
  
  return (
    <div className="about-page">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <section className="  mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
        <img className="bg-image" src={subbanner} alt="Banner" />
        <div className="container overlay-content py-5">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-10">
              <div className=" text-center" data-aos="fade-down">
                <div className="d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title" style={{backgroundColor:"#FFBD59"}}>
                  7+ YEARS EXPERIENCED IN FIELD
                </div>
                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                  <span className="font-caveat text-white">About Us</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <div className="container">
  <div className="achievements-wrapper mx-auto">
    <div className="counter-content_about position-relative rounded-4">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3 text-center">
          <div
            className="display-5 fw-semibold"
            style={{ color: "#FFBD59" }}
          >
            <CountUp start={1} end={3000} duration={3} />+
          </div>
          <h5 className="fs-18 mt-3">Temple posted</h5>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 text-center">
          <div
            className="display-5 fw-semibold"
            style={{ color: "#FFBD59" }}
          >
            <CountUp start={1} end={2500} duration={3} />+
          </div>
          <h5 className="fs-18 mt-3">Successful hires</h5>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 text-center">
          <div
            className="display-5 fw-semibold"
            style={{ color: "#FFBD59" }}
          >
            <CountUp start={1} end={10} duration={3} suffix="M" />+
          </div>
          <h5 className="fs-18 mt-3">Monthly visits</h5>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 text-center">
          <div
            className="display-5 fw-semibold"
            style={{ color: "#FFBD59" }}
          >
            <CountUp start={1} end={593} duration={3} />+
          </div>
          <h5 className="fs-18 mt-3">Verified companies</h5>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* About Content Section */}
      <div className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8">
              <div className=" text-center mb-5" data-aos="fade-down">
                <div className="d-inline-block font-caveat fs-1 fw-medium section-header__subtitle text-capitalize " style={{color:"#FFBD59"}}>
                  About us
                </div>
                <h2 className=" fs-2 fw-600 lh-sm mb-3 section-header__title text-capitalize">
                  'SREESHUDDHI' enlightens SAKTHI, BUDHI, SHUDDHI <br/>in Sanskrit which means Divine power, Wisdom and <br/> Serenity.
                </h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6" id="vision">
              <div className="column-text-box left">
                <p>Origin of 'SREESHUDDHI' is from the Sanskrit term 'SREELAKAM' : where 'SREE' : the reflection of prosperity and wealth 'aiswarya' reigns which denotes the essence of Hindu Samskara.</p>
                <p>"SREESHUDDHI" is a realignment start-up mission that transcend devotee to spiritual ecstasy. It is a start-up initiative correlating hindu samskara, traditional kshethra rituals and practices, and spirituality, in its utmost purest forms, blending the modern technology and sustainable architecture of the ancient scriptures to evolve devotees into a new world experience of ecstasy and spiritual bliss of soulfulness.</p>
                
                <h4 className="font-caveat  fw-medium fs-1" style={{color:"#FFBD59"}} >Vision</h4>
                <p>"To actuate the well-being of all, envisaging oneness by integrating ancient Indian spiritual traditions into life."</p>
                
                <h4 className="font-caveat  fw-medium fs-1" style={{color:"#FFBD59"}} >Mission</h4>
                <p>"Our mission is to enrich lives by experiencing oneness. We act as an umbrella organization connecting people to the holistic living of India, its traditions, practices, and places of worship. We deliver ancient Indian practices, high-quality rituals, related services, and products, uniquely blending ancient traditional wisdom with technology."</p>

                <h4 className="font-caveat  fw-medium fs-1" style={{color:"#FFBD59"}}>Our Values and Approach</h4>
                <p>Our mission is to enrich lives by experiencing oneness. We act as an umbrella organization connecting people to the holistic living of India, its traditions, practices, and places of worship. We deliver ancient Indian practices, high-quality rituals, related services, and products, uniquely blending ancient traditional wisdom with technology</p>
                
              </div>
            </div>

            <div className="col-md-6 ps-xxl-5">
  <div className="ps-xl-4 position-relative">
    <div className="row g-3">
      <div className="col-6">
        <div
          className="about-image-wrap mb-3 rounded-4"
          style={{
            height: "300px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            border: "4px solid #FFBD59",
          }}
        >
          <img
            src={about01}
            alt="About Image 1"
            className="h-100 w-100 object-fit-cover about-image-one rounded-3"
          />
        </div>
        <div
          className="about-image-wrap rounded-4"
          style={{
            height: "200px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            border: "4px solid #FFBD59",
          }}
        >
          <img
            src={about02}
            alt="About Image 2"
            className="h-100 w-100 object-fit-cover about-image-two rounded-3"
          />
        </div>
      </div>
      <div className="col-6">
        <div
          className="about-image-wrap mb-3 rounded-4"
          style={{
            height: "200px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            border: "4px solid #FFBD59",
          }}
        >
          <img
            src={about03}
            alt="About Image 3"
            className="h-100 w-100 object-fit-cover about-image-three rounded-3"
          />
        </div>
        <div
          className="about-image-wrap rounded-4"
          style={{
            height: "300px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            border: "4px solid #FFBD59",
          }}
        >
          <img
            src={about04}
            alt="About Image 4"
            className="h-100 w-100 object-fit-cover about-image-four rounded-3"
          />
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
        </div>
      </div>
      <div className="bg-dark py-5 custom-mx "  style={{ borderRadius: '18px' }}>
      <div className="container" data-aos="fade-down">
        <div className="text-center mb-5">
          <h3 className="timeline-subtitle">MILESTONE MAP OF SREESHUDDHI</h3>
          <h2 className="timeline-title">
            After The HIGH COURT And SUPREME COURT Decisions
            <br />
            The Spark Of Concept Of SREESHUDDHI Has Been
           
            Ignited.
          </h2>
        </div>

        <div className="timeline-container">
  <div className="timeline-item start-circle">
  
  {timelineData.slice(0, 4).map((item, index) => (
    <div 
      key={index} 
      className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
    >
      <div className="timeline-content">
        <p dangerouslySetInnerHTML={{ __html: item.content }} />
      </div>
      <div className="timeline-circle"></div>
    </div>
  ))}
</div>
</div>

      </div>
    </div>

      {/* end /. awards section */}

      {/* start customers section */}
      <div className="py-5 bg-light">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-10 col-lg-8">
              {/* start section header */}
              <div className=" text-center mb-5" data-aos="fade-down">
                {/* start subtitle */}
                <div className="d-inline-block font-caveat fs-1 fw-medium section-header__subtitle text-capitalize text-primary">Our Customers</div>
                {/* end /. subtitle */}
                {/* start title */}
                <h2 className=" fs-2 fw-800 lh-sm   mb-3 section-header__title text-capitalize">Trusted By Thousands News Of Companies</h2>
                {/* end /. title */}
                {/* start description */}
                <div className="sub-title fs-16">Discover exciting categories. <span className="text-primary fw-semibold">Find what you're looking for.</span></div>
                {/* end /. description */}
              </div>
              {/* end /. section header */}
            </div>
          </div>
          
          <div className="custom-row">
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo1} alt="" className="custom-img" />
    </div>
  </div>
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo2} alt="" className="custom-img" />
    </div>
  </div>
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo3} alt="" className="custom-img" />
    </div>
  </div>
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo4} alt="" className="custom-img" />
    </div>
  </div>
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo5} alt="" className="custom-img" />
    </div>
  </div>
  <div className="custom-col">
    <div className="custom-card">
      <img src={brand_logo6} alt="" className="custom-img" />
    </div>
  </div>
</div>



        </div>
      </div>

      <Footer/>
          
    </div>
  );
};

export default About;

