import express from "express";
import {sendMessage,deleteForMe,deleteForEveryone,sendAttachmentMessage} from "../controllers/message.js"
import {configged_multer} from "../configs/multer_config.js"
import {whetherChatspaceExist,checkWhetherUserBlocked} from "../middlewares/message.js"
const router = express.Router();

router.post("/send",whetherChatspaceExist,checkWhetherUserBlocked,sendMessage),
router.post("/sendattachment",sendAttachmentMessage),
router.delete("/deleteforme",deleteForMe)
router.delete("/deleteforeveyone",deleteForEveryone)

export default router;
// configged_multer.single("attachment")