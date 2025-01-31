import { useState } from "react"
import axios from "axios"

const PoojaForm = () => {
  const ip = process.env.REACT_APP_BACKEND_IP

  const [poojaName, setPoojaName] = useState("")
  const [poojaTime, setPoojaTime] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token") // Assuming you store the token in localStorage after login
      await axios.post(
        `${ip}/api/PoojaRoutes/CreatePooja`,
        { name: poojaName, time: poojaTime },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      alert("Pooja added successfully!")
      setPoojaName("")
      setPoojaTime("")
    } catch (error) {
      console.error("Error adding pooja:", error)
      alert("Failed to add pooja")
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add New Pooja</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="poojaName" className="block mb-1">
            Pooja Name:
          </label>
          <input
            type="text"
            id="poojaName"
            value={poojaName}
            onChange={(e) => setPoojaName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="poojaTime" className="block mb-1">
            Pooja Time:
          </label>
          <input
            type="time"
            id="poojaTime"
            value={poojaTime}
            onChange={(e) => setPoojaTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  )
}

export default PoojaForm



