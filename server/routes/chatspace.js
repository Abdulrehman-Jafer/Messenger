import express from "express";
import {getUserChatSpace,createChatSpace,getAllChatspaceMessages,deleteAllMessageOfAChatSpace,addToArchive} from "../controllers/chatspace.js"
const router = express.Router();

router.get("/:user_id",getUserChatSpace)
router.post("/create",createChatSpace)
router.get("/getchat/all/:user_id",getAllChatspaceMessages)
router.delete("/delete",deleteAllMessageOfAChatSpace)
router.post("/add/archive",addToArchive)

export default router;