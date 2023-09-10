import express from "express";
import {getUserChatSpace,createChatSpace,getAllChatspaceMessages,deleteAllMessageOfAChatSpace,addToArchive,removeFromArchive} from "../controllers/chatspace.js"
const router = express.Router();

router.get("/:user_id",getUserChatSpace)
router.post("/create",createChatSpace)
router.get("/getchat/all/:user_id",getAllChatspaceMessages)
router.delete("/delete",deleteAllMessageOfAChatSpace)
router.put("/archive/add",addToArchive)
router.put("/archive/remove",removeFromArchive)

export default router;