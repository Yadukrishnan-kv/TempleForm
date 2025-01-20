import React from "react"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  if (!token || !user) {
    return <Navigate to="/signin" />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

export default ProtectedRoute

