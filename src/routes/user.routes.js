import { Router } from "express";
import { login, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 2
    }
]), registerUser)
router.route('/login').post(login)
router.route('/logout').post(verifyJWT, logout)
router.route('/refreshAccessToken').post(refreshAccessToken)

export default router