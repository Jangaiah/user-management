import express from "express";
import { getAllUsers, createUser, deleteUser } from '../controllers/user-controllers.js';

export const userRouter = express.Router();


userRouter.get('/list', getAllUsers);
userRouter.post('/new', createUser);
userRouter.delete('/delete/:id', deleteUser);