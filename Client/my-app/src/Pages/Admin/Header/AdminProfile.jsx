import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminProfile.css';
import Header from './Header';
import Sidebar from '../Sidebar/Sidebar';
import { toast } from 'react-toastify';

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
    //   navigate('/AdminLogin');
      return;
    }
    await fetchProfile(token);
  };

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${ip}/api/adminlogin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/AdminLogin');
      } else {
        setError('Failed to fetch profile data');
      }
    }
  };
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'dashboard',
          subModule: 'Profile',
          details
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/AdminLogin');
        return;
      }

      await axios.put(`${ip}/api/adminlogin/profileUpdate`, 
        { name, email, password: password || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      setPassword('');
      await fetchProfile(token);
      setError('');
      toast.success("Profile updated successfully!")
      await logAction('Update', `Updated profile: ${name}`);

      
      navigate('/Dashboard');

    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      toast.error("Failed to update profile")
      
    }
  };

  if (!profile) {
    return <div className="admin-profile-loading">Loading...</div>;
  }

  return (

    <div >
        <Header />
        <div className="content-container">
          <Sidebar />
          <div className="admin-profile-container">
      <h2 className="admin-profile-title">Admin Profile</h2>
      {error && <div className="admin-profile-error">{error}</div>}
      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-profile-form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="admin-profile-input"
          />
        </div>
        <div className="admin-profile-form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className="admin-profile-input"
          />
        </div>
        {isEditing && (
          <div className="admin-profile-form-group">
            <label htmlFor="password">New Password </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-profile-input"
              placeholder='leave blank to keep current'
            />
          </div>
        )}
        {isEditing ? (
          <div className="admin-profile-button-group">
            <button type="submit" className="admin-profile-button">Save Changes</button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="admin-profile-button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="admin-profile-button"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
        </div>
      </div>


   
    
  );
}

export default AdminProfile;






