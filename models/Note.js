const mongoose = require("mongoose")
const { Schema } = mongoose;

const noteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
  title:{
    type:String,
    require:true
  },
  description:{
    type:String,
    require:true,
  },
  tag:{
    type:String,
    required:true
  },
  
 
},{timestamps:true});

module.exports = mongoose.model("note",noteSchema)