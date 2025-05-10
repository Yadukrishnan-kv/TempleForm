
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Addform.css"
import Header from "../Header/Header"
import Sidebar from "../Sidebar/Sidebar"
import { toast } from "react-toastify"

function Addform() {
  const navigate = useNavigate()

  const ip = process.env.REACT_APP_BACKEND_IP
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [taluks, setTaluks] = useState([])
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedTaluk, setSelectedTaluk] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    locationUrl: "",
    phone: "",
    darshanaTime: {
      morning: { from: "", to: "" },
      evening: { from: "", to: "" },
    },
    whatsapp: "",
    email: "",
    password: "",
    role: "2",
    website: "", // This field is optional
    templeType: "",
    locationSketch: "",
    history: "",
    mainDeity: "",
    subDeities: "",
    otherShrines: "",
    buildings: "",
    monthlyIncome: "",
    employees: "",
    mainOfferings: "",
    chiefPriest: "",
    mainFestival: "",
    landOwnership: "",
    managementType: "",
    registrationDetails: "",
    billingSystem: "",
    hasInternet: false,
    hasComputer: false,
    hasPrinter: false,
    hasCamera: false,
    hasDigitalBanking: false,
    managers: "",
    bankDetails: "",
    presidentDetails: "",
    secretaryDetails: "",
    festivals: "",
    specialEvents: "",
    ayanaSpecialties: "",
    monthlySpecialties: "",
    chiefPriestDetails: "",
    kazhakamDetails: "",
    emergencyDetails: "",
    emergencyDetailsPermanent: false,
    emergencyDetailsPhone: "",
    sreekaaryamDetails: "",
    sreekaaryamDetailsPermanent: false,
    sreekaaryamDetailsPhone: "",
    puramDetails: "",
    puramDetailsPermanent: false,
    puramDetailsPhone: "",
    securityDetails: "",
    securityDetailsPermanent: false,
    securityDetailsPhone: "",
    templeAssets: "",
    templeAssetsPermanent: false,
    templeAssetsPhone: "",
    hasBuilding: false,
    hasSafe: false,
    declarationPlace: "",
    declarationDate: "",
    applicantDetails: "",
    committeeDecision: "",
    membershipNumber: "",
    decisionDate: "",
    state: "",
    district: "",
    taluk: "",
  })

  const fetchStates = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${ip}/api/states/getAllStates`)
      setStates(response.data.states || [])
    } catch (err) {
      setError("Failed to fetch states")
    } finally {
      setLoading(false)
    }
  }

  const fetchDistricts = async (stateId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`)
      const filteredDistricts = response.data.filter((district) => district.state._id === stateId)
      setDistricts(filteredDistricts || [])
    } catch (err) {
      setError("Failed to fetch districts")
    } finally {
      setLoading(false)
    }
  }

  const fetchTaluks = async (districtId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${ip}/api/taluks/getAllTaluks`)
      const filteredTaluks = response.data.filter((taluk) => taluk.district._id === districtId)
      setTaluks(filteredTaluks || [])
    } catch (err) {
      setError("Failed to fetch taluks")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedFormData = { ...formData }
    if (name.includes(".")) {
      const parts = name.split(".")
      let currentLevel = updatedFormData
      for (let i = 0; i < parts.length - 1; i++) {
        currentLevel = currentLevel[parts[i]]
      }
      currentLevel[parts[parts.length - 1]] = value
    } else {
      updatedFormData[name] = value
    }
    setFormData(updatedFormData)

    if (name === "state") {
      setFormData((prevState) => ({ ...prevState, district: "", taluk: "" }))
    } else if (name === "district") {
      setFormData((prevState) => ({ ...prevState, taluk: "" }))
    }
  }

  useEffect(() => {
    fetchStates()
  }, [])

  const handleStateChange = (e) => {
    const stateId = e.target.value
    const stateName = states.find((state) => state._id === stateId)?.name || ""
    setSelectedState(stateId)
    setFormData((prevState) => ({
      ...prevState,
      state: stateName,
      district: "",
      taluk: "",
    }))
    fetchDistricts(stateId)
    setSelectedDistrict("")
    setSelectedTaluk("")
    setTaluks([])
  }

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    const districtName = districts.find((district) => district._id === districtId)?.name || ""
    setSelectedDistrict(districtId)
    setFormData((prevState) => ({
      ...prevState,
      district: districtName,
      taluk: "",
    }))
    fetchTaluks(districtId)
    setSelectedTaluk("")
  }

  const handleTalukChange = (e) => {
    const talukId = e.target.value
    const talukName = taluks.find((taluk) => taluk._id === talukId)?.name || ""
    setSelectedTaluk(talukId)
    setFormData((prevState) => ({
      ...prevState,
      taluk: talukName,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate mandatory fields
    const mandatoryFields = {
      state: "State",
      district: "District",
      taluk: "Taluk",
      name: "Temple Name",
      address: "Temple Address",
      phone: "Phone Number",
      locationUrl: "Location",
    }

    const missingFields = []
    for (const [field, label] of Object.entries(mandatoryFields)) {
      if (!formData[field]) {
        missingFields.push(label)
      }
    }

    if (missingFields.length > 0) {
      setError(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`)
      toast.error(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`)
      return
    }
 if (!formData.email) {
    formData.email = `${formData.phone}@example.com`;    }
    if (!formData.password) {
      formData.password = formData.phone
    }
    try {
      console.log("Submitting form data:", formData)
      const response = await axios.post(`${ip}/api/temples/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Server response:", response)
      navigate("/SortSubmission")

      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Error registering temple:", error.response ? error.response.data : error.message)
      setError("An error occurred while submitting the form. Please try again.")
      toast.error("An error occurred while submitting the form.")
    }
  }
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="form-container">
          <h1 className="form-title">ക്ഷേത്രശ്രീ ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
          <p className="form-group">കാലടി, ശങ്കരമാർഗ് - 683 574., ഫോൺ : 9847047963</p>
          <p className="form-group">അപേക്ഷാഫോറം</p>

          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">State</label>
              <select
                className="form-select"
                id="state"
                name="state"
                value={selectedState}
                onChange={handleStateChange}
                disabled={loading}
                required
              >
                <option value="">Select a State</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">District</label>
              <select
                className="form-select"
                id="district"
                name="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedState || loading}
                required
              >
                <option value="">Select a District</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Taluk</label>
              <select
                className="form-select"
                id="taluk"
                name="taluk"
                value={selectedTaluk}
                onChange={handleTalukChange}
                disabled={!selectedDistrict || loading}
                required
              >
                <option value="">Select a Taluk</option>
                {taluks.map((taluk) => (
                  <option key={taluk._id} value={taluk._id}>
                    {taluk.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">
                Temple Name <span className="malayalam-text">(ക്ഷേത്രത്തിന്റെ പേര്)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">
                Temple Address
                <span className="malayalam-text">(ക്ഷേത്രത്തിന്റെ മേൽവിലാസം)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Phone Number <span className="malayalam-text">(ഫോൺ നമ്പർ)</span>
              </label>
              <input
                type="tel"
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">
                Location <span className="malayalam-text">(സ്ഥാനം)</span>
              </label>
              <input
                className="form-input"
                name="locationUrl"
                value={formData.locationUrl}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">
                Temple Type <span className="malayalam-text">(ക്ഷേത്ര വിവരം)</span>
              </label>
              <div className="form-radio-group">
                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Madam"
                    checked={formData.templeType === "Madam"}
                    onChange={handleChange}
                  />
                  <span>Madam(മഠം)</span>
                </label>

                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Kudumbakshetram"
                    checked={formData.templeType === "Kudumbakshetram"}
                    onChange={handleChange}
                  />
                  <span>Kudumbakshetram(കുടുംബക്ഷേത്രം)</span>
                </label>

                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Bajanamadam"
                    checked={formData.templeType === "Bajanamadam"}
                    onChange={handleChange}
                  />
                  <span>Bajanamadam(ഭജനമഠം)</span>
                </label>

                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Sevagramam"
                    checked={formData.templeType === "Sevagramam"}
                    onChange={handleChange}
                  />
                  <span>Sevagramam(സേവാഗ്രാമം)</span>
                </label>

                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Kaavukal"
                    checked={formData.templeType === "Kaavukal"}
                    onChange={handleChange}
                  />
                  <span>Kaavukal(കാവ്)</span>
                </label>

                <label className="form-radio-label flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="templeType"
                    value="Sarppakaav"
                    checked={formData.templeType === "Sarppakaav"}
                    onChange={handleChange}
                  />
                  <span>Sarppakaav(സർപ്പക്കാവ്)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="form-label">
                Temple Management System <span className="malayalam-text">(ക്ഷേത്ര ഭരണസംവിധാനം)</span>
              </label>
              <select
                className="form-select"
                name="managementType"
                value={formData.managementType}
                onChange={handleChange}
              >
                <option value="">Select / തിരഞ്ഞെടുക്കുക</option>
                <option value="ട്രസ്റ്റ്">Trust / ട്രസ്റ്റ്</option>
                <option value="സേവാസമിതി">Service Committee / സേവാസമിതി</option>
                <option value="പൊതു">Public / പൊതു</option>
              </select>
            </div>
            <div>
              <label className="form-label">
                WhatsApp Number <span className="malayalam-text">(വാട്സ്ആപ്പ് നമ്പർ)</span>
              </label>
              <input
                type="tel"
                className="form-input"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
    Email ID or Phone Number <span className="malayalam-text">(മെയിൽ ഐ.ഡി./ഫോൺ നമ്പർ)</span>
              </label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">
                Password <span className="malayalam-text">(പാസ്‌വേഡ്)</span>
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <i
                  className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                  onClick={() => togglePasswordVisibility("password")}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Confirm Password <span className="malayalam-text">(പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക)</span>
              </label>
              <div className="position-relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <i
                  className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Darshan Time <span className="malayalam-text">(ദർശന സമയം)</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Morning <span className="malayalam-text">(രാവിലെ)</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.morning.from"
                      value={formData.darshanaTime.morning.from}
                      onChange={handleChange}
                    />
                    <span className="mx-2">
                      from <span className="malayalam-text">(മുതൽ)</span>
                    </span>
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.morning.to"
                      value={formData.darshanaTime.morning.to}
                      onChange={handleChange}
                    />
                    <span className="ml-2">
                      to <span className="malayalam-text">(വരെ)</span>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Evening <span className="malayalam-text">(വൈകിട്ട്)</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.evening.from"
                      value={formData.darshanaTime.evening.from}
                      onChange={handleChange}
                    />
                    <span className="mx-2">
                      from <span className="malayalam-text">(മുതൽ)</span>
                    </span>
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.evening.to"
                      value={formData.darshanaTime.evening.to}
                      onChange={handleChange}
                    />
                    <span className="ml-2">
                      to <span className="malayalam-text">(വരെ)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">
                Website <span className="malayalam-text">(വെബ്സൈറ്റ്)</span> <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="url"
                className="form-input"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website if available"
              />
            </div>
        
            <div>
              <label className="form-label">
                Location Sketch <span className="malayalam-text">(ലൊക്കേഷൻ സ്കെച്ച്)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="locationSketch"
                value={formData.locationSketch}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Temple History <span className="malayalam-text">(ക്ഷേത്ര ഐതിഹ്യം)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="history"
                value={formData.history}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="form-label">
                Main Deity <span className="malayalam-text">(പ്രതിഷ്ഠ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="mainDeity"
                value={formData.mainDeity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Sub Deities <span className="malayalam-text">(ഉപദേവത)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="subDeities"
                value={formData.subDeities}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Other Shrines <span className="malayalam-text">(മറ്റു പ്രതിഷ്ഠകൾ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="otherShrines"
                value={formData.otherShrines}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Buildings <span className="malayalam-text">(പ്രസാദങ്ങൾ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="buildings"
                value={formData.buildings}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Daily/Monthly Income <span className="malayalam-text">(ദിവസ-മാസവരുമാനം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Temple Employees <span className="malayalam-text">(ക്ഷേത്രജീവനക്കാർ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Main Offerings <span className="malayalam-text">(പ്രധാന വഴിപാടുകൾ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="mainOfferings"
                value={formData.mainOfferings}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Chief Priest <span className="malayalam-text">(തന്ത്രി)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="chiefPriest"
                value={formData.chiefPriest}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Main Festival <span className="malayalam-text">(മഹാനിവേദ്യം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="mainFestival"
                value={formData.mainFestival}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Land Ownership <span className="malayalam-text">(ഊരാഴ്മ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="landOwnership"
                value={formData.landOwnership}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="form-label">
                Committee Registration Number and Address{" "}
                <span className="malayalam-text">(കമ്മിറ്റി രജിസ്ട്രേഷൻ നമ്പറും മേൽവിലാസവും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="registrationDetails"
                value={formData.registrationDetails}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Billing System <span className="malayalam-text">(ബില്ലിംഗ് സംവിധാനം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="billingSystem"
                value={formData.billingSystem}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <label className="form-label">
                  Internet <span className="malayalam-text">(ഇന്റർനെറ്റ് സംവിധാനം)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasInternet"
                      value={true}
                      checked={formData.hasInternet}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasInternet"
                      value={false}
                      checked={!formData.hasInternet}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Computer <span className="malayalam-text">(കമ്പ്യൂട്ടർ)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasComputer"
                      value={true}
                      checked={formData.hasComputer}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasComputer"
                      value={false}
                      checked={!formData.hasComputer}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Printer <span className="malayalam-text">(പ്രിന്റർ)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasPrinter"
                      value={true}
                      checked={formData.hasPrinter}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasPrinter"
                      value={false}
                      checked={!formData.hasPrinter}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Camera <span className="malayalam-text">(ക്യാമറ)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasCamera"
                      value={true}
                      checked={formData.hasCamera}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasCamera"
                      value={false}
                      checked={!formData.hasCamera}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">
                  Digital Banking <span className="malayalam-text">(ഡിജിറ്റൽ ബാങ്കിംഗ്)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasDigitalBanking"
                      value={true}
                      checked={formData.hasDigitalBanking}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasDigitalBanking"
                      value={false}
                      checked={!formData.hasDigitalBanking}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">
                Managers <span className="malayalam-text">(കൈകാര്യം ചെയ്യുന്നവർ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="managers"
                value={formData.managers}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Bank Account Details and QR Code <span className="malayalam-text">(ബാങ്ക് അക്കൗണ്ട് ഡീറ്റെയിൽസും ക്യുആർകോഡും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="bankDetails"
                value={formData.bankDetails}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                President's Name, Address and Phone Number{" "}
                <span className="malayalam-text">(പ്രസിഡന്റ് പേരും അഡ്രസും ഫോൺ നമ്പറും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="presidentDetails"
                value={formData.presidentDetails}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Secretary's Name, Address and Phone Number{" "}
                <span className="malayalam-text">(സെക്രട്ടറി പേരും അഡ്രസും ഫോൺ നമ്പറും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="secretaryDetails"
                value={formData.secretaryDetails}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Festivals <span className="malayalam-text">(ഉത്സവം)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="festivals"
                value={formData.festivals}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Special Events <span className="malayalam-text">(വിശേഷങ്ങൾ)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="specialEvents"
                value={formData.specialEvents}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Ayana Specialties <span className="malayalam-text">(അയന വിശേഷം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="ayanaSpecialties"
                value={formData.ayanaSpecialties}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Monthly Specialties <span className="malayalam-text">(മാസവിശേഷം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="monthlySpecialties"
                value={formData.monthlySpecialties}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Chief Priest <span className="malayalam-text">(മേൽ ശാന്തി)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="chiefPriestDetails"
                value={formData.chiefPriestDetails}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Temple Association <span className="malayalam-text">(കഴകം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="kazhakamDetails"
                value={formData.kazhakamDetails}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">
                Emergency Contact <span className="malayalam-text">(അടിയന്തിരം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="emergencyDetails"
                value={formData.emergencyDetails}
                onChange={handleChange}
              />
              <div className="form-radio-group mt-2">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="emergencyDetailsPermanent"
                    value={true}
                    checked={formData.emergencyDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Permanent(സ്ഥിരം)</span>
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="emergencyDetailsPermanent"
                    value={false}
                    checked={!formData.emergencyDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Temporary(അസ്ഥിരം)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="form-label">
                  Phone <span className="malayalam-text">(ഫോൺ)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  name="emergencyDetailsPhone"
                  value={formData.emergencyDetailsPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Temple Affairs <span className="malayalam-text">(ശ്രീകാര്യം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="sreekaaryamDetails"
                value={formData.sreekaaryamDetails}
                onChange={handleChange}
              />
              <div className="form-radio-group mt-2">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="sreekaaryamDetailsPermanent"
                    value={true}
                    checked={formData.sreekaaryamDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Permanent(സ്ഥിരം)</span>
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="sreekaaryamDetailsPermanent"
                    value={false}
                    checked={!formData.sreekaaryamDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Temporary(അസ്ഥിരം)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="form-label">
                  Phone <span className="malayalam-text">(ഫോൺ)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  name="sreekaaryamDetailsPhone"
                  value={formData.sreekaaryamDetailsPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Outer Rituals <span className="malayalam-text">(പുറം അടിച്ചുതളി)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="puramDetails"
                value={formData.puramDetails}
                onChange={handleChange}
              />
              <div className="form-radio-group mt-2">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="puramDetailsPermanent"
                    value={true}
                    checked={formData.puramDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Permanent(സ്ഥിരം)</span>
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="puramDetailsPermanent"
                    value={false}
                    checked={!formData.puramDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Temporary(അസ്ഥിരം)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="form-label">
                  Phone <span className="malayalam-text">(ഫോൺ)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  name="puramDetailsPhone"
                  value={formData.puramDetailsPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Security <span className="malayalam-text">(സെക്യൂരിറ്റി)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="securityDetails"
                value={formData.securityDetails}
                onChange={handleChange}
              />
              <div className="form-radio-group mt-2">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="securityDetailsPermanent"
                    value={true}
                    checked={formData.securityDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Permanent(സ്ഥിരം)</span>
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="securityDetailsPermanent"
                    value={false}
                    checked={!formData.securityDetailsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Temporary(അസ്ഥിരം)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="form-label">
                  Phone <span className="malayalam-text">(ഫോൺ)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  name="securityDetailsPhone"
                  value={formData.securityDetailsPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Temple Assets <span className="malayalam-text">(ക്ഷേത്രം വക വസ്തുക്കൾ)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="templeAssets"
                value={formData.templeAssets}
                onChange={handleChange}
              ></textarea>
              <div className="form-radio-group mt-2">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="templeAssetsPermanent"
                    value={true}
                    checked={formData.templeAssetsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Permanent(സ്ഥിരം)</span>
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="templeAssetsPermanent"
                    value={false}
                    checked={!formData.templeAssetsPermanent}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Temporary(അസ്ഥിരം)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="form-label">
                  Phone <span className="malayalam-text">(ഫോൺ)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  name="templeAssetsPhone"
                  value={formData.templeAssetsPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Building <span className="malayalam-text">(കെട്ടിടം)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasBuilding"
                      value={true}
                      checked={formData.hasBuilding}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasBuilding"
                      value={false}
                      checked={!formData.hasBuilding}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Safe / Locker <span className="malayalam-text">(സേഫ് / ലോക്കർ)</span>
                </label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasSafe"
                      value={true}
                      checked={formData.hasSafe}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes </span>
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="hasSafe"
                      value={false}
                      checked={!formData.hasSafe}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">No </span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">
                Declaration <span className="malayalam-text">(സത്യവാങ്മൂലം)</span>
              </label>
              <p className="form-groupform">
                I/We hereby declare that the information provided above is true to the best of my/our knowledge and
                belief, and I/we agree to abide by the rules and regulations of the Sree Suddhi Temple Renovation
                Project.
                <br />
                <br />
                മേൽ പറഞ്ഞിരിക്കുന്ന കാര്യങ്ങൾ എന്റെ / ഞങ്ങളുടെ അറിവിലും വിശ്വാസത്തിലും സത്യമാണെന്നും ശ്രീശുദ്ധി ക്ഷേത്രോദ്ധാരണപദ്ധതിയുടെ
                നിബന്ധനകൾക്കുവിധേയമായിപ്രവർത്തിച്ചുകൊള്ളാമെന്നും ഇതിനാൽ ഉറപ്പുനൽകുന്നു.
              </p>
            </div>
            <div className="grid-container">
              <div>
                <label className="form-label">
                  Place <span className="malayalam-text">(സ്ഥലം)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="declarationPlace"
                  value={formData.declarationPlace}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">
                  Date <span className="malayalam-text">(തീയതി)</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  name="declarationDate"
                  value={formData.declarationDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Applicant's Name, Designation and Signature{" "}
                <span className="malayalam-text">(അപേക്ഷകന്റെ പേരും സ്ഥാനപ്പേരും ഒപ്പും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="applicantDetails"
                value={formData.applicantDetails}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="border-t pt-4 mt-4">
              <h2 className="section-title">
                For Office Use <span className="malayalam-text">(ഓഫീസ് ഉപയോഗത്തിന്)</span>
              </h2>
              <div>
                <label className="form-label">
                  Committee Decision <span className="malayalam-text">(കമ്മിറ്റി തീരുമാനം)</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="ടി അപേക്ഷകന് ശ്രീശുദ്ധി ക്ഷേത്രോദ്ധാരണപദ്ധതിയുടെ ..................................................തീയതിയിലെ ഭരണസമിതി തീരുമാനമനുസരിച്ച് അംഗത്വം കൊടുക്കുവാൻ തീരുമാനിച്ചിരിക്കുന്നു/നിരസിച്ചിരിക്കുന്നു."
                  name="committeeDecision"
                  value={formData.committeeDecision}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="grid-container">
                <div>
                  <label className="form-label">
                    Membership Number <span className="malayalam-text">(അംഗത്വ നമ്പർ)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="membershipNumber"
                    value={formData.membershipNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Date <span className="malayalam-text">(തീയതി)</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    name="decisionDate"
                    value={formData.decisionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h2 className="section-title">
                CEO <span className="malayalam-text">(സി.ഇ.ഒ.)</span>
              </h2>
              <p>
                Adv. Brahmasree Eeshanan Namboothiripad{" "}
                <span className="malayalam-text">(അഡ്വ. ബ്രഹ്മശ്രീ ഈശാനൻ നമ്പൂതിരിപ്പാട്)</span>
              </p>
              <p>
                Vezhapparambu Mana, Manaykkappadi, N. Paravoor{" "}
                <span className="malayalam-text">(വേഴപ്പറമ്പ് മന, മനയ്ക്കപ്പടി, എൻ. പറവൂർ)</span>
              </p>
            </div>

            <button type="submit" className="form-submit">
              Submit <span className="malayalam-text">(സമർപ്പിക്കുക)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Addform

