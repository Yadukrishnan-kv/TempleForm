const {Schema,model}=require("mongoose")
const stateSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },{timestamps:true});
  const State =model('State', stateSchema);

module.exports = State;
