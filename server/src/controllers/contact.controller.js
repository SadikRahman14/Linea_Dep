import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import Message from "../models/messages.model.js";

const searchContact = asyncHandler(async(req,res) => {
    const {searchTerm} = req.body;
    const {userId} = req;

    if(searchTerm === undefined || searchTerm === null){
        throw new ApiError(400, "Search Term is Required");
    }

    const sanitizedSearchTerm  = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g, "\\$&"
    );

    const regx = new RegExp(sanitizedSearchTerm , "i");

    

    const contacts = await User.find({
        $and:[
            {_id: { $ne: userId }},
            {
                $or: [{ firstName: regx}, {lastName: regx}]
            }
        ]
    })

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {contacts},
            "Searching Triggered"
        )
    )
})

const getContactsForDMList = asyncHandler(async(req,res) => {
    let {userId} = req;
    userId = new mongoose.Types.ObjectId(userId);


    const contacts = await Message.aggregate([
    {
        $match: {
        $or: [{ sender: userId }, { recipient: userId }],
        },
    },
    {
        $sort: { timestamp: -1 }  // corrected field name
    },
    {
        $group: {
        _id: {
            $cond: {
            if: { $eq: ["$sender", userId] },
            then: "$recipient",
            else: "$sender",
            },
        },
        lastMessageTime: { $first: "$timestamp" }  // corrected field name
        },
    },
    {
        $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "contactInfo"
        }
    },
    {
        $unwind: "$contactInfo"
    },
    {
        $project: {
        _id: 1,
        lastMessageTime: 1,
        email: "$contactInfo.email",
        firstName: "$contactInfo.firstName",
        lastName: "$contactInfo.lastName",
        image: "$contactInfo.image",
        color: "$contactInfo.color"
        }
    },
    {
        $sort: { lastMessageTime: -1 }
    }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            { contacts },
            "Contacts Fetched Successfully"
        )
    )
})


const getAllContacts = asyncHandler(async (req, res) => { 
    const user = await User.find({
        _id: { $ne: req.userId }
    },
        "firstName lastName _id"
    );

    const contacts = user.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id
    }))

    return res.status(200).json(
        new ApiResponse(
            200,
            { contacts },
            "Get ALL CONTACTS SUCCESSSFULL!!"
        )
    )
})

export {
    searchContact,
    getContactsForDMList,
    getAllContacts
}