import User from '../models/user.js'
// import { errorHandler } from './error-handler.js'

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json({status:1, data: users, totalCount: users.length });
    }
    catch(error){
        errorHandler(error);
    }
}

export const createUser = async (req, res) => {
    const { name, email } = req.body;
    try{
        const newUser = new User({name, email});
        await newUser.save();
        res.send({status: 1, message: 'User Added successfuly'});
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