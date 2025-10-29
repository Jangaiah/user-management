import express from "express";
import { getVideo } from "../controllers/video-controller.js";

export const videoRouter = express.Router();


videoRouter.get('/:fileName', getVideo);