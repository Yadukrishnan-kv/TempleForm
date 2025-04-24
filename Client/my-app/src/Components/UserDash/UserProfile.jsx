import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../../Pages/Admin/Header/AdminProfile.css"
import { toast } from "react-toastify"



function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const ip = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    checkAuthAndFetchProfile()
  }, [])

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/Signin")
      return
    }
    await fetchProfile(token)
  }

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${ip}/api/UserRoutes/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(response.data)
      setFullName(response.data.fullName)
      setEmail(response.data.email)
    } catch (error) {
      console.error("Error fetching profile:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      } else {
        setError("Failed to fetch profile data")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/Signin")
        return
      }

      await axios.put(
        `${ip}/api/UserRoutes/profile/update`,
        { fullName, email, password: password || undefined },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setIsEditing(false)
      setPassword("")
      await fetchProfile(token)
      setError("")
            toast.success("Profile updated successfully!")
      
    } catch (error) {
      console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
      
    }
  }

  if (!profile) {
    return <div className="user-profile-loading">Loading...</div>
  }

  return (
   
        <div className="admin-profile-container">
          <h2 className="admin-profile-title">User Profile</h2>
          {error && <div className="admin-profile-error">{error}</div>}
          <form onSubmit={handleSubmit} className="admin-profile-form">
            <div className="admin-profile-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                  placeholder="Leave blank to keep current"
                />
              </div>
            )}
            {isEditing ? (
              <div className="admin-profile-button-group">
                <button type="submit" className="admin-profile-button">
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="admin-profile-button">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="admin-profile-button">
                Edit Profile
              </button>
            )}
          </form>


          
        </div>
        
    
  )
}

export default UserProfile

