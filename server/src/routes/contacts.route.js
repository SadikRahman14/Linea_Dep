import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchContact, getContactsForDMList, getAllContacts } from "../controllers/contact.controller.js";

const contactRoutes = Router();

contactRoutes.route("/search").post(verifyJWT, searchContact)
contactRoutes.route("/get-contacts-for-dm").get(verifyJWT, getContactsForDMList)
contactRoutes.route("/get-all-contacts").get(verifyJWT, getAllContacts)


export default contactRoutes;