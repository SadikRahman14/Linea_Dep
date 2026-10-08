import {Router} from "express"
import { getMessages, uploadFile } from "../controllers/messages.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer"

const messagesRoutes = Router();

const upload = multer({ dest:"uploads/files" })
messagesRoutes.route("/get-messages").post(verifyJWT, getMessages)
messagesRoutes.route("/upload-file").post(verifyJWT, upload.single("file"), uploadFile)

export default messagesRoutes;