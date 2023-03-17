const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  }, { timestamps: true });

// Define User model
module.exports= mongoose.model('User', userSchema);
  