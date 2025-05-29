import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import "./Form.css"
import { toast } from "react-toastify"
import Footer from "../HomePage/Footer"
import Navbar from "../HomePage/Navbar"
import '../../Pages/Admin/GalleryPage/GalleryPage.css';

function Form() {
  const navigate = useNavigate()
  const { templeId } = useParams();

  const ip = process.env.REACT_APP_BACKEND_IP
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [taluks, setTaluks] = useState([])
  const [lsgs, setLsgs] = useState([]);
  const [localities, setlocalities] = useState([]);

  const [selectedLsg, setSelectedLsg] = useState('');
  const [listselectedLsg, setlistselectedLsg] = useState([]);

  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedTaluk, setSelectedTaluk] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState({})
  const [selectedFiles, setSelectedFiles] = useState([]);

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
    website: "",
    Nation: "",
    lsg: "",
    templeType: "",
    description: "",
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
    Road: "",
    Landmark: "",
    Pincode: "",
    CodeNumber: "",
    operation: "",
    Refferal: "",
    BankName: "",
    Bankifsc: "",
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
  
  useEffect(() => {
    fetchLsgs();
  }, []);

  const fetchLsgs = async () => {
    try {
      const response = await axios.get(`${ip}/api/lsg/getAllLsgs`);
      setLsgs(response.data ?? []);
    } catch (error) {
      console.error('Error fetching LSGs:', error);
      setLsgs([]);
    }
  };

  const fetchSelectedLsgs = async (e) => {
    try {
      const lsgname = lsgs.find((lsg) => lsg._id === e.target.value)?.name || ""
      setSelectedLsg(e.target.value._id);
      setFormData((prevState) => ({
        ...prevState,
        lsg: e.target.value,
      }))
      const response = await axios.get(`${ip}/api/SelectedLsg/getAllSelectedLsgs`);
      console.log("Selected LSGs:", response.data);
      console.log("Selected :", e.target.value);
      console.log("Select:", formData.taluk);
      const filteredSelectedlsg = response.data.filter((lsg) => ( lsg.Taluk === formData.taluk && lsg.lsg === e.target.value));
      
      setlistselectedLsg( filteredSelectedlsg || []);
      console.log("Filtered Selected LSGs:", filteredSelectedlsg);
    } catch (error) {
      console.error('Error fetching LSGs:', error);
      setlistselectedLsg([]);
    }
  };
  

  const handlelocalities = async (e) => {
    try {
      const localityname = listselectedLsg.find((locality) => locality._id === e.target.value)?.name || ""
      setFormData((prevState) => ({
        ...prevState,
        address: localityname,
      }))
      setlocalities(e.target.value);
    } catch (error) {
      console.error('Error fetching LSGs:', error);
    }
  };

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

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      })
    }

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
    
    // Clear validation error for state
    if (validationErrors.state) {
      setValidationErrors({
        ...validationErrors,
        state: ""
      })
    }
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
    
    // Clear validation error for district
    if (validationErrors.district) {
      setValidationErrors({
        ...validationErrors,
        district: ""
      })
    }
  }

  const handleTalukChange = (e) => {
    const talukId = e.target.value
    const talukName = taluks.find((taluk) => taluk._id === talukId)?.name || ""
    setSelectedTaluk(talukId)
    setFormData((prevState) => ({
      ...prevState,
      taluk: talukName,
    }))
    
    // Clear validation error for taluk
    if (validationErrors.taluk) {
      setValidationErrors({
        ...validationErrors,
        taluk: ""
      })
    }
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 10) {
      alert('You can only upload up to 10 images at once');
      return;
    }
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate mandatory fields
    const mandatoryFields = {
      Nation: "Nation",
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

    setLoading(true)

    // Auto-fill email and password with phone number if they're empty
    if (!formData.email) {
      formData.email = `${formData.phone}@gmail.com`;
    }
    if (!formData.password) {
      formData.password = formData.phone
    }

    try {
      // First register the temple
      const templeResponse = await axios.post(`${ip}/api/temples/register`, formData);
      const registeredTempleId = templeResponse.data.temple._id || templeId;
      
      // If there are files to upload, upload them
      if (selectedFiles.length > 0) {
        const photoFormData = new FormData();
        selectedFiles.forEach(file => {
          photoFormData.append('photos', file);
        });
        
        await axios.post(`${ip}/api/Gallery/upload/${registeredTempleId}`, photoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success("Temple registered successfully with images!")
      navigate("/signin")
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  // Validate fields based on current step
  const validateStep = (step) => {
    const errors = {}
    
    if (step === 1) {
      // Validate first page fields
      if (!formData.name) errors.name = "Temple Name is required"
      if (!formData.Nation) errors.Nation = "Nation is required"
      if (!selectedState) errors.state = "State is required"
      if (!selectedDistrict) errors.district = "District is required"
      if (!selectedTaluk) errors.taluk = "Taluk is required"
    } 
    else if (step === 2) {
      // Validate second page fields
      if (!formData.lsg) errors.lsg = "Local self government body is required"
      if (!formData.address) errors.address = "Locality Name is required"
      if (!formData.Pincode) errors.Pincode = "Pincode is required"
    }
    else if (step === 3) {
      // Validate third page fields
      if (!formData.templeType) errors.templeType = "Temple Type is required"
      if (!formData.managementType) errors.managementType = "Temple Management System is required"
    }
    else if (step === 8) {
      // Validate eighth page fields
      if (!formData.phone) errors.phone = "Phone Number is required"
      if (!formData.locationUrl) errors.locationUrl = "Location is required"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Go to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  // Go to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Helper function to render required star
  const requiredStar = () => (
    <span style={{ color: "red", marginLeft: "3px" }}>*</span>
  )

  // Total number of steps
  const totalSteps = 10

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h1 className="form-title">ക്ഷേത്രശ്രീ ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
        <p className="form-group">കാലടി, ശങ്കരമാർഗ് - 683 574., ഫോൺ : 9188910001, 9188910002</p>
        <p className="form-group">അപേക്ഷാഫോറം</p>

        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Step 1: Basic Temple Information */}
        {currentStep === 1 && (
          <div className="step-content">
            <div>
              <label className="form-label">
                Temple Name <span className="malayalam-text">(ക്ഷേത്രത്തിന്റെ പേര്)</span>{requiredStar()}
              </label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter temple name"
                required
              />
              {validationErrors.name && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.name}
                </div>
              )}
            </div>
            <div>
              <label className="form-label">
                Nation <span className="malayalam-text">(ദേശം)</span>{requiredStar()}
              </label>
              <select
                className="form-select"
                name="Nation"
                value={formData.Nation}
                onChange={handleChange}
                required
              >
                <option value="">Select Nation</option>
                <option value="India">India</option>
                {/* Add more options here if needed */}
              </select>
              {validationErrors.Nation && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.Nation}
                </div>
              )}
            </div>
         
            <div>
              <label className="form-label">State<span className="malayalam-text">(സംസ്ഥാനം )</span>{requiredStar()}</label>
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
              {validationErrors.state && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.state}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">District<span className="malayalam-text">(ജില്ല )</span>{requiredStar()}</label>
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
              {validationErrors.district && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.district}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Taluk<span className="malayalam-text">(താലൂക്ക് )</span>{requiredStar()}</label>
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
              {validationErrors.taluk && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.taluk}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Location Details */}
        {currentStep === 2 && (
          <div className="step-content">
            <div>
              <label className="form-label">LSG {requiredStar()}</label>
              <select
                className="form-select"
                id="lsg"
                name="lsg"
                value={selectedLsg}
                onChange={fetchSelectedLsgs}
                disabled={loading}
                required
              >
                <option value="">Select an LSG</option>
                {lsgs.map((lsg) => (
                  <option key={lsg._id} value={lsg.name}>
                    {lsg.name}
                  </option>
                ))}
              </select>
              {validationErrors.lsg && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.lsg}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">
                Locality Name <span className="malayalam-text">(പ്രദേശത്തിന്റെ പേര്)</span>{requiredStar()}
              </label>
              <select
                className="form-select"
                name="address"
                value={localities}
                onChange={handlelocalities}
                required
              >
                <option value="">Select a Locality</option>
                {listselectedLsg.map((locality) => (
                  <option key={locality._id} value={locality._id}>
                    {locality.name}
                  </option>
                ))}
              </select>
              {validationErrors.address && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.address}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">
                Road Name <span className="malayalam-text">(റോഡിന്റെ പേര്)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="Road"
                value={formData.Road}
                onChange={handleChange}
                placeholder="Enter road name"
              />
            </div>
            <div>
              <label className="form-label">
                Landmark <span className="malayalam-text">(അടയാളചിഹ്നം)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="Landmark"
                value={formData.Landmark}
                onChange={handleChange}
                placeholder="Enter landmark"
              />
            </div>
            <div>
              <label className="form-label">
                Pincode <span className="malayalam-text">(പിൻകോഡ് )</span>{requiredStar()}
              </label>
              <input
                type="text"
                className="form-input"
                name="Pincode"
                value={formData.Pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />
              {validationErrors.Pincode && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.Pincode}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Temple Type and Management */}
        {currentStep === 3 && (
          <div className="step-content">
            <div>
              <label className="addform-label">
                Temple Type <span className="malayalam-text">(ക്ഷേത്ര വിവരം)</span>{requiredStar()}
              </label>
              <div className="addform-radio-group">
                {[
                  { value: "Madam", label: "Madam(മഠം)" },
                  { value: "Desakshetram", label: "Desakshetram(ദേശക്ഷേത്രം)" },
                  { value: "Kudumbakshetram", label: "Kudumbakshetram(കുടുംബക്ഷേത്രം)" },
                  { value: "Bajanamadam", label: "Bajanamadam(ഭജനമഠം)" },
                  { value: "Sevagramam", label: "Sevagramam(സേവാഗ്രാമം)" },
                  { value: "Kaavukal", label: "Kaavukal(കാവ്)" },
                  { value: "Sarppakaav", label: "Sarppakaav(സർപ്പക്കാവ്)" },
                ].map((option) => (
                  <label key={option.value} className="addform-radio-label">
                    <input
                      type="radio"
                      name="templeType"
                      value={option.value}
                      checked={formData.templeType === option.value}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.templeType && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.templeType}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">
                Temple Management System <span className="malayalam-text">(ക്ഷേത്ര ഭരണസംവിധാനം)</span>{requiredStar()}
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
              {validationErrors.managementType && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.managementType}
                </div>
              )}
            </div>

               <div>
              <label className="form-label">
                Temple description <span className="malayalam-text">(ക്ഷേത്രത്തിന്റെ വിവരണം )</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 4: Deities */}
        {currentStep === 4 && (
          <div className="step-content">
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
                placeholder="Enter main deity"
              />
            </div>
            <div>
              <label className="form-label">
                Sub Deities <span className="malayalam-text">(ഉപദേവത )</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="subDeities"
                value={formData.subDeities}
                onChange={handleChange}
                placeholder="Enter sub deities"
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
                placeholder="Enter other shrines"
              />
            </div>
          </div>
        )}

        {/* Step 5: Timings and Festivals */}
        {currentStep === 5 && (
          <div className="step-content">
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
                      placeholder="From"
                    />
                    <span className="mx-2">
                      to <span className="malayalam-text">(മുതൽ)</span>
                    </span>
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.morning.to"
                      value={formData.darshanaTime.morning.to}
                      onChange={handleChange}
                      placeholder="To"
                    />
                    <span className="ml-2">
                      until <span className="malayalam-text">(വരെ)</span>
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
                      placeholder="From"
                    />
                    <span className="mx-2">
                      to <span className="malayalam-text">(മുതൽ)</span>
                    </span>
                    <input
                      type="time"
                      className="form-input"
                      name="darshanaTime.evening.to"
                      value={formData.darshanaTime.evening.to}
                      onChange={handleChange}
                      placeholder="To"
                    />
                    <span className="ml-2">
                      until <span className="malayalam-text">(വരെ)</span>
                    </span>
                  </div>
                </div>
              </div>
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
                placeholder="Enter main festival"
              />
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
                placeholder="Enter festivals"
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Special Events <span className="malayalam-text">(വിശേഷങ്ങൾ )</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="specialEvents"
                value={formData.specialEvents}
                onChange={handleChange}
                placeholder="Enter special events"
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
                placeholder="Enter ayana specialties"
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
                placeholder="Enter monthly specialties"
              />
            </div>
          </div>
        )}

        {/* Step 6: Temple Features */}
        {currentStep === 6 && (
          <div className="step-content">
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
                placeholder="Enter temple history"
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Buildings <span className="malayalam-text">(പ്രസാദങ്ങൾ )</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="buildings"
                value={formData.buildings}
                onChange={handleChange}
                placeholder="Enter buildings"
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
                placeholder="Enter main offerings"
              />
            </div>
          </div>
        )}

        {/* Step 7: Management Details */}
        {currentStep === 7 && (
          <div className="step-content">
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
                placeholder="Enter chief priest"
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
                placeholder="Enter chief priest details"
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
                placeholder="Enter temple association"
              />
            </div>
            <div>
              <label className="form-label">
                President's Name and Phone Number{" "}
                <span className="malayalam-text">(പ്രസിഡന്റ് പേരും  ഫോൺ നമ്പറും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="presidentDetails"
                value={formData.presidentDetails}
                onChange={handleChange}
                placeholder="Enter president's details"
              ></textarea>
            </div>
            <div>
              <label className="form-label">
                Secretary's Name and Phone Number{" "}
                <span className="malayalam-text">(സെക്രട്ടറി പേരും  ഫോൺ നമ്പറും)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                name="secretaryDetails"
                value={formData.secretaryDetails}
                onChange={handleChange}
                placeholder="Enter secretary's details"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 8: Contact Information */}
        {currentStep === 8 && (
          <div className="step-content">
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
                Phone Number <span className="malayalam-text">(ഫോൺ നമ്പർ)</span>{requiredStar()}
              </label>
              <input
                type="tel"
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
              {validationErrors.phone && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.phone}
                </div>
              )}
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
                placeholder="Enter WhatsApp number"
              />
            </div>
            <div>
              <label className="form-label">
                Location <span className="malayalam-text">(സ്ഥാനം)</span>{requiredStar()}
              </label>
              <input
                className="form-input"
                name="locationUrl"
                value={formData.locationUrl}
                onChange={handleChange}
                placeholder="Enter location URL"
                required
              />
              {validationErrors.locationUrl && (
                <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {validationErrors.locationUrl}
                </div>
              )}
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
                placeholder="Enter committee registration details"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 9: Facilities */}
        {currentStep === 9 && (
          <div className="step-content">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <label className="form-label">
                  Internet <span className="malayalam-text">(ഇന്റർനെറ്റ് സംവിധാനം)</span>
                </label>
                <div className="addform-radio-group">
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasInternet"
                      value={true}
                      checked={formData.hasInternet === true || formData.hasInternet === "true"}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">Yes</span>
                  </label>
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasInternet"
                      value={false}
                      checked={formData.hasInternet === false || formData.hasInternet === "false"}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Computer <span className="malayalam-text">(കമ്പ്യൂട്ടർ)</span>
                </label>
                <div className="addform-radio-group">
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasComputer"
                      value={true}
                      checked={formData.hasComputer}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">Yes</span>
                  </label>
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasComputer"
                      value={false}
                      checked={!formData.hasComputer}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Printer <span className="malayalam-text">(പ്രിന്റർ)</span>
                </label>
                <div className="addform-radio-group">
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasPrinter"
                      value={true}
                      checked={formData.hasPrinter}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">Yes</span>
                  </label>
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasPrinter"
                      value={false}
                      checked={!formData.hasPrinter}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ paddingLeft: "10px" }}>
                  Camera <span className="malayalam-text">(ക്യാമറ)</span>
                </label>
                <div className="addform-radio-group">
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasCamera"
                      value={true}
                      checked={formData.hasCamera}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">Yes</span>
                  </label>
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasCamera"
                      value={false}
                      checked={!formData.hasCamera}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">
                  Digital Banking <span className="malayalam-text">(ഡിജിറ്റൽ ബാങ്കിംഗ്)</span>
                </label>
                <div className="addform-radio-group">
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasDigitalBanking"
                      value={true}
                      checked={formData.hasDigitalBanking}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">Yes</span>
                  </label>
                  <label className="addform-radio-label">
                    <input
                      type="radio"
                      name="hasDigitalBanking"
                      value={false}
                      checked={!formData.hasDigitalBanking}
                      onChange={handleChange}
                      className="addform-radio-input"
                    />
                    <span className="addform-radio-text">No</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">
                Bank Account Number <span className="malayalam-text">(ബാങ്ക് അക്കൗണ്ട് നമ്പർ)</span>
              </label>
              <input   className="form-input"
                name="bankDetails"
                value={formData.bankDetails}
                onChange={handleChange}
                placeholder="Enter Bank Account Number"
              ></ input>
            </div>
             <div>
              <label className="form-label">
                Bank Name<span className="malayalam-text">(ബാങ്ക് പേര്)</span>
              </label>
              <input   className="form-input"
                name="BankName"
                value={formData.BankName}
                onChange={handleChange}
                placeholder="Enter Bank Name"
              ></ input>
            </div>
            <div>
              <label className="form-label">
                Ifsc Code<span className="malayalam-text">(ഐഎഫ്എസ്എസി കോഡ്)</span>
              </label>
              <input   className="form-input"
                name="Bankifsc"
                value={formData.Bankifsc}
                onChange={handleChange}
                placeholder="Enter Bank  Ifsc Code"
              ></ input>
            </div>
             <div >
                   <label className="form-label">
                Add Images <span className="malayalam-text">(Select up to 10 images to upload)</span>
                    
                 </label>
                <div className="regform-file-input">
                  
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                    className="file-input" 
                  />
                  {selectedFiles.length > 0 && (
                    <div className="selected-files-info">
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
          </div>

          
        )}

        {/* Step 10: Account Details and Image Upload */}
        {currentStep === 10 && (
          <div className="step-content">
            <div>
              <label className="form-label">
                Email ID or Phone Number <span className="malayalam-text">(മെയിൽ ഐ.ഡി./ഫോൺ നമ്പർ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email or phone number"
              />
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
                  placeholder="Enter password"
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
                  placeholder="Confirm password"
                />
                <i
                  className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                />
              </div>
            </div>
            <div>
              <label className="form-label">
                Refferal Name  <span className="malayalam-text">(പരാമർശിച്ച വ്യക്തിയുടെ പേര്)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="Refferal"
                value={formData.Refferal}
                onChange={handleChange}
                placeholder="Enter referral name"
              />
            </div>
            <div>
              <label className="form-label">
                Area of operation Taluk/District  <span className="malayalam-text">( പ്രവർത്തന മേഖലം (താലുക്ക്/ജില്ല))</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                placeholder="Enter area of operation"
              />
            </div>
            <div>
              <label className="form-label">
                Code Number <span className="malayalam-text">(കോഡ് നമ്പർ)</span>
              </label>
              <input
                type="text"
                className="form-input"
                name="CodeNumber"
                value={formData.CodeNumber}
                onChange={handleChange}
                placeholder="Enter code number"
              />
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
                  placeholder="Enter place"
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
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"} <span className="malayalam-text">(സമർപ്പിക്കുക)</span>
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" className="prev-button" onClick={prevStep}>
              Previous
            </button>
          )}

          {currentStep < totalSteps && (
            <button type="button" className="next-button" onClick={nextStep}>
              Next
            </button>
          )}
        </div>
      </form>
      </div>
      <Footer />
    </div>
  )
}

export default Form