import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function Form() {
  const navigate = useNavigate();

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

  const states = ['Kerala', 'Tamil Nadu'];

  const districts = {
    'Kerala': [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode',
      'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ],
    'Tamil Nadu': [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode',
      'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam',
      'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
      'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
      'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ]
  };

  const taluks = {
    // Kerala
    'Alappuzha': ['Ambalappuzha', 'Chengannur', 'Cherthala', 'Karthikappally', 'Kuttanad', 'Mavelikkara'],
    'Ernakulam': ['Aluva', 'Kanayannur', 'Kochi', 'Kothamangalam', 'Kunnathunad', 'Muvattupuzha', 'North Paravur'],
    'Idukki': ['Devikulam', 'Idukki', 'Peerumade', 'Thodupuzha', 'Udumbanchola'],
    'Kannur': ['Kannur', 'Thalassery', 'Taliparamba', 'Iritty'],
    'Kasaragod': ['Hosdurg', 'Kasaragod', 'Manjeshwar', 'Vellarikundu'],
    'Kollam': ['Karunagappally', 'Kollam', 'Kottarakkara', 'Kunnattur', 'Pathanapuram'],
    'Kottayam': ['Changanassery', 'Kanjirappally', 'Kottayam', 'Meenachil', 'Vaikom'],
    'Kozhikode': ['Kozhikode', 'Quilandy', 'Vadakara', 'Koyilandy', 'Thamarassery'],
    'Malappuram': ['Ernad', 'Nilambur', 'Perinthalmanna', 'Ponnani', 'Tirur', 'Tirurangadi'],
    'Palakkad': ['Alathur', 'Chittur', 'Mannarkad', 'Ottappalam', 'Palakkad'],
    'Pathanamthitta': ['Adoor', 'Konni', 'Kozhencherry', 'Mallappally', 'Ranni', 'Thiruvalla'],
    'Thiruvananthapuram': ['Chirayinkeezhu', 'Nedumangad', 'Neyyattinkara', 'Thiruvananthapuram'],
    'Thrissur': ['Chavakkad', 'Kodungallur', 'Mukundapuram', 'Talappilly', 'Thrissur'],
    'Wayanad': ['Mananthavady', 'Sulthanbathery', 'Vythiri'],
    
    // Tamil Nadu (keeping the existing taluks)
    'Chennai': ['Egmore', 'Mylapore', 'Ambattur'],
    'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Pollachi'],
    'Madurai': ['Madurai North', 'Madurai South', 'Melur'],
    'Salem': ['Salem', 'Attur', 'Mettur']
    // ... (other Tamil Nadu districts)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'state') {
      setFormData(prevState => ({ ...prevState, district: '', taluk: '' }));
    } else if (name === 'district') {
      setFormData(prevState => ({ ...prevState, taluk: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http:///api/temples/register", formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response);
      navigate("/view");
    } catch (error) {
      console.error('Error registering temple:', error.response ? error.response.data : error.message);
    }
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
            className="form-select"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">District</label>
          <select 
            className="form-select"
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!formData.state}
          >
            <option value="">Select District</option>
            {formData.state && districts[formData.state].map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">Taluk</label>
          <select 
            className="form-select"
            name="taluk"
            value={formData.taluk}
            onChange={handleChange}
            disabled={!formData.district}
          >
            <option value="">Select Taluk</option>
            {formData.district && taluks[formData.district] && taluks[formData.district].map(taluk => (
              <option key={taluk} value={taluk}>{taluk}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">ക്ഷേത്രത്തിന്റെ പേരും മേൽവിലാസവും ഫോൺ നമ്പറും</label>
          <input 
            type="text" 
            className="form-input" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
          />
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
        <div style={{display:"flex",gap:"20px"}}>
          <div>
            <label className="form-label">ഇന്റർനെറ്റ് സംവിധാനം</label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input 
                  type="radio" 
                  name="hasInternet" 
                  value="true"
                  checked={formData.hasInternet === true}
                  onChange={() => setFormData({...formData, hasInternet: true})}
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
                  onChange={() => setFormData({...formData, hasInternet: false})}
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
                  onChange={() => setFormData({...formData, hasComputer: true})}
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
                  onChange={() => setFormData({...formData, hasComputer: false})}
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
                  onChange={() => setFormData({...formData, hasPrinter: true})}
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
                  onChange={() => setFormData({...formData, hasPrinter: false})}
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
                  onChange={() => setFormData({...formData, hasCamera: true})}
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
                  onChange={() => setFormData({...formData, hasCamera: false})}
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
                  onChange={() => setFormData({...formData, hasDigitalBanking: true})}
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
                  onChange={() => setFormData({...formData, hasDigitalBanking: false})}
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
                value="true"
                checked={formData.hasBuilding === true}
                onChange={() => setFormData({...formData, hasBuilding: true})}
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
                onChange={() => setFormData({...formData, hasBuilding: false})}
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
                onChange={() => setFormData({...formData, hasSafe: true})}
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
                onChange={() => setFormData({...formData, hasSafe: false})}
                className="form-radio" 
              />
              <span className="ml-2">ഇല്ല</span>
            </label>
          </div>
        </div>
        </div>
        <div>
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
  );
}

export default Form;

