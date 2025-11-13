import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/config.js';
import User from '../models/user.js'
import Blacklist from '../models/black-list.js';

const jwtSecret = env.jwtSecret;

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
        res.send({
            status: 1,
            message: 'User Registered successfuly',
            user: {id: user._id, name: user.name, email: user.email, isMfaEnabled: false} 
        });
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
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  // Generate temporary token for MFA step
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "5m" });

  res.json({ status: 1, message: "Password verified, continue MFA", token, user: { id: user._id, isMfaEnabled: user.isMfaEnabled } });
};

export const logoutUser = async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(400).json({ message: 'Token missing' });

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp)
      return res.status(400).json({ message: 'Invalid token' });

    const expiresAt = new Date(decoded.exp * 1000);

    await Blacklist.create({ token, expiresAt });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

function getToken(req) {
  const authHeader = req.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
}
