const {Schema,model}=require("mongoose")
const lsgSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
   
  },{timestamps:true});
  const lsgCollection =model('lsg', lsgSchema);

module.exports = lsgCollection;