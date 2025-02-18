import React, { useState, useEffect } from "react"
import * as XLSX from 'xlsx';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import Header from "../Header/Header"
import Sidebar from "../Sidebar/Sidebar"
import './AllUsersList.css'
import { toast } from "react-toastify";

function AllUsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const ip = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
  
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(`${ip}/api/UserRoutes/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setUsers(response.data.users)
      } else {
        setError("Failed to fetch users")
      }
      await logAction('View');

    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.response?.data?.message || "Failed to fetch users")
      if (error.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }


  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
 const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'UsersList',
          subModule: 'List AllUsers',
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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }




  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to Remove?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${ip}/api/UserRoutes/delete-users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(users.filter((user) => user._id !== userId))
      toast.success(" Deleted successfully!");

      await logAction("Delete", { userId })
    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error.response?.data?.message || "Failed to delete user")
      toast.error("Error deleting !"); 

    }
  }
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
      Name: user.fullName,
      Email: user.email,
      Role: user.role === "2" ? "Temple" : "User",
      Joined: new Date(user.createdAt).toLocaleDateString()
    })));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "UsersList.xlsx");
  };
  return (

    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4  ms-3" style={{marginTop:"100px"}}>User Management</h1>
        <div className="relative searchbar-container">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 searchbar-subcontainer" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
         </div>
       </div>
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg ">{error}</div>}
         <div className=" rounded-lg  overflow-hidden">
         <div className="overflow-x-autos">
        <div >
            <button onClick={exportToExcel} className="exportExcel-button" >
            Export to Excel
           </button>
         </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap" data-label="Name">
  <div className="flex items-center">
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
    </div>
  </div>
</td>
<td className="px-6 py-4 whitespace-nowrap" data-label="Email">
  <div className="text-sm text-gray-900">{user.email}</div>
</td>
<td className="px-6 py-4 whitespace-nowrap" data-label="Role">
  <span
    className={`role-badge ${
      user.role === "2" ? "role-badge-temple" : "role-badge-user"
    }`}
  >
    {user.role === "2" ? "Temple" : "User"}
  </span>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-label="Joined">
  {new Date(user.createdAt).toLocaleDateString()}
</td>
<td className="px-6 py-4 whitespace-nowrap" data-label="Actions">
                        <button onClick={() => deleteUser(user._id)} className="userdelete-button">

                        Delete
                      </button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found matching your search.</div>
        )}
      </div>
    </div>
    </div>
    </div>
  )
}

export default AllUsersList

