import express from "express"
import {createUser,authenticateUser,continueWithGoogle} from "../controllers/user.js"
import { createToken,validateToken, } from "../middlewares/jwt.js"
import {configged_multer} from "../configs/multer_config.js"


const router = express.Router()

router.post("/signup",configged_multer.single("image"),createUser),
router.post("/signin",authenticateUser,createToken)
router.post("/continue-with-google",continueWithGoogle,createToken)
router.get("/validate-token",validateToken)

export default router;