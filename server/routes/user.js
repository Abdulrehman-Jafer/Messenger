import express from "express"
import {createUser,authenticateUser,continueWithGoogle,add_to_block_list,remove_from_black_list} from "../controllers/user.js"
import { createToken,validateToken, } from "../middlewares/jwt.js"
import {configged_multer} from "../configs/multer_config.js"


const router = express.Router()

router.put("/auth/continue-with-google",continueWithGoogle,createToken)
router.post("/auth/signup",configged_multer.single("image"),createUser),
router.post("/auth/signin",authenticateUser,createToken)
router.get("/auth/validate-token",validateToken)
router.put("/block",add_to_block_list)
router.put("/unblock",remove_from_black_list)

export default router;