import express from "express";
import {sendMessage,deleteForMe,deleteForEveryone} from "../controllers/message.js"
const router = express.Router();

router.post("/send",sendMessage)
router.delete("/deleteforme",deleteForMe)
router.delete("/deleteforeveyone",deleteForEveryone)

export default router;