import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from '../Components/Form/Form'
import SignupPage from '../Components/AdminLogin/SignupPage/SignupPage'
import LoginPage from '../Components/AdminLogin/LoginPage/LoginPage'
import DashBoard from '../Pages/Admin/DashBaord/DashBoard'
import Formdetails from '../Pages/Admin/Registration/Formdetails'
import SortSubmission from '../Pages/Admin/SortSubmission/SortSubmission'

function Dom() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/form" element={<><Formdetails/></>} />
        <Route path="/AdminSignup" element={<><SignupPage/></>} />
        <Route path="/AdminLogin" element={<><LoginPage/></>} />
        <Route path="/Dashboard" element={<><DashBoard/></>} />
        <Route path="/SortSubmission" element={<><SortSubmission/></>} />




      </Routes>
    </BrowserRouter>
  )
}

export default Dom