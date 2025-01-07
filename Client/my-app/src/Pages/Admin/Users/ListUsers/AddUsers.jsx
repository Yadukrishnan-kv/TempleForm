import React from 'react'
import './AddUsers.css'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
function AddUsers() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        </div>
    </div>
  )
}

export default AddUsers