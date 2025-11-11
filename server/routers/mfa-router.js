import express from "express";
import { generateMFA, verifyMFASetup, verifyMFA } from '../controllers/mfa-controller.js';

export const mfaRouter = express.Router();

mfaRouter.get("/generate-mfa/:id", generateMFA);

mfaRouter.post('/verify-mfa-setup', verifyMFASetup);

mfaRouter.post("/verify-mfa", verifyMFA);
