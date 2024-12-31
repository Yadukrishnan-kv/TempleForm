const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TempleSchema = new Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  darshanaTime: {
    morning: {
      from: String,
      to: String
    },
    evening: {
      from: String,
      to: String
    }
  },
  whatsapp: String,
  email: String,
  website: String,
  templeType: {
    type: String,
    enum: ['ദേശക്ഷേത്രം', 'മഹാക്ഷേത്രം', 'കുടുംബക്ഷേത്രം', 'കാവ്', 'മറ്റ്'],
    required: true
  },
  locationSketch: String,
  history: String,
  mainDeity: String,
  subDeities: String,
  otherShrines: String,
  buildings: String,
  monthlyIncome: String,
  employees: String,
  mainOfferings: String,
  chiefPriest: String,
  mainFestival: String,
  landOwnership: String,
  managementType: {
    type: String,
    enum: ['ട്രസ്റ്റ്', 'സേവാസമിതി', 'പൊതു'],
    required: true
  },
  registrationDetails: String,
  billingSystem: String,
  hasInternet: Boolean,
  hasComputer: Boolean,
  hasPrinter: Boolean,
  hasCamera: Boolean,
  hasDigitalBanking: Boolean,
  managers: String,
  bankDetails: String,
  presidentDetails: String,
  secretaryDetails: String,
  festivals: String,
  specialEvents: String,
  ayanaSpecialties: String,
  monthlySpecialties: String,
  chiefPriestDetails: String,
  kazhakamDetails: String,
  emergencyDetails: String,
  sreekaaryamDetails: String,
  puramDetails: String,
  securityDetails: String,
  templeAssets: String,
  hasBuilding: Boolean,
  hasSafe: Boolean,
  declarationPlace: String,
  declarationDate: Date,
  applicantDetails: String,
  committeeDecision: String,
  membershipNumber: String,
  decisionDate: Date,
  presidentPermanent: String,
  presidentTemporary: String,
  presidentPhone: String,
  secretaryPermanent: String,
  secretaryTemporary: String,
  secretaryPhone: String,
  treasurerPermanent: String,
  treasurerTemporary: String,
  treasurerPhone: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  verifiedBy: {
    type: String
  },
  enabled: {
    type: Boolean,
    default: true,
  }, show: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const TempleCollection = model("Temple", TempleSchema);
module.exports = TempleCollection;

