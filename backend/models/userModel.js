const mongoose = require("mongoose");
//Create Schema
const userDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: Number,
    },
    password: { 
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//Create Model
const User = mongoose.model('User', userDataSchema);
module.exports = User;