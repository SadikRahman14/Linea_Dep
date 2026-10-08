import { Router } from "express";
import { 
    login,
    signup,
    getUserInfo,
    refreshAccessToken,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logoutUser
 
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/"});


authRoutes.route("/signup").post(signup)
authRoutes.route("/login").post(login)
authRoutes.route("/refresh-token").post(verifyJWT, refreshAccessToken)
authRoutes.route("/user-info").get(verifyJWT, getUserInfo)
authRoutes.route("/update-profile").post(verifyJWT, updateProfile)
authRoutes.route("/add-profile-image").post(
    verifyJWT,
    upload.single("profile-image"),
    addProfileImage
)
authRoutes.route("/remove-profile-image").delete(verifyJWT, removeProfileImage)
authRoutes.route("/logout").post(verifyJWT, logoutUser)

export default authRoutes;