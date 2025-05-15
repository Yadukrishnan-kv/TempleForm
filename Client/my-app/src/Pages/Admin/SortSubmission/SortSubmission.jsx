import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './SortSubmission.css';
import { Link } from 'react-router-dom';
import { TbEdit, TbPremiumRights } from "react-icons/tb";


const SortSubmission = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
 
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [temples, setTemples] = useState([]);
  const [expandedTemple, setExpandedTemple] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [enabling, setEnabling] = useState(false); // Added enabling state
  
  const initialFields = [
    { key: 'name', label: 'Temple name' },
    { key: 'address', label: 'address' },
    { key: 'isVerified', label: 'Verified' },
  ];

  const allFields = [
      { key: 'email', label: 'മെയിൽ ഐ.ഡി.' },

    { key: 'whatsapp', label: 'വാട്സ്ആപ്പ് നമ്പർ' },

    { key: 'darshanaTime', label: 'ദർശന സമയം' },
    { key: 'website', label: 'വെബ്സൈറ്റ്' },
    { key: 'locationUrl', label: 'ലൊക്കേഷൻ' },

    { key: 'templeType', label: 'ദേശക്ഷേത്ര വിവരം' },
    { key: 'locationSketch', label: 'ലൊക്കേഷൻ സ്കെച്ച്' },
    { key: 'history', label: 'ക്ഷേത്ര ഐതിഹ്യം' },
    { key: 'mainDeity', label: 'പ്രതിഷ്ഠ' },
    { key: 'subDeities', label: 'ഉപദേവതാ' },
    { key: 'otherShrines', label: 'മറ്റു പ്രതിഷ്ഠകൾ' },
    { key: 'buildings', label: 'പ്രാസാദങ്ങൾ' },
    { key: 'monthlyIncome', label: 'ദിവസ-മാസവരുമാനം' },
    { key: 'employees', label: 'ക്ഷേത്രജീവനക്കാർ' },
    { key: 'mainOfferings', label: 'പ്രധാന വഴിപാടുകൾ' },
    { key: 'chiefPriest', label: 'തന്ത്രി' },
    { key: 'mainFestival', label: 'മഹാനിവേദ്യം' },
    { key: 'landOwnership', label: 'ഊരാഴ്മ' },
    { key: 'managementType', label: 'ക്ഷേത്ര ഭരണസംവിധാനം' },
    { key: 'registrationDetails', label: 'കമ്മിറ്റി രജിസ്ട്രേഷൻ നമ്പറും മേൽവിലാസവും' },
    { key: 'billingSystem', label: 'ബില്ലിംഗ് സംവിധാനം' },
    { key: 'hasInternet', label: 'ഇന്റർനെറ്റ് സംവിധാനം' },
    { key: 'hasComputer', label: 'കമ്പ്യൂട്ടർ' },
    { key: 'hasPrinter', label: 'പ്രിന്റർ' },
    { key: 'hasCamera', label: 'ക്യാമറ' },
    { key: 'hasDigitalBanking', label: 'ഡിജിറ്റൽ ബാങ്കിംഗ്' },
    { key: 'managers', label: 'കൈകാര്യം ചെയ്യുന്നവർ' },
    { key: 'bankDetails', label: 'ബാങ്ക് അക്കൗണ്ട് ഡീറ്റെയിൽസും ക്യുആർകോഡും' },
    { key: 'presidentDetails', label: 'പ്രസിഡന്റ് പേരും അഡ്രസും ഫോൺ നമ്പറും' },
    { key: 'secretaryDetails', label: 'സെക്രട്ടറി പേരും അഡ്രസും ഫോൺ നമ്പറും' },
    { key: 'festivals', label: 'ഉത്സവം' },
    { key: 'specialEvents', label: 'വിശേഷങ്ങൾ' },
    { key: 'ayanaSpecialties', label: 'അയന വിശേഷം' },
    { key: 'monthlySpecialties', label: 'മാസവിശേഷം' },
    { key: 'chiefPriestDetails', label: 'മേൽ ശാന്തി' },
    { key: 'kazhakamDetails', label: 'കഴകം' },
    { key: 'emergencyDetails', label: 'അടിയന്തിരം' },
    { key: 'emergencyDetailsPermanent', label: 'സ്ഥിരം' },
    { key: 'emergencyDetailsPhone', label: 'ഫോൺ' },

    { key: 'sreekaaryamDetails', label: 'ശ്രീകാര്യം' },
    { key: 'sreekaaryamDetailsPermanent', label: 'സ്ഥിരം' },
    { key: 'sreekaaryamDetailsPhone', label: 'ഫോൺ' },

    { key: 'puramDetails', label: 'പുറം അടിച്ചുതളി' },
    { key: 'puramDetailsPermanent', label: 'സ്ഥിരം' },
    { key: 'puramDetailsPhone', label: 'ഫോൺ' },

    { key: 'securityDetails', label: 'സെക്യൂരിറ്റി' },
    { key: 'securityDetailsPermanent', label: 'സ്ഥിരം' },
    { key: 'securityDetailsPhone', label: 'ഫോൺ'},

    { key: 'templeAssets', label: 'ക്ഷേത്രം വക വസ്തുക്കൾ' },
    { key: 'templeAssetsPermanent', label: 'സ്ഥിരം' },
    { key: 'templeAssetsPhone', label: 'ഫോൺ' },

    { key: 'hasBuilding', label: 'കെട്ടിടം' },
    { key: 'hasSafe', label: 'സേഫ് / ലോക്കർ' },
    { key: 'declarationPlace', label: 'സത്യവാങ്മൂലം സ്ഥലം' },
    { key: 'declarationDate', label: 'സത്യവാങ്മൂലം തീയതി' },
    { key: 'applicantDetails', label: 'അപേക്ഷകന്റെ പേരും സ്ഥാനപ്പേരും ഒപ്പും' },
    { key: 'committeeDecision', label: 'കമ്മിറ്റി തീരുമാനം' },
    { key: 'membershipNumber', label: 'അംഗത്വ നമ്പർ' },
    { key: 'decisionDate', label: 'തീരുമാന തീയതി' },
   
  ];

  // Fetch States
  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/states/getAllStates`);
      setStates(response.data.states || []);
    } catch (err) {
      console.error("Error fetching states:", err);
      setError('Failed to fetch states');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Districts
  const fetchDistricts = async (stateName) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`);
      const filteredDistricts = response.data.filter(
        (district) => district.state.name === stateName
      );
      setDistricts(filteredDistricts || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
      setError('Failed to fetch districts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Taluks
  const fetchTaluks = async (districtName) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/taluks/getAllTaluks`);
      const filteredTaluks = response.data.filter(
        (taluk) => taluk.district.name === districtName
      );
      setTaluks(filteredTaluks || []);
    } catch (err) {
      console.error("Error fetching taluks:", err);
      setError('Failed to fetch taluks');
    } finally {
      setLoading(false);
    }
  };
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Registration',
          subModule: 'List Details-View',
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
  // Fetch Temples
  const fetchTemples = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip}/api/temples/sort`, { 
        params: {
          state: filters.state,
          district: filters.district,
          taluk: filters.taluk
        } 
      });
      setTemples(response.data || []);
    } catch (error) {
      console.error("Error fetching temples:", error);
      setError('Failed to fetch temples');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();  // Fetch all states on initial load
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTaluks(selectedDistrict);
    } else {
      setTaluks([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    fetchTemples({ 
      state: selectedState, 
      district: selectedDistrict, 
      taluk: selectedTaluk 
    });
  }, [selectedState, selectedDistrict, selectedTaluk]);

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedDistrict(''); // Clear district selection
    setSelectedTaluk(''); // Clear taluk selection
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setSelectedTaluk(''); // Clear taluk selection
  };

  const handleTalukChange = (e) => {
    setSelectedTaluk(e.target.value);
  };

  const handleViewClick = (templeId) => {
    setExpandedTemple(expandedTemple === templeId ? null : templeId);
  };

  const handleVerification = async (templeId, isVerified,subscriped, enabled, show) => { // Updated handleVerification function
    try {
      setVerifying(true);
      const username = localStorage.getItem('username') || 'Admin';
      
      await axios.put(`${ip}/api/temples/${templeId}/verify`, {
        isVerified,
        verifiedBy: username,
        enabled,subscriped,
        show
      });
  
      // Refresh temples data
      fetchTemples({
        state: selectedState,
        district: selectedDistrict,
        taluk: selectedTaluk
      });
      await logAction('Update', `Updated Verified: ${isVerified}`);

    } catch (error) {
      console.error('Error verifying temple:', error);
      setError('Failed to verify temple');
    } finally {
      setVerifying(false);
    }
  };

  const renderFieldValue = (field, value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (field.key === 'darshanaTime') {
      return `Morning: ${value.morning.from} - ${value.morning.to}, Evening: ${value.evening.from} - ${value.evening.to}`;
    }
    if (field.key === 'declarationDate' || field.key === 'decisionDate') {
      return new Date(value).toLocaleDateString();
    }
    return value || 'N/A';
  };

  const renderVerificationStatus = (temple) => {
    if (temple.isVerified) {
      return (
        <div className="verification-status verified">
          ✓ Verified
          {temple.verificationDate && (
            <span className="verification-date">
              {new Date(temple.verificationDate).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    }
    return <div className="verification-status">Not Verified</div>;
  };


  const handleDelete = async (templeId) => {
  console.log('Deleting temple with ID:', templeId);  // Add this line for debugging
  try {
    await axios.delete(`${ip}/api/temples/delete/${templeId}`);
    fetchTemples();
  } catch (err) {
    console.error('Error deleting temple:', err);
  }
};




  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="submission-page">
        <h1 className="form-title">ക്ഷേത്രശ്രീ 
        ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
        <p className="form-group">കാലടി, ശങ്കരമാർഗ്
        - 683 574., ഫോൺ : 9847047963</p>
          <p className="page-subtitle">ക്ഷേത്ര വിവരങ്ങൾ</p>
          <div className="filters">
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
              disabled={loading}
              className="filter-select"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>

            <select
              name="district"
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedState || loading}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district._id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              id="taluk"
              value={selectedTaluk}
              onChange={handleTalukChange}
              disabled={!selectedDistrict || loading}
            >
              <option value="">All Taluks</option>
              {taluks.map((taluk) => (
                <option key={taluk._id} value={taluk.name}>
                  {taluk.name}
                </option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table className="temple-table">
              <thead>
                <tr>
                  <th>Sl no</th>
                  {initialFields.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                  <th>About</th>
                  <th>Gallery</th>
                  <th>Edit</th>
                    <th>Delete</th>
                  <th>subscription</th>
                  



                </tr>
              </thead>
              <tbody>
                {temples.length > 0 ? (
                  temples.map((temple, index) => (
                    <React.Fragment key={temple._id}>
                      <tr>
                        <td>{index + 1}</td>
                        {initialFields.map((field) => (
                          <td key={field.key}>
                            {field.key === 'isVerified' 
                              ? renderVerificationStatus(temple)
                              : renderFieldValue(field, temple[field.key])}
                          </td>
                        ))}
                        <td>
                          <button 
                            className='gallery-button' 
                            onClick={() => handleViewClick(temple._id)}
                          >
                            {expandedTemple === temple._id ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
                          </button>
                        </td>
                       
                        <td>
                          <Link to={`/AboutTemple/${temple._id}`}>
                            <button className='gallery-button'><i class="fa-solid fa-address-card"></i></button>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/gallery/${temple._id}`}>
                            <button className='gallery-button'><i class="fa-solid fa-image"></i></button>
                          </Link>
                        </td>
                       
 <td>
                          <Link to={`/edit/${temple._id}`}>
                          
                            <button className='gallery-button'><i class="fa-solid fa-pen-to-square"></i></button>
                          </Link>
                        </td>
                             <td>
                      <button className="gallery-button" onClick={() => handleDelete(temple._id)}>
                        <i class="fa-solid fa-trash"></i>

                      </button>
                    </td>
 <td>
                              <Link
                                to={`/subscriptionoffline/${temple._id}`}
                                state={{ templeData: temple }} // Correct way to pass state in v6
                              >
                                <button className="gallery-button"><TbPremiumRights style={{ fontSize: "20px" }} />
                                </button>
                              </Link>
                            </td>
                      </tr>
                      {expandedTemple === temple._id && (
                        <tr>
                          <td colSpan={initialFields.length + 3}>
                            <div className="verification-controls">
                              <div className="verification-radio-group">
                                <label>
                                  <input
                                    type="radio"
                                    name={`verify-${temple._id}`}
                                    checked={temple.isVerified === true}
                                    onChange={() => handleVerification(temple._id, true, temple.subscriped, temple.enabled, temple.show)}

                                    disabled={verifying}
                                  />
                                  Verify
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`verify-${temple._id}`}
                                    checked={temple.isVerified === false}
                                    onChange={() => handleVerification(temple._id, false, temple.subscriped, temple.enabled, temple.show)}

                                    disabled={verifying}
                                  />
                                  Reject
                                </label>
                              </div>


                              <div className="verification-radio-group">
                                <label>
                                  <input
                                    type="radio"
                                    name={`subscriped-${temple._id}`}
                                    checked={temple.subscriped === true}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, true, temple.enabled, temple.show)}

                                    disabled={verifying}
                                  />
                                  subscriped
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`subscriped-${temple._id}`}
                                    checked={temple.subscriped === false}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, false, temple.enabled, temple.show)}

                                    disabled={verifying}
                                  />
                                  Not subscriped
                                </label>
                              </div>
                              <div className="verification-radio-group"> {/* Added enable/disable radio buttons */}
                                <label>
                                  <input
                                    type="radio"
                                    name={`enable-${temple._id}`}
                                    checked={temple.enabled === true}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, temple.subscriped, true, temple.show)}

                                    disabled={verifying}
                                  />
                                  Enable
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`enable-${temple._id}`}
                                    checked={temple.enabled === false}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, temple.subscriped, false, temple.show)}

                                    disabled={verifying}
                                  />
                                  Disable
                                </label>
                              </div>
                              <div className="verification-radio-group"> 
                                <label>
                                  <input
                                    type="radio"
                                    name={`show-${temple._id}`}
                                    checked={temple.show === true}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, temple.subscriped, temple.enabled, true)}

                                    disabled={verifying}
                                  />
                                  Show
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`show-${temple._id}`}
                                    checked={temple.show === false}
                                    onChange={() => handleVerification(temple._id, temple.isVerified, temple.subscriped, temple.enabled, false)}

                                    disabled={verifying}
                                  />
                                  Not Show
                                </label>
                              </div>
                              {temple.verifiedBy && (
                                <div className="verified-by">
                                  Verified by: {temple.verifiedBy}
                                </div>
                              )}
                            </div>
                            <table className="expanded-table">
                              <tbody>
                                {allFields.map((field) => (
                                  <tr key={field.key}>
                                    <td>{field.label}</td>
                                    <td>{renderFieldValue(field, temple[field.key])}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={initialFields.length + 3}>No temples found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortSubmission;



