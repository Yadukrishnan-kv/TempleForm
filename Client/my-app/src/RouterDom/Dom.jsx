import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from '../Components/Form/Form'
import LoginPage from '../Components/AdminLogin/LoginPage/LoginPage'
import DashBoard from '../Pages/Admin/DashBaord/DashBoard'
import SortSubmission from '../Pages/Admin/SortSubmission/SortSubmission'
import AdminProfile from '../Pages/Admin/Header/AdminProfile'
import AddState from '../Pages/Admin/AddState/AddState'
import AddDistrict from '../Pages/Admin/AddState/AddDistrict'
import AddTaluk from '../Pages/Admin/AddState/AddTaluk'
import EdidtSubmission from '../Pages/Admin/SortSubmission/EdidtSubmission'
import Addform from '../Pages/Admin/Registration/Addform'
import MainPage from '../Pages/MainPage/MainPage'
import About from '../Components/AboutPage/About'
import TemplePage from '../Components/TemplesPage/TemplesPage'
import ContactPage from '../ContactPage/ContactPage'
import GalleryPage from '../Pages/Admin/GalleryPage/GalleryPage'
import TempleDetails from '../Components/TempleDetails/TempleDetails'
import AboutTemple from '../Pages/Admin/AboutTemple/AboutTemple'

function Dom() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><MainPage/></>} />

        <Route path="/form" element={<><Form/></>} />
        <Route path="/AdminLogin" element={<><LoginPage/></>} />
        <Route path="/Dashboard" element={<><DashBoard/></>} />
        <Route path="/admin/profile" element={<><AdminProfile/></>} />
        <Route path="/AddSubmission" element={<><Addform/></>} />
        <Route path="/SortSubmission" element={<><SortSubmission/></>} />
        <Route path="/gallery/:templeId" element={<GalleryPage />} />
        <Route path="/addstate" element={<><AddState/></>} />
        <Route path="/adddistrict" element={<><AddDistrict/></>} />
        <Route path="/addtaluk" element={<><AddTaluk/></>} />
        <Route path="/edit/:id" element={<><EdidtSubmission/></>} />
        <Route path="/about" element={<><About/></>} />
        <Route path="/TemplePage" element={<><TemplePage/></>} />
        <Route path="/contact" element={<><ContactPage/></>} />
        <Route path="/TempleDetails/:templeId" element={<><TempleDetails/></>} />
        <Route path="/AboutTemple/:templeId" element={<><AboutTemple/></>} />
</Routes>
    </BrowserRouter>
  )
}

export default Dom