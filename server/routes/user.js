import express from "express"
import {createUser,authenticateUser,continueWithGoogle,blockUser} from "../controllers/user.js"
import { createToken,validateToken, } from "../middlewares/jwt.js"
import {configged_multer} from "../configs/multer_config.js"


const router = express.Router()

router.put("/block",blockUser)
router.put("/auth/continue-with-google",continueWithGoogle,createToken)
router.post("/auth/signup",configged_multer.single("image"),createUser),
router.post("/auth/signin",authenticateUser,createToken)
router.get("/auth/validate-token",validateToken)

export default router;