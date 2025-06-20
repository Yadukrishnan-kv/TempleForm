const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Function to generate slug from temple name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const TempleSchema = new Schema({
  Nation: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  name: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true,
    index: true
  },
  lsg: { type: String, required: true },
  Road: { type: String },
  Landmark: { type: String},
  Pincode: { type: String, required: true },
  address: { type: String, required: true },
  locationUrl: { type: String, required: true },
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
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v)
        );
      },
      message: props => `${props.value} is not a valid email or phone number!`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: '2'
  },
  website: String,
  templeType: {
    type: String,
    enum: ['Madam','Desakshetram','Kudumbakshetram', 'Bajanamadam', 'Sevagramam', 'Kaavukal', 'Sarppakaav'],
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
  BankName: String,
  Bankifsc: String,
  presidentDetails: String,
  secretaryDetails: String,
  festivals: String,
  specialEvents: String,
  ayanaSpecialties: String,
  monthlySpecialties: String,
  chiefPriestDetails: String,
  kazhakamDetails: String,
  emergencyDetails: String,
  emergencyDetailsPermanent: String,
  emergencyDetailsTemporary: String,
  emergencyDetailsPhone: String,
  sreekaaryamDetails: String,
  sreekaaryamDetailsPermanent: String,
  sreekaaryamDetailsTemporary: String,
  sreekaaryamDetailsPhone: String,
  puramDetails: String,
  puramDetailsPermanent: String,
  puramDetailsTemporary: String,
  puramDetailsPhone: String,
  securityDetails: String,
  securityDetailsPermanent: String,
  securityDetailsTemporary: String,
  securityDetailsPhone: String,
  templeAssets: String,
  templeAssetsPermanent: String,
  templeAssetsTemporary: String,
  templeAssetsPhone: String,
  hasBuilding: Boolean,
  hasSafe: Boolean,
  declarationPlace: String,
  declarationDate: Date,
  applicantDetails: String,
  committeeDecision: String,
  membershipNumber: String,
  decisionDate: Date,
  CodeNumber: { type: String },
  operation: { type: String},
  Refferal: { type: String },
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
  subscriped: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true,
  }, 
  show: {
    type: Boolean,
    default: false,
  },
  description:{
    type: String
  }
}, { timestamps: true });

// Pre-save middleware to generate slug
TempleSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slugs and append number if needed
    while (await this.constructor.findOne({ slug: slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

const TempleCollection = model("Temple", TempleSchema);
module.exports = TempleCollection;

