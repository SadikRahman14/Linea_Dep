import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Channel from "../models/channel.model.js";
import mongoose from "mongoose";

const requireChannelAccess = (channel, userId, adminOnly = false) => {
    if (!channel) throw new ApiError(404, "Channel not found");
    const isAdmin = String(channel.admin) === String(userId);
    const isMember = channel.members.some((member) => String(member) === String(userId));
    if (!isAdmin && (adminOnly || !isMember)) {
        throw new ApiError(403, "You do not have access to this channel");
    }
};

const createChannel = asyncHandler(async (req, res) => {
    const { name, members } = req.body;

    const userId = req.userId;
    const admin = await User.findById(userId);

    if (!admin) {
        throw new ApiError(404, "Admin not found"); 
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) { 
        throw new ApiError(400, "Invalid members provided");
    }

    const newChannel = new Channel({
        name,
        members,
        admin: userId
    });

    await newChannel.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            { channel: newChannel },
            "Channel Created Successfully"
        )
    );
});


const getUserChannels = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const channels = await Channel.find({
        $or: [{ admin: userId }, { members: userId }]
    }).sort({ updatedAt: -1 });



    return res.status(200).json(
        new ApiResponse(
            200,
            { channels },
            "User Channels Retrieved Successfully"
        )
    );
});

const getChannelMessages = asyncHandler(async (req, res) => { 
    const { channelId } = req.params;
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const channel = await Channel.findById(channelId);
    requireChannelAccess(channel, req.userId);
    await channel.populate({
        path: "messages",
        populate: {
            path: "sender",
            select: "firstName lastName image _id image color"
        },
    });

    const messages = channel.messages;

    return res.status(200).json(
        new ApiResponse(
            200,
            { messages },
            "All Channel Messages Fetched Successfully!!"
        )
    );
})

const getChannelMembers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const channel = await Channel.findById(channelId);
    requireChannelAccess(channel, req.userId);
    await channel.populate("members", "firstName lastName image _id color");

    const channelMembers = channel.members;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { channelMembers },
                "Channel Members Retrieved Successfully"
        )
    )


})
 
const addMembers = asyncHandler(async (req, res) => { 
    const { channelId } = req.params;
    const { userIds } = req.body;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    if (!userIds || !Array.isArray(userIds)) {
        throw new ApiError(400, "User IDs are required and must be an array");
    }

    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const channel = await Channel.findById(channelId);
    requireChannelAccess(channel, req.userId, true); // Only the channel admin can invite members.
    const validUsers = await User.find({ _id: { $in: userIds } });

    if (validUsers.length !== userIds.length) {
        throw new ApiError(400, "Some user IDs are invalid");
    }

    // Prevent duplicates
    const existingMemberIds = channel.members.map(m => m.toString());
    const newMemberIds = validUsers.map(u => u._id.toString());

    const uniqueNewIds = newMemberIds.filter(id => !existingMemberIds.includes(id));

    channel.members.push(...uniqueNewIds);
    await channel.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { channel },
            "Members Added Successfully"
        )
    );
});


export { 
    createChannel,
    getUserChannels,
    getChannelMessages,
    getChannelMembers,
    addMembers
}