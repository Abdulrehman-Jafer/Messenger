import express from "express";
import {createMessage} from "../controllers/message.js"
const router = express.Router();

router.post("/send",createMessage)

export default router;