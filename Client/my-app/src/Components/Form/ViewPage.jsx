import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

function ViewPage() {
  const ip = process.env.REACT_APP_BACKEND_IP
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    axios.get(`${ip}/api/temples/all`)
      .then((res) => {
        setTemples(res.data);
      })
      .catch((err) => {
        console.error("Error fetching all temples:", err);
      });
  }, []);

  if (!temples.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">ക്ഷേത്രേശ്രീ   ക്ഷേത്രോദ്ധാരണപദ്ധതി</h1>
      <p className="form-group">കാലടി - 683 574., ഫോൺ : 9847047963</p>
      <p className="form-group">ക്ഷേത്ര വിവരങ്ങൾ</p>
      
      {temples.map((temple, index) => (
        <div key={index} className="space-y-4">
          <div>
            <h2 className="form-label">ക്ഷേത്രത്തിന്റെ പേരും മേൽവിലാസവും ഫോൺ നമ്പറും</h2>
            <p>{temple.name}</p>
          </div>
          <div>
            <h2 className="form-label">വാട്സ്ആപ്പ് നമ്പർ</h2>
            <p>{temple.whatsapp}</p>
          </div>
          <div>
            <h2 className="form-label">മെയിൽ ഐ.ഡി.</h2>
            <p>{temple.email}</p>
          </div>
          <div>
            <h2 className="form-label">വെബ്സൈറ്റ്</h2>
            <p>{temple.website}</p>
          </div>
          <div>
            <h2 className="form-label">ദേശക്ഷേത്ര വിവരം</h2>
            <p>{temple.templeType}</p>
          </div>
          <div>
            <h2 className="form-label">ലൊക്കേഷൻ സ്കെച്ച്</h2>
            <p>{temple.locationSketch}</p>
          </div>
          <div>
            <h2 className="form-label">ക്ഷേത്ര ഐതിഹ്യം</h2>
            <p>{temple.history}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രതിഷ്ഠ</h2>
            <p>{temple.mainDeity}</p>
          </div>
          <div>
            <h2 className="form-label">ഉപദേവതാ</h2>
            <p>{temple.subDeities}</p>
          </div>
          <div>
            <h2 className="form-label">മറ്റു പ്രതിഷ്ഠകൾ</h2>
            <p>{temple.otherShrines}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രാസാദങ്ങൾ</h2>
            <p>{temple.buildings}</p>
          </div>
          <div>
            <h2 className="form-label">ദിവസ-മാസവരുമാനം</h2>
            <p>{temple.monthlyIncome}</p>
          </div>
          <div>
            <h2 className="form-label">ക്ഷേത്രജീവനക്കാർ</h2>
            <p>{temple.employees}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രധാന വഴിപാടുകൾ</h2>
            <p>{temple.mainOfferings}</p>
          </div>
          <div>
            <h2 className="form-label">തന്ത്രി</h2>
            <p>{temple.chiefPriest}</p>
          </div>
          <div>
            <h2 className="form-label">മഹാനിവേദ്യം</h2>
            <p>{temple.mainFestival}</p>
          </div>
          <div>
            <h2 className="form-label">ഊരാഴ്മ</h2>
            <p>{temple.landOwnership}</p>
          </div>
          <div>
            <h2 className="form-label">ക്ഷേത്ര ഭരണസംവിധാനം</h2>
            <p>{temple.managementType}</p>
          </div>
          <div>
            <h2 className="form-label">കമ്മിറ്റി രജിസ്ട്രേഷൻ നമ്പറും മേൽവിലാസവും</h2>
            <p>{temple.registrationDetails}</p>
          </div>
          <div>
            <h2 className="form-label">ബില്ലിംഗ് സംവിധാനം</h2>
            <p>{temple.billingSystem}</p>
          </div>
          <div>
            <h2 className="form-label">ഇന്റർനെറ്റ് സംവിധാനം</h2>
            <p>{temple.hasInternet ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">കമ്പ്യൂട്ടർ</h2>
            <p>{temple.hasComputer ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രിന്റർ</h2>
            <p>{temple.hasPrinter ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">ക്യാമറ</h2>
            <p>{temple.hasCamera ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">ഡിജിറ്റൽ ബാങ്കിംഗ്</h2>
            <p>{temple.hasDigitalBanking ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">കൈകാര്യം ചെയ്യുന്നവർ</h2>
            <p>{temple.managers}</p>
          </div>
          <div>
            <h2 className="form-label">ബാങ്ക് അക്കൗണ്ട് ഡീറ്റെയിൽസും ക്യുആർകോഡും</h2>
            <p>{temple.bankDetails}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രസിഡന്റ് പേരും അഡ്രസും ഫോൺ നമ്പറും</h2>
            <p>{temple.presidentDetails}</p>
          </div>
          <div>
            <h2 className="form-label">സെക്രട്ടറി പേരും അഡ്രസും ഫോൺ നമ്പറും</h2>
            <p>{temple.secretaryDetails}</p>
          </div>
          <div>
            <h2 className="form-label">ഉത്സവം</h2>
            <p>{temple.festivals}</p>
          </div>
          <div>
            <h2 className="form-label">വിശേഷങ്ങൾ</h2>
            <p>{temple.specialEvents}</p>
          </div>
          <div>
            <h2 className="form-label">അയന വിശേഷം</h2>
            <p>{temple.ayanaSpecialties}</p>
          </div>
          <div>
            <h2 className="form-label">മാസവിശേഷം</h2>
            <p>{temple.monthlySpecialties}</p>
          </div>
          <div>
            <h2 className="form-label">മേൽ ശാന്തി</h2>
            <p>{temple.chiefPriestDetails}</p>
          </div>
          <div>
            <h2 className="form-label">കഴകം</h2>
            <p>{temple.kazhakamDetails}</p>
          </div>
          <div>
            <h2 className="form-label">അടിയന്തിരം</h2>
            <p>{temple.emergencyDetails}</p>
          </div>
          <div>
            <h2 className="form-label">ശ്രീകാര്യം</h2>
            <p>{temple.sreekaaryamDetails}</p>
          </div>
          <div>
            <h2 className="form-label">പുറം അടിച്ചുതളി</h2>
            <p>{temple.puramDetails}</p>
          </div>
          <div>
            <h2 className="form-label">സെക്യൂരിറ്റി</h2>
            <p>{temple.securityDetails}</p>
          </div>
          <div>
            <h2 className="form-label">ക്ഷേത്രം വക വസ്തുക്കൾ</h2>
            <p>{temple.templeAssets}</p>
          </div>
          <div>
            <h2 className="form-label">കെട്ടിടം</h2>
            <p>{temple.hasBuilding ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">സേഫ് / ലോക്കർ</h2>
            <p>{temple.hasSafe ? 'ഉണ്ട്' : 'ഇല്ല'}</p>
          </div>
          <div>
            <h2 className="form-label">സത്യവാങ്മൂലം സ്ഥലം</h2>
            <p>{temple.declarationPlace}</p>
          </div>
          <div>
            <h2 className="form-label">സത്യവാങ്മൂലം തീയതി</h2>
            <p>{temple.declarationDate}</p>
          </div>
          <div>
            <h2 className="form-label">അപേക്ഷകന്റെ പേരും സ്ഥാനപ്പേരും ഒപ്പും</h2>
            <p>{temple.applicantDetails}</p>
          </div>
          <div>
            <h2 className="form-label">കമ്മിറ്റി തീരുമാനം</h2>
            <p>{temple.committeeDecision}</p>
          </div>
          <div>
            <h2 className="form-label">അംഗത്വ നമ്പർ</h2>
            <p>{temple.membershipNumber}</p>
          </div>
          <div>
            <h2 className="form-label">തീരുമാന തീയതി</h2>
            <p>{temple.decisionDate}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രസിഡന്റ് (സ്ഥിരം)</h2>
            <p>{temple.presidentPermanent}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രസിഡന്റ് (അസ്ഥിരം)</h2>
            <p>{temple.presidentTemporary}</p>
          </div>
          <div>
            <h2 className="form-label">പ്രസിഡന്റ് ഫോൺ</h2>
            <p>{temple.presidentPhone}</p>
          </div>
          <div>
            <h2 className="form-label">സെക്രട്ടറി (സ്ഥിരം)</h2>
            <p>{temple.secretaryPermanent}</p>
          </div>
          <div>
            <h2 className="form-label">സെക്രട്ടറി (അസ്ഥിരം)</h2>
            <p>{temple.secretaryTemporary}</p>
          </div>
          <div>
            <h2 className="form-label">സെക്രട്ടറി ഫോൺ</h2>
            <p>{temple.secretaryPhone}</p>
          </div>
          <div>
            <h2 className="form-label">ട്രഷറർ (സ്ഥിരം)</h2>
            <p>{temple.treasurerPermanent}</p>
          </div>
          <div>
            <h2 className="form-label">ട്രഷറർ (അസ്ഥിരം)</h2>
            <p>{temple.treasurerTemporary}</p>
          </div>
          <div>
            <h2 className="form-label">ട്രഷറർ ഫോൺ</h2>
            <p>{temple.treasurerPhone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewPage;


