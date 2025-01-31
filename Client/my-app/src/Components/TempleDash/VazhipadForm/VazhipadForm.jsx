import { useState, useEffect } from "react"
import axios from "axios"

const VazhipadForm = () => {
  const ip = process.env.REACT_APP_BACKEND_IP

  const [vazhipadName, setVazhipadName] = useState("")
  const [vazhipadPrice, setVazhipadPrice] = useState("")
  const [templeInfo, setTempleInfo] = useState(null)
  const [vazhipads, setVazhipads] = useState([])
  const [editingVazhipad, setEditingVazhipad] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTempleInfo()
    fetchVazhipads()
  }, [])

  const fetchTempleInfo = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${ip}/api/PoojaRoutes/getTempleInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTempleInfo(response.data)
    } catch (error) {
      console.error("Error fetching temple info:", error)
    }
  }

  const fetchVazhipads = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${ip}/api/vazhipadRoutes/GetVazhipads`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVazhipads(response.data)
    } catch (error) {
      console.error("Error fetching vazhipads:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      if (editingVazhipad) {
        await axios.put(
          `${ip}/api/vazhipadRoutes/UpdateVazhipad/${editingVazhipad._id}`,
          {
            name: vazhipadName,
            price: vazhipadPrice,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setEditingVazhipad(null)
      } else {
        await axios.post(
          `${ip}/api/vazhipadRoutes/CreateVazhipad`,
          {
            name: vazhipadName,
            price: vazhipadPrice,
            templeName: templeInfo.name,
            templeEmail: templeInfo.email,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }

      alert(editingVazhipad ? "Vazhipad updated successfully!" : "Vazhipad added successfully!")
      setVazhipadName("")
      setVazhipadPrice("")
      setShowForm(false)
      fetchVazhipads()
    } catch (error) {
      console.error("Error adding/updating vazhipad:", error)
      alert("Failed to add/update vazhipad")
    }
  }

  const handleEdit = (vazhipad) => {
    setEditingVazhipad(vazhipad)
    setVazhipadName(vazhipad.name)
    setVazhipadPrice(vazhipad.price)
    setShowForm(true)
  }

  const handleDelete = async (vazhipadId) => {
    if (window.confirm("Are you sure you want to delete this vazhipad?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${ip}/api/vazhipadRoutes/DeleteVazhipad/${vazhipadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert("Vazhipad deleted successfully!")
        fetchVazhipads()
      } catch (error) {
        console.error("Error deleting vazhipad:", error)
        alert("Failed to delete vazhipad")
      }
    }
  }

  if (!templeInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="Statesubmission-page">
          <h2>Vazhipad Management for {templeInfo.name}</h2>

          {!showForm && (
            <button className="add-button" onClick={() => setShowForm(true)}>
              Add New Vazhipad
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="state-form">
              <input
                type="text"
                value={vazhipadName}
                onChange={(e) => setVazhipadName(e.target.value)}
                placeholder="Vazhipad Name"
                required
              />
              <input
                type="number"
                value={vazhipadPrice}
                onChange={(e) => setVazhipadPrice(e.target.value)}
                placeholder="Price"
                required
                min="0"
                step="0.01"
              />
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingVazhipad ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingVazhipad(null)
                    setVazhipadName("")
                    setVazhipadPrice("")
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="state-list">
            <h3>Vazhipads</h3>
            <table className="state-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vazhipads.map((vazhipad) => (
                  <tr key={vazhipad._id}>
                    <td>{vazhipad.name}</td>
                    <td>₹{vazhipad.price}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-link" onClick={() => handleEdit(vazhipad)}>
                          Edit
                        </button>
                        <button className="delete-button1" onClick={() => handleDelete(vazhipad._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VazhipadForm

