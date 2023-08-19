import express from "express";
import {sendMessage,deleteForMe,deleteForEveryone,sendAttachmentMessage} from "../controllers/message.js"
import {configged_multer} from "../configs/multer_config.js"
const router = express.Router();

router.post("/send",sendMessage),
router.post("/sendattachment",sendAttachmentMessage),
router.delete("/deleteforme",deleteForMe)
router.delete("/deleteforeveyone",deleteForEveryone)

export default router;
// configged_multer.single("attachment")