const User = require('../model/userModel')
const bcrypt = require('bcrypt');
const userRegister = async(req,res)=>{
    try {
        const { name, email, password } = req.body;
    
        // Check if user already exists
        const user = await User.findOne({ email });
    
        if (user) {
          return res.status(400).send({ message: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword
        });
    
        await newUser.save();
    
        res.status(201).send({ message: 'User registered successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
      }
}


const login = async(req,res)=>{
    try {
        const { email, password } = req.body;
    
        // Find user by email
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(400).send({ message: 'Invalid credentials' });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          return res.status(400).send({ message: 'Invalid credentials' });
        }
    
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    
        res.status(200).send({ token });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
      }
}


const logout = async(req,res)=>{
    res.status(200).send({ message: 'User logged out successfully' });
}

const changePassword = async(req,res)=>{
    try {
        const { email, currentPassword, newPassword } = req.body;
    
        // Find user by email
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(400).send({ message: 'User not found' });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
    
        if (!isMatch) {
          return res.status(400).send({ message: 'Invalid credentials' });
        }

         // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
         // Return a success response
         return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'error occured', error });
      }
}

const updatePassword = async(req,res)=>{

    try {
        // Get the email and new password from the request body
        const { email, password } = req.body;
    
        // Find the user with the given email
        const user = await User.findOne({ email });
    
        // If no user is found, return an error response
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Update the user's password
        user.password = hashedPassword;
        await user.save();
    
        // Return a success response
        return res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        // If an error occurs, return an error response
        return res.status(500).json({ message: 'An error occurred', error });
      }
}


const resetPassword = async(req,res)=>{
    try {
        // Get the email from the request body
        const { email } = req.body;
    
        // Find the user with the given email
        const user = await User.findOne({ email });
    
        // If no user is found, return an error response
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate a JWT token with the user's email as the payload
        const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
    
        // Return a success response with the token
        return res.status(200).json({ message: 'Password reset requested', token });
      } catch (error) {
        // If an error occurs, return an error response
        return res.status(500).json({ message: 'An error occurred', error });
      }
}

module.exports= {userRegister, login, logout, changePassword, updatePassword, resetPassword};