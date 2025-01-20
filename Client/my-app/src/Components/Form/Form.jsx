import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';
import { toast } from 'react-toastify';

function Form() {
  const navigate = useNavigate();

  const ip = process.env.REACT_APP_BACKEND_IP;
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    darshanaTime: {
      morning: { from: '', to: '' },
      evening: { from: '', to: '' }
    },
    whatsapp: '',
    email: '',
    password:'',
    role:'2',
    website: '',
    templeType: '', 
    locationSketch: '',
    history: '',
    mainDeity: '', 
    subDeities: '', 
    otherShrines: '', 
    buildings: '', 
    monthlyIncome: '',
    employees: '',
    mainOfferings: '',
    chiefPriest: '', 
    mainFestival: '', 
    landOwnership: '', 
    managementType: '', 
    registrationDetails: '',
    billingSystem: '',
    hasInternet: false,
    hasComputer: false,
    hasPrinter: false,
    hasCamera: false,
    hasDigitalBanking: false,
    managers: '',
    bankDetails: '',
    presidentDetails: '',
    secretaryDetails: '',
    festivals: '',
    specialEvents: '',
    ayanaSpecialties: '', 
    monthlySpecialties: '', 
    chiefPriestDetails: '', 
    kazhakamDetails: '', 
    emergencyDetails: '',
    sreekaaryamDetails: '', 
    puramDetails: '', 
    securityDetails: '', 
    templeAssets: '',
    hasBuilding: false,
    hasSafe: false,
    declarationPlace: '',
    declarationDate: '',
    applicantDetails: '',
    committeeDecision: '',
    membershipNumber: '',
    decisionDate: '',
    presidentPermanent: '',
    presidentTemporary: '',
    presidentPhone: '',
    secretaryPermanent: '',
    secretaryTemporary: '',
    secretaryPhone: '',
    treasurerPermanent: '',
    treasurerTemporary: '',
    treasurerPhone: '',
    state: '',
    district: '',
    taluk: ''
  });

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/states/getAllStates`);
      setStates(response.data.states || []);
    } catch (err) {
      setError('Failed to fetch states');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`);
      const filteredDistricts = response.data.filter(
        (district) => district.state._id === stateId
      );
      setDistricts(filteredDistricts || []);
    } catch (err) {
      setError('Failed to fetch districts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTaluks = async (districtId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/taluks/getAllTaluks`);
      const filteredTaluks = response.data.filter(
        (taluk) => taluk.district._id === districtId
      );
      setTaluks(filteredTaluks || []);
    } catch (err) {
      setError('Failed to fetch taluks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {...formData};
    if(name.includes('.')){
        const parts = name.split('.');
        let currentLevel = updatedFormData;
        for(let i = 0; i < parts.length -1; i++){
            currentLevel = currentLevel[parts[i]];
        }
        currentLevel[parts[parts.length -1]] = value;
    } else {
        updatedFormData[name] = value;
    }
    setFormData(updatedFormData);

    if (name === 'state') {
      setFormData(prevState => ({ ...prevState, district: '', taluk: '' }));
    } else if (name === 'district') {
      setFormData(prevState => ({ ...prevState, taluk: '' }));
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    const stateName = states.find(state => state._id === stateId)?.name || '';
    setSelectedState(stateId);
    setFormData(prevState => ({
      ...prevState,
      state: stateName,
      district: '',
      taluk: ''
    }));
    fetchDistricts(stateId);
    setSelectedDistrict('');
    setSelectedTaluk('');
    setTaluks([]);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const districtName = districts.find(district => district._id === districtId)?.name || '';
    setSelectedDistrict(districtId);
    setFormData(prevState => ({
      ...prevState,
      district: districtName,
      taluk: ''
    }));
    fetchTaluks(districtId);
    setSelectedTaluk('');
  };

  const handleTalukChange = (e) => {
    const talukId = e.target.value;
    const talukName = taluks.find(taluk => taluk._id === talukId)?.name || '';
    setSelectedTaluk(talukId);
    setFormData(prevState => ({
      ...prevState,
      taluk: talukName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
  
    try {
      // First create user account for temple
      const userResponse = await axios.post(`${ip}/api/UserRoutes/registerUser`, {
        fullName: formData.name, // Use temple name as full name
        email: formData.email,
        password: formData.password,
        role: "2", // Set role as temple
      })
  console.log(userResponse);
  
      // Then create temple record with user reference
      const templeData = {
        ...formData,
        userId: userResponse.data.user._id,
      }
  
      const templeResponse = await axios.post(`${ip}/api/temples/register`, templeData)
  
      toast.success("Temple registered successfully!")
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
  return (
    <div>
    <div className="form-container">
      <h1 className="form-title">ക്ഷേത്രേശ്രീ   ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
      <p className="form-group">കാലടി - 683 574., ഫോൺ : 9847047963</p>
      <p className="form-group">അപേക്ഷാഫോറം</p>
     
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="form-label">State</label>
          <select
            className='form-select'
            id="state"
            name="state"
            value={selectedState}
            onChange={handleStateChange}
            disabled={loading}
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
            className='form-select'
            id="district"
            name="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedState || loading}
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
            className='form-select'
            id="taluk"
            name="taluk"
            value={selectedTaluk}
            onChange={handleTalukChange}
            disabled={!selectedDistrict || loading}
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
          <label className="form-label">ക്ഷേത്രത്തിന്റെ പേര്  </label>
          <input 
            type="text" 
            className="form-input" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രത്തിന്റെ  മേൽവിലാസവും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ഫോൺ നമ്പർ</label>
          <input 
            type="tel" 
            className="form-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ദർശന സമയം</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">രാവിലെ</label>
              <div className="flex items-center">
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.morning.from"
                  value={formData.darshanaTime.morning.from}
                  onChange={handleChange}
                />
                <span className="mx-2">മുതൽ</span>
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.morning.to"
                  value={formData.darshanaTime.morning.to}
                  onChange={handleChange}
                />
                <span className="ml-2">വരെ</span>
              </div>
            </div>
            <div>
              <label className="form-label">വൈകിട്ട്</label>
              <div className="flex items-center">
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.evening.from"
                  value={formData.darshanaTime.evening.from}
                  onChange={handleChange}
                />
                <span className="mx-2">മുതൽ</span>
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.evening.to"
                  value={formData.darshanaTime.evening.to}
                  onChange={handleChange}
                />
                <span className="ml-2">വരെ</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="form-label">വാട്സ്ആപ്പ് നമ്പർ</label>
          <input 
            type="tel" 
            className="form-input" 
            name="whatsapp" 
            value={formData.whatsapp} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="form-label">മെയിൽ ഐ.ഡി.</label>
          <input 
            type="email" 
            className="form-input" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
        <div>
                  <label className="form-label">Password</label>
                  <div className="position-relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <i
                      className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                      onClick={() => togglePasswordVisibility("password")}
                    />
                  </div>
                </div>
                <div >
                  <label className="form-label">Confirm Password</label>
                  <div className="position-relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-input"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <i
                      className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                    />
                  </div>
                </div>
        <div>
          <label className="form-label">വെബ്സൈറ്റ്</label>
          <input 
            type="url" 
            className="form-input" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="form-label">ദേശക്ഷേത്ര വിവരം</label>
          <div className="form-radio-group">
            {['ദേശക്ഷേത്രം', 'മഹാക്ഷേത്രം', 'കുടുംബക്ഷേത്രം', 'കാവ്', 'മറ്റ്'].map((option) => (
              <label key={option} className="form-radio-label">
                <input 
                  type="radio" 
                  name="templeType" 
                  value={option} 
                  checked={formData.templeType === option}
                  onChange={handleChange}
                  className="form-radio" 
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">ലൊക്കേഷൻ സ്കെച്ച്</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="locationSketch"
            value={formData.locationSketch}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ക്ഷേത്ര ഐതിഹ്യം</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="history"
            value={formData.history}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div>
          <label className="form-label">പ്രതിഷ്ഠ</label>
          <input 
            type="text" 
            className="form-input"
            name="mainDeity"
            value={formData.mainDeity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ഉപദേവതാ</label>
          <input 
            type="text" 
            className="form-input"
            name="subDeities"
            value={formData.subDeities}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">മറ്റു പ്രതിഷ്ഠകൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="otherShrines"
            value={formData.otherShrines}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">പ്രാസാദങ്ങൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="buildings"
            value={formData.buildings}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ദിവസ-മാസവരുമാനം</label>
          <input 
            type="text" 
            className="form-input"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രജീവനക്കാർ</label>
          <input 
            type="text" 
            className="form-input"
            name="employees"
            value={formData.employees}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">പ്രധാന വഴിപാടുകൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="mainOfferings"
            value={formData.mainOfferings}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">തന്ത്രി</label>
          <input 
            type="text" 
            className="form-input"
            name="chiefPriest"
            value={formData.chiefPriest}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">മഹാനിവേദ്യം</label>
          <input 
            type="text" 
            className="form-input"
            name="mainFestival"
            value={formData.mainFestival}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ഊരാഴ്മ</label>
          <input 
            type="text" 
            className="form-input"
            name="landOwnership"
            value={formData.landOwnership}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്ര ഭരണസംവിധാനം</label>
          <select 
            className="form-select"
            name="managementType"
            value={formData.managementType}
            onChange={handleChange}
          >
            <option value="">തിരഞ്ഞെടുക്കുക</option>
            <option value="ട്രസ്റ്റ്">ട്രസ്റ്റ്</option>
            <option value="സേവാസമിതി">സേവാസമിതി</option>
            <option value="പൊതു">പൊതു</option>
          </select>
        </div>
        <div>
          <label className="form-label">കമ്മിറ്റി രജിസ്ട്രേഷൻ നമ്പറും മേൽവിലാസവും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="registrationDetails"
            value={formData.registrationDetails}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ബില്ലിംഗ് സംവിധാനം</label>
          <input 
            type="text" 
            className="form-input"
            name="billingSystem"
            value={formData.billingSystem}
            onChange={handleChange}
          />
        </div>
        <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
          <div>
            <label className="form-label">ഇന്റർനെറ്റ് സംവിധാനം</label>
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
                <span className="ml-2">ഉണ്ട്</span>
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
                <span className="ml-2">ഇല്ല</span>
              </label>
            </div>
          </div>
          <div>
            <label className="form-label" style={{paddingLeft:"10px"}}>കമ്പ്യൂട്ടർ</label>
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
                <span className="ml-2">ഉണ്ട്</span>
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
                <span className="ml-2">ഇല്ല</span>
              </label>
            </div>
          </div>
          <div>
            <label className="form-label" style={{paddingLeft:"10px"}}>പ്രിന്റർ</label>
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
                <span className="ml-2">ഉണ്ട്</span>
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
                <span className="ml-2">ഇല്ല</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="form-label" style={{paddingLeft:"10px"}}>ക്യാമറ</label>
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
                <span className="ml-2">ഉണ്ട്</span>
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
                <span className="ml-2">ഇല്ല</span>
              </label>
            </div>
          </div>
          <div>
            <label className="form-label">ഡിജിറ്റൽ ബാങ്കിംഗ്</label>
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
                <span className="ml-2">ഉണ്ട്</span>
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
                <span className="ml-2">ഇല്ല</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="form-label">കൈകാര്യം ചെയ്യുന്നവർ</label>
          <input 
            type="text" 
            className="form-input"
            name="managers"
            value={formData.managers}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ബാങ്ക് അക്കൗണ്ട് ഡീറ്റെയിൽസും ക്യുആർകോഡും ( പ്രസിഡന്റ്, സെക്രട്ടറി, ട്രഷറർ )</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="bankDetails"
            value={formData.bankDetails}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">പ്രസിഡന്റ് പേരും അഡ്രസും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="presidentDetails"
            value={formData.presidentDetails}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">സെക്രട്ടറി പേരും അഡ്രസും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="secretaryDetails"
            value={formData.secretaryDetails}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ഉത്സവം</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="festivals"
            value={formData.festivals}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">വിശേഷങ്ങ്ങൾ</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="specialEvents"
            value={formData.specialEvents}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">അയന വിശേഷം</label>
          <input 
            type="text" 
            className="form-input"
            name="ayanaSpecialties"
            value={formData.ayanaSpecialties}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">മാസവിശേഷം</label>
          <input 
            type="text" 
            className="form-input"
            name="monthlySpecialties"
            value={formData.monthlySpecialties}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">മേൽ ശാന്തി</label>
          <input 
            type="text" 
            className="form-input"
            name="chiefPriestDetails"
            value={formData.chiefPriestDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">കഴകം</label>
          <input 
            type="text" 
            className="form-input"
            name="kazhakamDetails"
            value={formData.kazhakamDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">അടിയന്തിരം</label>
          <input 
            type="text" 
            className="form-input"
            name="emergencyDetails"
            value={formData.emergencyDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ശ്രീകാര്യം</label>
          <input 
            type="text" 
            className="form-input"
            name="sreekaaryamDetails"
            value={formData.sreekaaryamDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">പുറം അടിച്ചുതളി</label>
          <input 
            type="text" 
            className="form-input"
            name="puramDetails"
            value={formData.puramDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">സെക്യൂരിറ്റി</label>
          <input 
            type="text" 
            className="form-input"
            name="securityDetails"
            value={formData.securityDetails}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രം വക വസ്തുക്കൾ</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="templeAssets"
            value={formData.templeAssets}
            onChange={handleChange}
          ></textarea>
        </div>
        <div style={{display:"flex",gap:"20px"}}>
        <div>
          <label className="form-label" style={{paddingLeft:"10px"}}>കെട്ടിടം</label>
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
              <span className="ml-2">ഉണ്ട്</span>
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
              <span className="ml-2">ഇല്ല</span>
            </label>
          </div>
        </div>
        <div>
          <label className="form-label" style={{paddingLeft:"10px"}}>സേഫ് / ലോക്കർ</label>
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
              <span className="ml-2">ഉണ്ട്</span>
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
              <span className="ml-2">ഇല്ല</span>
            </label>
          </div>
        </div>
        </div>
        <div >
          <label className="form-label">സത്യവാങ്മൂലം</label>
          <p className="form-group">മേൽ പറഞ്ഞിരിക്കുന്ന കാര്യങ്ങൾ എന്റെ / ഞങ്ങളുടെ അറിവിലും വിശ്വാസത്തിലും സത്യമാണെന്നും ശ്രീശുദ്ധി ക്ഷേത്രോദ്ധാരണപദ്ധതിയുടെ നിബന്ധനകൾക്കുവിധേയമായിപ്രവർത്തിച്ചുകൊള്ളാമെന്നും ഇതിനാൽ ഉറപ്പുനൽകുന്നു.</p>
        </div>
        <div className="grid-container">
          <div>
            <label className="form-label">സ്ഥലം</label>
            <input 
              type="text" 
              className="form-input"
              name="declarationPlace"
              value={formData.declarationPlace}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">തീയതി</label>
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
          <label className="form-label">അപേക്ഷകന്റെ പേരും സ്ഥാനപ്പേരും ഒപ്പും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="applicantDetails"
            value={formData.applicantDetails}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="border-t pt-4 mt-4">
          <h2 className="section-title">ഓഫീസ് ഉപയോഗത്തിന്</h2>
          <div>
            <label className="form-label">കമ്മിറ്റി തീരുമാനം</label>
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
              <label className="form-label">അംഗത്വ നമ്പർ</label>
              <input 
                type="text" 
                className="form-input"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">തീയതി</label>
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
          <h2 className="section-title">സി.ഇ.ഒ.</h2>
          <p>അഡ്വ. ബ്രഹ്മശ്രീ ഈശാനൻ നമ്പൂതിരിപ്പാട്</p>
          <p>വേഴപ്പറമ്പ് മന, മനയ്ക്കപ്പടി, എൻ. പറവൂർ</p>
        </div>
        <div className="grid-container">
          <div>
            <h3 className="font-bold mb-2">പ്രസിഡന്റ്</h3>
            <div>
              <label className="form-label">സ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="presidentPermanent"
                value={formData.presidentPermanent}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">അസ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="presidentTemporary"
                value={formData.presidentTemporary}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="presidentPhone"
                value={formData.presidentPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">സെക്രട്ടറി</h3>
            <div>
              <label className="form-label">സ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="secretaryPermanent"
                value={formData.secretaryPermanent}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">അസ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="secretaryTemporary"
                value={formData.secretaryTemporary}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="secretaryPhone"
                value={formData.secretaryPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">ട്രഷറർ</h3>
            <div>
              <label className="form-label">സ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="treasurerPermanent"
                value={formData.treasurerPermanent}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">അസ്ഥിരം</label>
              <input 
                type="text" 
                className="form-input"
                name="treasurerTemporary"
                value={formData.treasurerTemporary}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="treasurerPhone"
                value={formData.treasurerPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="form-submit">
          സമർപ്പിക്കുക
        </button>
      </form>





      
    </div>
    
    </div>
  );
}



export default Form;

