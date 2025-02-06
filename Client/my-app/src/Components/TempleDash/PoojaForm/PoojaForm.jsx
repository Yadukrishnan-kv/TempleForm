import { useState, useEffect } from "react"
import axios from "axios"
import "./Pooja.css"

const PoojaForm = () => {
  const ip = process.env.REACT_APP_BACKEND_IP

  const [poojaName, setPoojaName] = useState("")
  const [poojaStartTime, setPoojaStartTime] = useState("")
  const [poojaEndTime, setPoojaEndTime] = useState("")
  const [poojaStartAmPm, setPoojaStartAmPm] = useState("AM")
  const [poojaEndAmPm, setPoojaEndAmPm] = useState("AM")
  const [templeInfo, setTempleInfo] = useState(null)
  const [poojas, setPoojas] = useState([])
  const [editingPooja, setEditingPooja] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTempleInfo()
    fetchPoojas()
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

  const fetchPoojas = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${ip}/api/PoojaRoutes/GetPoojas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPoojas(response.data)
    } catch (error) {
      console.error("Error fetching poojas:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const poojaTime = `${poojaStartTime} ${poojaStartAmPm} to ${poojaEndTime} ${poojaEndAmPm}`

      if (editingPooja) {
        await axios.put(
          `${ip}/api/PoojaRoutes/UpdatePooja/${editingPooja._id}`,
          {
            name: poojaName,
            time: poojaTime,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setEditingPooja(null)
      } else {
        await axios.post(
          `${ip}/api/PoojaRoutes/CreatePooja`,
          {
            name: poojaName,
            time: poojaTime,
            templeName: templeInfo.name,
            templeEmail: templeInfo.email,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }

      alert(editingPooja ? "Pooja updated successfully!" : "Pooja added successfully!")
      setPoojaName("")
      setPoojaStartTime("")
      setPoojaEndTime("")
      setPoojaStartAmPm("AM")
      setPoojaEndAmPm("AM")
      setShowForm(false)
      fetchPoojas()
    } catch (error) {
      console.error("Error adding/updating pooja:", error)
      alert("Failed to add/update pooja")
    }
  }

  const handleEdit = (pooja) => {
    setEditingPooja(pooja)
    const [startTime, startAmPm, , endTime, endAmPm] = pooja.time.split(" ")
    setPoojaName(pooja.name)
    setPoojaStartTime(startTime)
    setPoojaEndTime(endTime)
    setPoojaStartAmPm(startAmPm)
    setPoojaEndAmPm(endAmPm)
    setShowForm(true)
  }

  const handleDelete = async (poojaId) => {
    if (window.confirm("Are you sure you want to delete this pooja?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${ip}/api/PoojaRoutes/DeletePooja/${poojaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert("Pooja deleted successfully!")
        fetchPoojas()
      } catch (error) {
        console.error("Error deleting pooja:", error)
        alert("Failed to delete pooja")
      }
    }
  }

  if (!templeInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="Vazhipadsubmission-page">
          {/* <h2>Pooja Management for {templeInfo.name}</h2> */}

          {!showForm && (
            <button className="add-button" onClick={() => setShowForm(true)}>
              Add New Pooja
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="state-form">
              <input
                type="text"
                value={poojaName}
                onChange={(e) => setPoojaName(e.target.value)}
                placeholder="Pooja Name"
                required
              />
              <div className="time-inputs">
                <div className="time-input-group">
                  <input
                    type="time"
                    value={poojaStartTime}
                    onChange={(e) => setPoojaStartTime(e.target.value)}
                    required
                  />
                  <select value={poojaStartAmPm} onChange={(e) => setPoojaStartAmPm(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <span className="to-text">to</span>
                <div className="time-input-group">
                  <input type="time" value={poojaEndTime} onChange={(e) => setPoojaEndTime(e.target.value)} required />
                  <select value={poojaEndAmPm} onChange={(e) => setPoojaEndAmPm(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" >
                  {editingPooja ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                 
                  onClick={() => {
                    setShowForm(false)
                    setEditingPooja(null)
                    setPoojaName("")
                    setPoojaStartTime("")
                    setPoojaEndTime("")
                    setPoojaStartAmPm("AM")
                    setPoojaEndAmPm("AM")
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="state-list">
            <h3>Poojas</h3>
            <table className="Vazhipad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {poojas.map((pooja) => (
                  <tr key={pooja._id}>
                    <td>{pooja.name}</td>
                    <td>{pooja.time}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-link" onClick={() => handleEdit(pooja)}>
                          Edit
                        </button>
                        <button className="delete-button1" onClick={() => handleDelete(pooja._id)}>
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

export default PoojaForm

