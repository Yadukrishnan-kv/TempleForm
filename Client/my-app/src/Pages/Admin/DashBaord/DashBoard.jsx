import React from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Dash from './Dash'


function DashBoard() {
  return (
    <div>
    <Header />
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-layout">
        <Dash />
      </div>
    </div>
  </div>
  )
}

export default DashBoard