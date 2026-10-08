import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from "../models/messages.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {renameSync, mkdirSync} from "fs"
import path from "path";
import { populate } from "dotenv";

const getMessages = asyncHandler( async(req,res) => {
    const userOne = req.userId;
    const userTwo = req.body.id;

    if(!userOne || !userTwo){
        throw new ApiError(400, "Bcoth User ID is required")
    }

    const messages = await Message.find({
        $or: [
            { sender: userOne, recipient: userTwo },
            { sender: userTwo, recipient: userOne}
        ],
    }).sort({timeStamp: 1});

    return res.status(200).json(
        new ApiResponse(
            200,
            {messages},
            "All Messeges Fetched Successfully!!"
        )
        
    )
})


const uploadFile = asyncHandler(async(req,res) => {
    if(!req.file){
        throw new ApiError(400, "File is Required");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`

    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName)

    return res.status(200).json(
        new ApiResponse(
            200,
            { fileURL: fileName },
            "File Uploaded Successfully"
        )
    )
})




export {
    getMessages,
    uploadFile,
}