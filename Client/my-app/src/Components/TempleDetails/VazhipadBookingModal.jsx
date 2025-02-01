import { useState, useEffect } from "react"
import axios from "axios"

const nakshatras = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
]

const VazhipadBookingModal = ({ vazhipad, onClose, templeId }) => {
  const [selectedVazhipads, setSelectedVazhipads] = useState([
    { ...vazhipad, entries: [{ name: "", birthNakshatra: "" }] },
  ])
  const [totalAmount, setTotalAmount] = useState(vazhipad.price)
  const [availableVazhipads, setAvailableVazhipads] = useState([])
  const ip = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    fetchAvailableVazhipads()
  }, [])

  const fetchAvailableVazhipads = async () => {
    try {
      const response = await axios.get(`${ip}/api/VazhipadRoutes/GetVazhipads/${templeId}`)
      setAvailableVazhipads(response.data.filter((v) => v._id !== vazhipad._id))
    } catch (error) {
      console.error("Error fetching vazhipads:", error)
    }
  }

  const handleInputChange = (vazhipadIndex, entryIndex, event) => {
    const { name, value } = event.target
    const updatedVazhipads = [...selectedVazhipads]
    updatedVazhipads[vazhipadIndex].entries[entryIndex][name] = value
    setSelectedVazhipads(updatedVazhipads)
  }

  const addEntry = (vazhipadIndex) => {
    const updatedVazhipads = [...selectedVazhipads]
    updatedVazhipads[vazhipadIndex].entries.push({ name: "", birthNakshatra: "" })
    setSelectedVazhipads(updatedVazhipads)
    setTotalAmount(totalAmount + selectedVazhipads[vazhipadIndex].price)
  }

  const removeEntry = (vazhipadIndex, entryIndex) => {
    const updatedVazhipads = [...selectedVazhipads]
    updatedVazhipads[vazhipadIndex].entries.splice(entryIndex, 1)
    setSelectedVazhipads(updatedVazhipads)
    setTotalAmount(totalAmount - selectedVazhipads[vazhipadIndex].price)
  }

  const addVazhipad = (newVazhipad) => {
    setSelectedVazhipads([...selectedVazhipads, { ...newVazhipad, entries: [{ name: "", birthNakshatra: "" }] }])
    setTotalAmount(totalAmount + newVazhipad.price)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const bookingData = selectedVazhipads.map((v) => ({
        vazhipadId: v._id,
        vazhipadName: v.name,
        entries: v.entries,
      }))

      const response = await axios.post(
        `${ip}/api/VazhipadBooking/vazhipad-bookings`,
        {
          templeId,
          vazhipads: bookingData,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("Booking successful:", response.data)
      onClose()
    } catch (error) {
      console.error("Error booking vazhipad:", error)
    }
  }

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">Book Vazhipad</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {selectedVazhipads.map((selectedVazhipad, vazhipadIndex) => (
                <div key={vazhipadIndex} className="mb-4">
                  <h6 className="fw-semibold">{selectedVazhipad.name}</h6>
                  {selectedVazhipad.entries.map((entry, entryIndex) => (
                    <div key={entryIndex} className="mb-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="name"
                        value={entry.name}
                        onChange={(e) => handleInputChange(vazhipadIndex, entryIndex, e)}
                        placeholder="Name"
                        required
                      />
                      <select
                        className="form-select mb-2"
                        name="birthNakshatra"
                        value={entry.birthNakshatra}
                        onChange={(e) => handleInputChange(vazhipadIndex, entryIndex, e)}
                        required
                      >
                        <option value="">Select Nakshatra</option>
                        {nakshatras.map((nakshatra, index) => (
                          <option key={index} value={nakshatra}>
                            {nakshatra}
                          </option>
                        ))}
                      </select>
                      {entryIndex > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeEntry(vazhipadIndex, entryIndex)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mb-3"
                    onClick={() => addEntry(vazhipadIndex)}
                  >
                    <i className="fas fa-plus"></i> Add Entry for {selectedVazhipad.name}
                  </button>
                </div>
              ))}

              <div className="mb-3">
                <select className="form-select" onChange={(e) => addVazhipad(JSON.parse(e.target.value))} value="">
                  <option value="">Add another Vazhipad</option>
                  {availableVazhipads.map((v) => (
                    <option key={v._id} value={JSON.stringify(v)}>
                      {v.name} - ₹{v.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consolidated table for all vazhipads and entries */}
              {selectedVazhipads.some((v) => v.entries.some((e) => e.name && e.birthNakshatra)) && (
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>Vazhipad</th>
                      <th>Name</th>
                      <th>Birth Nakshatra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVazhipads.flatMap((v, vIndex) =>
                      v.entries.map(
                        (entry, eIndex) =>
                          entry.name &&
                          entry.birthNakshatra && (
                            <tr key={`${vIndex}-${eIndex}`}>
                              <td>{v.name}</td>
                              <td>{entry.name}</td>
                              <td>{entry.birthNakshatra}</td>
                            </tr>
                          ),
                      ),
                    )}
                  </tbody>
                </table>
              )}

              <p className="fw-bold fs-5">Total Amount: ₹{totalAmount}</p>
              <button type="submit" className="btn btn-primary w-100">
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VazhipadBookingModal

