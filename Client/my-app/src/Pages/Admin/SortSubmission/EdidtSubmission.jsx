import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';


function EditSubmission() {
    const navigate = useNavigate();
    const { id } = useParams();
    const ip = process.env.REACT_APP_BACKEND_IP;
   const [states, setStates] = useState([]);
     const [districts, setDistricts] = useState([]);
     const [taluks, setTaluks] = useState([]);
     const [selectedState, setSelectedState] = useState('');
     const [selectedDistrict, setSelectedDistrict] = useState('');
     const [selectedTaluk, setSelectedTaluk] = useState('');
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
    const [formData, setFormData] = useState({
       name: '',
       whatsapp: '',
       email: '',
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
       emergencyDetailsPermanent: false,
       emergencyDetailsPhone: '',
       sreekaaryamDetails: '', 
       sreekaaryamDetailsPermanent: false,
       sreekaaryamDetailsPhone: '',
       puramDetails: '', 
       puramDetailsPermanent: false,
       puramDetailsPhone: '',
       securityDetails: '', 
       securityDetailsPermanent: false,
       securityDetailsPhone: '',
       templeAssets: '',
       templeAssetsPermanent: false,
       templeAssetsPhone: '',
       hasBuilding: false,
       hasSafe: false,
       declarationPlace: '',
       declarationDate: '',
       applicantDetails: '',
       committeeDecision: '',
       membershipNumber: '',
       decisionDate: '',
       state: '',
       district: '',
       taluk: '',
       address: '',
       phone: '',
       locationUrl:'',
       darshanaTime: {
        morning: { from: '', to: '' },
        evening: { from: '', to: '' }
      },
     });
    const token = localStorage.getItem('token');
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      let updatedFormData = {...formData};
      
      if(name.includes('.')) {
        const parts = name.split('.');
        let currentLevel = updatedFormData;
        for(let i = 0; i < parts.length - 1; i++) {
          if (!currentLevel[parts[i]]) {
            currentLevel[parts[i]] = {};
          }
          currentLevel = currentLevel[parts[i]];
        }
        currentLevel[parts[parts.length - 1]] = value;
      } else {
        updatedFormData[name] = e.target.type === 'checkbox' ? e.target.checked : value;
      }
      
      setFormData(updatedFormData);
    };
    
      useEffect(() => {
        const fetchTempleData = async () => {
          setLoading(true);
          try {
            const response = await axios.get(`${ip}/api/temples/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setFormData(response.data);
          } catch (err) {
            console.error("Error fetching temple data:", err);
            setError("Failed to fetch temple data");
          } finally {
            setLoading(false);
          }
        };
  
        fetchTempleData();
      }, [id, token, ip]);
    

      const logAction = async (action, details) => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${ip}/api/adminlogin/log-action`,
            {
              action,
              module: 'Registration',
              subModule: 'List Details-Edit',
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
    

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
          await axios.put(`${ip}/api/temples/update/${id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate('/SortSubmission');
          await logAction('Update', `Updated state: ${formData}`);

          toast.success('Form updated successfully!'); 

        } catch (err) {
          console.error("Error updating temple data:", err);
          setError("Failed to update temple data");
          toast.error('Error updating form!'); 
          
        } finally {
          setLoading(false);
        }
      };
  

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
      


  return (
   
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
          <label className="form-label">ക്ഷേത്രത്തിന്റെ പേരും</label>
          <input 
            type="text" 
            className="form-input" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രത്തിന്റെ  മേൽവിലാസവും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ഫോൺ നമ്പർ</label>
          <input 
            type="tel" 
            className="form-input"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">Location</label>
          <input 
           
            className="form-input"
            name="locationUrl"
            value={formData.locationUrl}
            onChange={handleInputChange}
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
                  value={formData.darshanaTime?.morning?.from || ''}
                  onChange={handleInputChange}
                />
                <span className="mx-2">മുതൽ</span>
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.morning.to"
                  value={formData.darshanaTime?.morning?.to || ''}
                  onChange={handleInputChange}
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
                  value={formData.darshanaTime?.evening?.from || ''}
                  onChange={handleInputChange}
                />
                <span className="mx-2">മുതൽ</span>
                <input 
                  type="time" 
                  className="form-input"
                  name="darshanaTime.evening.to"
                  value={formData.darshanaTime?.evening?.to || ''}
                  onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">മെയിൽ ഐ.ഡി.</label>
          <input 
            type="email" 
            className="form-input" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">വെബ്സൈറ്റ്</label>
          <input 
            type="url" 
            className="form-input" 
            name="website" 
            value={formData.website} 
            onChange={handleInputChange}
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
        onChange={handleInputChange}
      />
      <span>Madam(മാഡം)</span>
    </label>

    <label className="form-radio-label flex items-center gap-2 mb-2">
      <input
        type="radio"
        name="templeType"
        value="Kudumbakshetram"
        checked={formData.templeType === "Kudumbakshetram"}
        onChange={handleInputChange}
      />
      <span>Kudumbakshetram(കുടുംബക്ഷേത്രം)</span>
    </label>

    <label className="form-radio-label flex items-center gap-2 mb-2">
      <input
        type="radio"
        name="templeType"
        value="Bajanamadam"
        checked={formData.templeType === "Bajanamadam"}
        onChange={handleInputChange}
      />
      <span>Bajanamadam(ഭജനമാഡം)</span>
    </label>

    <label className="form-radio-label flex items-center gap-2 mb-2">
      <input
        type="radio"
        name="templeType"
        value="Sevagramam"
        checked={formData.templeType === "Sevagramam"}
        onChange={handleInputChange}
      />
      <span>Sevagramam(സേവാഗ്രാമം)</span>
    </label>

    <label className="form-radio-label flex items-center gap-2 mb-2">
      <input
        type="radio"
        name="templeType"
        value="Kaavukal"
        checked={formData.templeType === "Kaavukal"}
        onChange={handleInputChange}
      />
      <span>Kaavukal(കാവ്)</span>
    </label>

    <label className="form-radio-label flex items-center gap-2 mb-2">
      <input
        type="radio"
        name="templeType"
        value="Sarppakaav"
        checked={formData.templeType === "Sarppakaav"}
        onChange={handleInputChange}
      />
      <span>Sarppakaav(സാർപ്പകാവ്)</span>
    </label>
  </div>
</div>
        <div>
          <label className="form-label">ലൊക്കേഷൻ സ്കെച്ച്</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="locationSketch"
            value={formData.locationSketch}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ക്ഷേത്ര ഐതിഹ്യം</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="history"
            value={formData.history}
            onChange={handleInputChange}
          ></textarea>
        </div>
        
        <div>
          <label className="form-label">പ്രതിഷ്ഠ</label>
          <input 
            type="text" 
            className="form-input"
            name="mainDeity"
            value={formData.mainDeity}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ഉപദേവതാ</label>
          <input 
            type="text" 
            className="form-input"
            name="subDeities"
            value={formData.subDeities}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">മറ്റു പ്രതിഷ്ഠകൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="otherShrines"
            value={formData.otherShrines}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">പ്രാസാദങ്ങൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="buildings"
            value={formData.buildings}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ദിവസ-മാസവരുമാനം</label>
          <input 
            type="text" 
            className="form-input"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രജീവനക്കാർ</label>
          <input 
            type="text" 
            className="form-input"
            name="employees"
            value={formData.employees}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">പ്രധാന വഴിപാടുകൾ</label>
          <input 
            type="text" 
            className="form-input"
            name="mainOfferings"
            value={formData.mainOfferings}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">തന്ത്രി</label>
          <input 
            type="text" 
            className="form-input"
            name="chiefPriest"
            value={formData.chiefPriest}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">മഹാനിവേദ്യം</label>
          <input 
            type="text" 
            className="form-input"
            name="mainFestival"
            value={formData.mainFestival}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ഊരാഴ്മ</label>
          <input 
            type="text" 
            className="form-input"
            name="landOwnership"
            value={formData.landOwnership}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ക്ഷേത്ര ഭരണസംവിധാനം</label>
          <select 
            className="form-select"
            name="managementType"
            value={formData.managementType}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ബില്ലിംഗ് സംവിധാനം</label>
          <input 
            type="text" 
            className="form-input"
            name="billingSystem"
            value={formData.billingSystem}
            onChange={handleInputChange}
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
                  value="true"
                  checked={formData.hasInternet === true}
                  onChange={(e) => setFormData({...formData, hasInternet: e.target.value === 'true'})}
                  className="form-radio" 
                />
                <span className="ml-2">ഉണ്ട്</span>
              </label>
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasInternet" 
                  value="false"
                  checked={formData.hasInternet === false}
                  onChange={(e) => setFormData({...formData, hasInternet: e.target.value === 'true'})}
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
                  value="true"
                  checked={formData.hasComputer === true}
                  onChange={(e) => setFormData({...formData, hasComputer: e.target.value === 'true'})}
                  className="form-radio" 
                />
                <span className="ml-2">ഉണ്ട്</span>
              </label>
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasComputer" 
                  value="false"
                  checked={formData.hasComputer === false}
                  onChange={(e) => setFormData({...formData, hasComputer: e.target.value === 'true'})}
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
                  value="true"
                  checked={formData.hasPrinter === true}
                  onChange={(e) => setFormData({...formData, hasPrinter: e.target.value === 'true'})}
                  className="form-radio" 
                />
                <span className="ml-2">ഉണ്ട്</span>
              </label>
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasPrinter" 
                  value="false"
                  checked={formData.hasPrinter === false}
                  onChange={(e) => setFormData({...formData, hasPrinter: e.target.value === 'true'})}
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
                  value="true"
                  checked={formData.hasCamera === true}
                  onChange={(e) => setFormData({...formData, hasCamera: e.target.value === 'true'})}
                  className="form-radio" 
                />
                <span className="ml-2">ഉണ്ട്</span>
              </label>
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasCamera" 
                  value="false"
                  checked={formData.hasCamera === false}
                  onChange={(e) => setFormData({...formData, hasCamera: e.target.value === 'true'})}
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
                  value="true"
                  checked={formData.hasDigitalBanking === true}
                  onChange={(e) => setFormData({...formData, hasDigitalBanking: e.target.value === 'true'})}
                  className="form-radio" 
                />
                <span className="ml-2">ഉണ്ട്</span>
              </label>
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasDigitalBanking" 
                  value="false"
                  checked={formData.hasDigitalBanking === false}
                  onChange={(e) => setFormData({...formData, hasDigitalBanking: e.target.value === 'true'})}
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
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">ബാങ്ക് അക്കൗണ്ട് ഡീറ്റെയിൽസും ക്യുആർകോഡും ( പ്രസിഡന്റ്, സെക്രട്ടറി, ട്രഷറർ )</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="bankDetails"
            value={formData.bankDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">പ്രസിഡന്റ് പേരും അഡ്രസും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="presidentDetails"
            value={formData.presidentDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">സെക്രട്ടറി പേരും അഡ്രസും ഫോൺ നമ്പറും</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="secretaryDetails"
            value={formData.secretaryDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">ഉത്സവം</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="festivals"
            value={formData.festivals}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">വിശേഷങ്ങ്ങൾ</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="specialEvents"
            value={formData.specialEvents}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label className="form-label">അയന വിശേഷം</label>
          <input 
            type="text" 
            className="form-input"
            name="ayanaSpecialties"
            value={formData.ayanaSpecialties}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">മാസവിശേഷം</label>
          <input 
            type="text" 
            className="form-input"
            name="monthlySpecialties"
            value={formData.monthlySpecialties}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">മേൽ ശാന്തി</label>
          <input 
            type="text" 
            className="form-input"
            name="chiefPriestDetails"
            value={formData.chiefPriestDetails}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">കഴകം</label>
          <input 
            type="text" 
            className="form-input"
            name="kazhakamDetails"
            value={formData.kazhakamDetails}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="form-label">അടിയന്തിരം</label>
          <input 
            type="text" 
            className="form-input"
            name="emergencyDetails"
            value={formData.emergencyDetails}
            onChange={handleInputChange}
          />
           <div className="form-radio-group mt-2">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="emergencyDetailsPermanent" 
                value={true}
                checked={formData.emergencyDetailsPermanent === true}
                onChange={(e) => setFormData({...formData, emergencyDetailsPermanent: e.target.value === 'true'})} 
                className="form-radio" 
              />
              <span className="ml-2">സ്ഥിരം</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="emergencyDetailsPermanent" 
                value={false}
                checked={formData.emergencyDetailsPermanent === false}
                onChange={(e) => setFormData({...formData, emergencyDetailsPermanent: e.target.value === 'true'})} 
                className="form-radio" 
              />
              <span className="ml-2">അസ്ഥിരം</span>
            </label>
          </div>
          <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="emergencyDetailsPhones"
                value={formData.emergencyDetailsPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        <div>
          <label className="form-label">ശ്രീകാര്യം</label>
          <input 
            type="text" 
            className="form-input"
            name="sreekaaryamDetails"
            value={formData.sreekaaryamDetails}
            onChange={handleInputChange}
          />
          <div className="form-radio-group mt-2">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="sreekaaryamDetailsPermanent" 
                value={true}
                checked={formData.sreekaaryamDetailsPermanent === true}
                onChange={(e) => setFormData({...formData, sreekaaryamDetailsPermanent: e.target.value === 'true'})} 
                className="form-radio" 
              />
              <span className="ml-2">സ്ഥിരം</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="sreekaaryamDetailsPermanent" 
                value={false}
                checked={formData.sreekaaryamDetailsPermanent === false}
                onChange={(e) => setFormData({...formData, sreekaaryamDetailsPermanent: e.target.value === 'true'})}  
                                className="form-radio" 
              />
              <span className="ml-2">അസ്ഥിരം</span>
            </label>
          </div>
          <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="sreekaaryamDetailsPhone"
                value={formData.sreekaaryamDetailsPhone}
                onChange={handleInputChange}
              />
            </div>
        </div>
        <div>
          <label className="form-label">പുറം അടിച്ചുതളി</label>
          <input 
            type="text" 
            className="form-input"
            name="puramDetails"
            value={formData.puramDetails}
            onChange={handleInputChange}
          />
          <div className="form-radio-group mt-2">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="puramDetailsPermanent" 
                value={true}
                checked={formData.puramDetailsPermanent === true}
                onChange={(e) => setFormData({...formData, puramDetailsPermanent: e.target.value === 'true'})}            
                    className="form-radio" 
              />
              <span className="ml-2">സ്ഥിരം</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="puramDetailsPermanent" 
                value={false}
                checked={formData.puramDetailsPermanent === false}
                onChange={(e) => setFormData({...formData, puramDetailsPermanent: e.target.value === 'true'})}  
                className="form-radio" 
              />
              <span className="ml-2">അസ്ഥിരം</span>
            </label>
          </div>
          <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="puramDetailsPhone"
                value={formData.puramDetailsPhone}
                onChange={handleInputChange}
              />
            </div>
        </div>
        <div>
          <label className="form-label">സെക്യൂരിറ്റി</label>
          <input 
            type="text" 
            className="form-input"
            name="securityDetails"
            value={formData.securityDetails}
            onChange={handleInputChange}
          />
          <div className="form-radio-group mt-2">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="securityDetailsPermanent" 
                value={true}
                checked={formData.securityDetailsPermanent === true}
                onChange={(e) => setFormData({...formData, securityDetailsPermanent: e.target.value === 'true'})}
                className="form-radio" 
              />
              <span className="ml-2">സ്ഥിരം</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="securityDetailsPermanent" 
                value={false}
                checked={formData.securityDetailsPermanent === false}
                onChange={(e) => setFormData({...formData, securityDetailsPermanent: e.target.value === 'true'})}
                className="form-radio" 
              />
              <span className="ml-2">അസ്ഥിരം</span>
            </label>
          </div>
          <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="securityDetailsPhone"
                value={formData.securityDetailsPhone}
                onChange={handleInputChange}
              />
            </div>
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രം വക വസ്തുക്കൾ</label>
          <textarea 
            className="form-textarea" 
            rows={3}
            name="templeAssets"
            value={formData.templeAssets}
            onChange={handleInputChange}
          ></textarea>
          <div className="form-radio-group mt-2">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="templeAssetsPermanent" 
                value={true}
                checked={formData.templeAssetsPermanent === true}
                onChange={(e) => setFormData({...formData, templeAssetsPermanent: e.target.value === 'true'})}
                  className="form-radio" 
              />
              <span className="ml-2">സ്ഥിരം</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="templeAssetsPermanent" 
                value={false}
                checked={formData.templeAssetsPermanent === false}
                onChange={(e) => setFormData({...formData, templeAssetsPermanent: e.target.value === 'true'})}  
                className="form-radio" 
              />
              <span className="ml-2">അസ്ഥിരം</span>
            </label>
          </div>
          <div className="mt-2">
              <label className="form-label">ഫോൺ</label>
              <input 
                type="tel" 
                className="form-input"
                name="templeAssetsPhone"
                value={formData.templeAssetsPhone}
                onChange={handleInputChange}
              />
            </div>
        </div>
        <div style={{display:"flex",gap:"20px"}}>
        <div>
          <label className="form-label" style={{paddingLeft:"10px"}}>കെട്ടിടം</label>
          <div className="form-radio-group">
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="hasBuilding" 
                value="true"
                checked={formData.hasBuilding === true}
                onChange={(e) => setFormData({...formData, hasBuilding: e.target.value === 'true'})}
                className="form-radio" 
              />
              <span className="ml-2">ഉണ്ട്</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="hasBuilding" 
                value="false"
                checked={formData.hasBuilding === false}
                onChange={(e) => setFormData({...formData, hasBuilding: e.target.value === 'true'})}
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
                value="true"
                checked={formData.hasSafe === true}
                onChange={(e) => setFormData({...formData, hasSafe: e.target.value === 'true'})}
                className="form-radio" 
              />
              <span className="ml-2">ഉണ്ട്</span>
            </label>
            <label className="form-radio-label">
              <input 
                type="radio" 
                name="hasSafe" 
                value="false"
                checked={formData.hasSafe === false}
                onChange={(e) => setFormData({...formData, hasSafe: e.target.value === 'true'})}
                className="form-radio" 
              />
              <span className="ml-2">ഇല്ല</span>
            </label>
          </div>
        </div>
        </div>
        <div >
          <label className="form-label">സത്യവാങ്മൂലം</label>
          <p className="form-groupform">മേൽ പറഞ്ഞിരിക്കുന്ന കാര്യങ്ങൾ എന്റെ / ഞങ്ങളുടെ അറിവിലും വിശ്വാസത്തിലും സത്യമാണെന്നും ശ്രീശുദ്ധി ക്ഷേത്രോദ്ധാരണപദ്ധതിയുടെ നിബന്ധനകൾക്കുവിധേയമായിപ്രവർത്തിച്ചുകൊള്ളാമെന്നും ഇതിനാൽ ഉറപ്പുനൽകുന്നു.</p>

        </div>
        <div className="grid-container">
          <div>
            <label className="form-label">സ്ഥലം</label>
            <input 
              type="text" 
              className="form-input"
              name="declarationPlace"
              value={formData.declarationPlace}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="form-<continuation_point>
label">തീയതി</label>
            <input 
              type="date" 
              className="form-input"
              name="declarationDate"
              value={formData.declarationDate ? new Date(formData.declarationDate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
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
            onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="form-label">തീയതി</label>
              <input 
                type="date" 
                className="form-input"
                name="decisionDate"
                value={formData.decisionDate ? new Date(formData.decisionDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <h2 className="section-title">സി.ഇ.ഒ.</h2>
          <p>അഡ്വ. ബ്രഹ്മശ്രീ ഈശാനൻ നമ്പൂതിരിപ്പാട്</p>
          <p>വേഴപ്പറമ്പ് മന, മനയ്ക്കപ്പടി, എൻ. പറവൂർ</p>
        </div>
        
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'സമർപ്പിക്കുന്നു...' : 'സമർപ്പിക്കുക'}
        </button>
      </form>
    </div>
      
   
  )
}

export default EditSubmission


