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
import EnquiryPage from '../Pages/Admin/Enquiries/EnquiryPage'
import BookingsPage from '../Pages/Admin/Bookings/BookingsPage'
import BlogPage from '../Pages/Admin/BlogPage/BlogPage'
import ProtectedRoute from '../Pages/Admin/ProtectedRoute/ProtectedRoute'
import AddUsers from '../Pages/Admin/Users/ListUsers/AddUsers'
import UserRole from '../Pages/Admin/Users/ListRole/UserRole'
import Log from '../Pages/Admin/LogDetails/Log'
import Signup from '../Components/HomePage/Signup'
import Signin from '../Components/HomePage/Signin'
import ForgotPassword from '../Components/HomePage/ForgotPassword'

function Dom() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/AdminLogin" element={<LoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/TemplePage" element={<TemplePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/TempleDetails/:templeId" element={<TempleDetails />} />
        <Route path="/Signup" element={<><Signup/></>} />
        <Route path="/Signin" element={<><Signin/></>} />
        <Route path="/ForgotPassword" element={<><ForgotPassword/></>} />




        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<DashBoard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/AddSubmission" element={<Addform />} />
          <Route path="/SortSubmission" element={<SortSubmission />} />
          <Route path="/gallery/:templeId" element={<GalleryPage />} />
          <Route path="/addstate" element={<AddState />} />
          <Route path="/adddistrict" element={<AddDistrict />} />
          <Route path="/addtaluk" element={<AddTaluk />} />
          <Route path="/edit/:id" element={<EdidtSubmission />} />
          <Route path="/EnquiryPage" element={<EnquiryPage />} />
          <Route path="/BookingsPage" element={<BookingsPage />} />
          <Route path="/AboutTemple/:templeId" element={<AboutTemple />} />
          <Route path="/BlogPage" element={<BlogPage />} />
          <Route path="/listusers" element={<AddUsers/>} />
          <Route path="/usersrole" element={<UserRole/>} />
          <Route path="/log" element={<><Log/></>} />



          

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Dom

