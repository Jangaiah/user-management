import express from "express";
import { getAllUsers, registerUser, deleteUser, loginUser, logoutUser } from '../controllers/user-controllers.js';

export const userRouter = express.Router();


userRouter.get('/list', getAllUsers);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.delete('/delete/:id', deleteUser);