import React from 'react'
import './Role.css'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
function Role() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        </div>
    </div>
  )
}

export default Role