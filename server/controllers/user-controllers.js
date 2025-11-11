import User from '../models/user.js'
// import { errorHandler } from './error-handler.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({status:1, data: users, totalCount: users.length });
    }
    catch(error){
        errorHandler(error);
    }
}

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hash});
        const user = await newUser.save();
        res.send({status: 1, message: 'User Registered successfuly', user});
    }
    catch(error){
        console.log('Error: ',error);
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try{
        await User.findByIdAndDelete(id);
        res.send({status: 1, message: 'User deleted successfuly'});
    }
    catch(error){
        console.log('Error: ',error);
    }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  // Generate temporary token for MFA step
  const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "5m" });

  res.json({ status: 1, message: "Password verified, continue MFA", token, userId: user._id });
};