import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import '../../../Pages/Admin/SortSubmission/SortSubmission.css';



function TempleForm() {
  const ip = process.env.REACT_APP_BACKEND_IP

  const navigate = useNavigate()
  const [temple, setTemple] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedTemple, setExpandedTemple] = useState(false)

  const initialFields = [
    { key: "name", label: "ക്ഷേത്രത്തിന്റെ പേര്" },
    { key: "address", label: "മേൽവിലാസം" },
    { key: "whatsapp", label: "വാട്സ്ആപ്പ് നമ്പർ" },
    { key: "email", label: "മെയിൽ ഐ.ഡി." },
    { key: "isVerified", label: "Verified" },
  ]

  const allFields = [
    { key: 'darshanaTime', label: 'ദർശന സമയം' },
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


  useEffect(() => {
    const fetchTempleDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/signin")
          return
        }

        const response = await axios.get(`${ip}/api/temples/details`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data) {
          setTemple(response.data)
        } else {
          setError("No temple details found")
        }
      } catch (err) {
        console.error("Error fetching temple details:", err)
        if (err.response && err.response.status === 404) {
          setError("Temple details not found. Please ensure you have registered your temple.")
        } else if (err.response && err.response.status === 401) {
          setError("Authentication failed. Please log in again.")
          navigate("/signin")
        } else {
          setError(`Failed to fetch temple details: ${err.response?.data?.message || err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTempleDetails()
  }, [navigate])

  const handleViewClick = () => {
    setExpandedTemple(!expandedTemple)
  }

  const renderFieldValue = (field, value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }
    if (field.key === "darshanaTime") {
      return `Morning: ${value.morning.from} - ${value.morning.to}, Evening: ${value.evening.from} - ${value.evening.to}`
    }
    if (field.key === "declarationDate" || field.key === "decisionDate") {
      return new Date(value).toLocaleDateString()
    }
    return value || "N/A"
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Sign In
        </button>
      </div>
    )
  }

  if (!temple) {
    return <div className="text-center mt-8">No temple details found</div>
  }

  return (
    <div className="submission-page">
     <div className="overflow-x-auto ">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Sl no</th>
              {initialFields.map((field) => (
                <th key={field.key} className="border border-gray-300 px-4 py-2">
                  {field.label}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">Actions</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
              <th className="border border-gray-300 px-4 py-2">About</th>
              <th className="border border-gray-300 px-4 py-2">Gallery</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              {initialFields.map((field) => (
                <td key={field.key} className="border border-gray-300 px-4 py-2">
                  {renderFieldValue(field, temple[field.key])}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={handleViewClick}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded view-button"
                >
                  {expandedTemple ? "Hide" : "View"}
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/TempleDash-Edit/${temple._id}`}>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded edit-button ">
                    Edit
                  </button>
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/TempleDash-AboutTemple/${temple._id}`}>
                  <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded view-button">
                    About
                  </button>
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/TempleDash-gallery/${temple._id}`}>
                  <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded gallery-button">
                    Gallery
                  </button>
                </Link>
              </td>
            </tr>
            {expandedTemple && (
              <tr>
                <td colSpan={initialFields.length + 4} className="border border-gray-300 px-4 py-2">
                  <table className="w-full">
                    <tbody>
                      {allFields.map((field) => (
                        <tr key={field.key}>
                          <td className="font-bold pr-4">{field.label}:</td>
                          <td>{renderFieldValue(field, temple[field.key])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TempleForm






