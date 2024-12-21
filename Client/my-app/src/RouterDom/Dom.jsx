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

function Dom() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />

        {/* <Route path="/AdminSignup" element={<><SignupPage/></>} /> */}
        <Route path="/AdminLogin" element={<><LoginPage/></>} />
        <Route path="/Dashboard" element={<><DashBoard/></>} />
        <Route path="/admin/profile" element={<><AdminProfile/></>} />
        <Route path="/AddSubmission" element={<><Addform/></>} />
        <Route path="/SortSubmission" element={<><SortSubmission/></>} />
        <Route path="/addstate" element={<><AddState/></>} />
        <Route path="/adddistrict" element={<><AddDistrict/></>} />
        <Route path="/addtaluk" element={<><AddTaluk/></>} />
        <Route path="/edit/:id" element={<><EdidtSubmission/></>} />





      </Routes>
    </BrowserRouter>
  )
}

export default Dom