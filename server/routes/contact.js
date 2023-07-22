import express from "express";
import controller from "../controllers/contact.js"
const router = express.Router();

router.get("/:user_id",controller.getContacts)
router.post("/create",controller.createContact)

export default router;