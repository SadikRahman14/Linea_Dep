import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createChannel,
    getUserChannels,
    getChannelMessages,
    getChannelMembers,
    addMembers
} from "../controllers/channel.controller.js";

const channelRouter = Router();

channelRouter.route("/create-channel").post(verifyJWT, createChannel);
channelRouter.route("/get-user-channels").get(verifyJWT, getUserChannels);
channelRouter.route("/get-channel-messages/:channelId").get(verifyJWT, getChannelMessages);
channelRouter.route("/get-channel-members/:channelId").get(verifyJWT, getChannelMembers);
channelRouter.post('/add-members/:channelId', verifyJWT, addMembers);

export default channelRouter;