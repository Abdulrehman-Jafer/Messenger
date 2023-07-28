import express from "express";
import {getUserChatSpace,createChatSpace} from "../controllers/chatspace.js"
const router = express.Router();

router.get("/:user_id",getUserChatSpace)
router.post("/create",createChatSpace)

export default router;