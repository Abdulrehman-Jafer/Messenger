import express from "express";
import {sendMessage,deleteForMe} from "../controllers/message.js"
const router = express.Router();

router.post("/send",sendMessage)
router.delete("/delete",deleteForMe)

export default router;