import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Heart, Phone, Compass } from 'lucide-react';
import guruvayur from '../../assets/images/guruvayur_thumb.jpg';
import chottanikkara_thumb from '../../assets/images/chottanikkara_thumb.jpg';
import padmanabhaswamy_thumb from '../../assets/images/padmanabhaswamy_thumb.jpg';
import './PlacesList.css';

function PlacesList() {
  const places = [
    {
      name: 'Guruvayur Temple',
      description: 'Guruvayur Temple is a Hindu temple dedicated to Guruvayurappan (four-armed form of the Vishnu), located in the town of Guruvayur in Kerala, India. Administrated by the Guruvayur Devaswom Board,',
      image: guruvayur,
      phone: '(123) 456-7890'
    },
    {
      name: 'Chottanikkara Bhagavati Temple',
      description: 'The Chottanikkara (correction of Jyotiannakkara) Devi Temple is a temple dedicated to the Hindu mother goddess Bhagavati Lakshmi.',
      image: chottanikkara_thumb,
      phone: '(123) 456-7890'
    },
    {
      name: 'Sree Padmanabhaswamy Temple',
      description: 'The Padmanabhaswamy Temple is a Hindu temple dedicated to Vishnu in Thiruvananthapuram, the capital of the state of Kerala, India.',
      image: padmanabhaswamy_thumb,
      phone: '(123) 456-7890'
    }
  ];

  return (
    <div className="places-container">
      <div className="places-inner-container">
        <div className="places-sidebar">
          <div className="section-header">
            <div className="subtitle">Places</div>
            <h2 className="title">Discover Your Favourite <br/> Place</h2>
            <p className="description">
              Our publications can provide quality and useful tips <br/>and advice for companies 
              on how to evaluate SaaS <br/> providers and choose the best one for their needs, <br/>
              taking into account factors such as price, features and <br/>support.
            </p>
            <Link to="/blog" className="view-all-button">
              View All Places
            </Link>
          </div>
        </div>
        
        <div className="places-content">
          {places.map((place, index) => (
            <div key={index} className="place-card">
              <div className="card-body">
                <div className="card-image">
                  <img src={place.image} alt={place.name} />
                </div>
                <div className="card-content">
                  <button className="bookmark-button">
                    <Heart size={20} />
                  </button>
                  <h3 className="temple-title">
                    {place.name}
                    <CheckCircle size={16} className="verified-icon" />
                  </h3>
                  <p className="temple-description">{place.description}</p>
                  <div className="contact-links">
                    <a href={`tel:${place.phone}`} className="contact-link">
                      <Phone size={16} />
                      <span>{place.phone}</span>
                    </a>
                    <a href="#" className="contact-link">
                      <Compass size={16} />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="decoration decoration-top-right" />
      <div className="decoration decoration-bottom-left" />
    </div>
  );
}

export default PlacesList;





