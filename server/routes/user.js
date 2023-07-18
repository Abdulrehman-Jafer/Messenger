import express from "express"
import {createUser,authenticateUser,continueWithGoogle} from "../controllers/user.js"
import { createToken,validateToken, } from "../middlewares/jwt.js"


const router = express.Router()

router.post("/signup",createUser),
router.post("/signin",authenticateUser,createToken)
router.post("/continue-with-google",continueWithGoogle,createToken)
router.get("/validate-token",validateToken)

export default router;