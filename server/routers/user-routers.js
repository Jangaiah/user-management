import express from "express";
import { getAllUsers, registerUser, deleteUser, loginUser, logoutUser } from '../controllers/user-controllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const userRouter = express.Router();

userRouter.get('/list', authMiddleware, getAllUsers);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.delete('/delete/:id', authMiddleware, deleteUser);