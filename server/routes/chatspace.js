import express from "express";
import {getUserChatSpace,createChatSpace,getAllChatspaceMessages} from "../controllers/chatspace.js"
const router = express.Router();

router.get("/:user_id",getUserChatSpace)
router.post("/create",createChatSpace)
router.get("/getchat/all/:user_id",getAllChatspaceMessages)

export default router;