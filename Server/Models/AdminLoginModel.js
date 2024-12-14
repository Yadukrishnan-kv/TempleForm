const {Schema,model}=require("mongoose")
const validator=require("validator")
const Adminschema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})
const AdminCollection=model('Admin',Adminschema)
module.exports=AdminCollection