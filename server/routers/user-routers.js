import express from "express";
import { getAllUsers, registerUser, deleteUser, loginUser } from '../controllers/user-controllers.js';

export const userRouter = express.Router();


userRouter.get('/list', getAllUsers);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.delete('/delete/:id', deleteUser);