import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SortSubmission.css'
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

function SortSubmission() {
  const ip = process.env.REACT_APP_BACKEND_IP
    const [temples, setTemples] = useState([]);
    const [filters, setFilters] = useState({
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
      // Add placeholders for other Tamil Nadu districts
      // 'DistrictName': ['Taluk1', 'Taluk2', 'Taluk3'],
    };

    const fields = [
      { key: 'name', label: 'ക്ഷേത്രത്തിന്റെ പേര്' },
      { key: 'whatsapp', label: 'വാട്സ്ആപ്പ് നമ്പർ' },
      { key: 'email', label: 'മെയിൽ ഐ.ഡി.' },
      { key: 'website', label: 'വെബ്സൈറ്റ്' },
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
      { key: 'sreekaaryamDetails', label: 'ശ്രീകാര്യം' },
      { key: 'puramDetails', label: 'പുറം അടിച്ചുതളി' },
      { key: 'securityDetails', label: 'സെക്യൂരിറ്റി' },
      { key: 'templeAssets', label: 'ക്ഷേത്രം വക വസ്തുക്കൾ' },
      { key: 'hasBuilding', label: 'കെട്ടിടം' },
      { key: 'hasSafe', label: 'സേഫ് / ലോക്കർ' },
      { key: 'declarationPlace', label: 'സത്യവാങ്മൂലം സ്ഥലം' },
      { key: 'declarationDate', label: 'സത്യവാങ്മൂലം തീയതി' },
      { key: 'applicantDetails', label: 'അപേക്ഷകന്റെ പേരും സ്ഥാനപ്പേരും ഒപ്പും' },
      { key: 'committeeDecision', label: 'കമ്മിറ്റി തീരുമാനം' },
      { key: 'membershipNumber', label: 'അംഗത്വ നമ്പർ' },
      { key: 'decisionDate', label: 'തീരുമാന തീയതി' },
      { key: 'presidentPermanent', label: 'പ്രസിഡന്റ് (സ്ഥിരം)' },
      { key: 'presidentTemporary', label: 'പ്രസിഡന്റ് (അസ്ഥിരം)' },
      { key: 'presidentPhone', label: 'പ്രസിഡന്റ് ഫോൺ' },
      { key: 'secretaryPermanent', label: 'സെക്രട്ടറി (സ്ഥിരം)' },
      { key: 'secretaryTemporary', label: 'സെക്രട്ടറി (അസ്ഥിരം)' },
      { key: 'secretaryPhone', label: 'സെക്രട്ടറി ഫോൺ' },
      { key: 'treasurerPermanent', label: 'ട്രഷറർ (സ്ഥിരം)' },
      { key: 'treasurerTemporary', label: 'ട്രഷറർ (അസ്ഥിരം)' },
      { key: 'treasurerPhone', label: 'ട്രഷറർ ഫോൺ' },
    ];
  
    useEffect(() => {
        fetchTemples();
    }, [filters]);
  
    const fetchTemples = async () => {
        try {
            const response = await axios.get(`${ip}/api/temples/sort`, {
                params: filters
            });
            setTemples(response.data);
        } catch (error) {
            console.error('Error fetching temples:', error);
        }
    };

    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => {
        const newFilters = { ...prev, [name]: value };
        if (name === 'state') {
          newFilters.district = '';
          newFilters.taluk = '';
        } else if (name === 'district') {
          newFilters.taluk = '';
        }
        return newFilters;
      });
    };
  
    return (
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Sidebar />
          <div className="submission-page">
            <h1 className="page-title">ക്ഷേത്രേശ്രീ ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
            <p className="page-subtitle">കാലടി - 683 574., ഫോൺ : 9847047963</p>
            <p className="page-subtitle">ക്ഷേത്ര വിവരങ്ങൾ</p>
            <div className="filters">
              <select 
                name="state" 
                value={filters.state} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              
              <select 
                name="district" 
                value={filters.district} 
                onChange={handleFilterChange} 
                disabled={!filters.state}
                className="filter-select"
              >
                <option value="">All Districts</option>
                {filters.state && districts[filters.state].map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              
              <select 
                name="taluk" 
                value={filters.taluk} 
                onChange={handleFilterChange} 
                disabled={!filters.district || !taluks[filters.district]}
                className="filter-select"
              >
                <option value="">All Taluks</option>
                {filters.district && taluks[filters.district] && taluks[filters.district].map(taluk => (
                  <option key={taluk} value={taluk}>{taluk}</option>
                ))}
              </select>
            </div>
      
            <div className="table-container">
              <table className="temple-table">
                <thead>
                  <tr>
                    <th>ക്രമ നമ്പർ</th>
                    {fields.map((field) => (
                      <th key={field.key}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {temples.length > 0 ? (
                    temples.map((temple, index) => (
                      <tr key={index} className="temple-row">
                        <td>{index + 1}</td>
                        {fields.map((field) => (
                          <td key={field.key}>
                            {typeof temple[field.key] === 'boolean'
                              ? temple[field.key]
                                ? 'ഉണ്ട്'
                                : 'ഇല്ല'
                              : temple[field.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={fields.length + 1} className="no-data">No submissions found for the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}

export default SortSubmission

