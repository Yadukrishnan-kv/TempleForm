const {Schema,model}=require("mongoose")
const districtSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
    type:Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  }
  },{timestamps:true});
  const District =model('District', districtSchema);

module.exports = District;