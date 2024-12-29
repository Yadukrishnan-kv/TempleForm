import React, {  useState } from 'react';
import './HomePage.css'
import {Search, MapPin } from 'lucide-react'

function HeroHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery, 'in', location);
  };




  return (
    <div className="hero-header">
      <div className="hero-background dark-overlay" />
      <div className="container">
        <h1 className="hero-title">
          "SREESHUDDHI" is a realignment <br/>
          start-up mission that transcend devotee to <br/> 
          spiritual ecstasy.
        </h1>
        
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="search-wrapper">
              <div className="search-field">
              <Search  className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="What are you looking for?"
                />
              </div>
              
              <div className="divider" />
              
              <div className="search-field">
              <MapPin className="search-icon" size={18}/>
                <select className="search-select">
                  <option value="">Location</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="kerala">Kerala</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                </select>
              </div>
              
              <button type="submit" className="search-button">
                Search temples
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  export default HeroHeader;
