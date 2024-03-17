const mongoose = require("mongoose")
const { Schema } = mongoose;
const validator = require('validator')

const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: [true, "email is already exist"],
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("please enter valid email")
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "NORMAL"
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"note"
    }
  ]

},{timestamps:true});

module.exports = mongoose.model("user", userSchema)