import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync} from "fs"

// Cookies work on localhost over HTTP and on the Render HTTPS domain.
// Keep client and API on the same origin in production.
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
const accessCookieOptions = { ...cookieOptions, maxAge: 15 * 60 * 1000 };
const refreshCookieOptions = { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 };

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new Error("User not found while generating token")
        }

        const accessToken = user.genetateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false})

        return { accessToken, refreshToken }

    } catch (error) {
        console.error("generateAccessAndRefreshToken error", error);
        throw new ApiError(500, "Something went wrong");
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Refresh must not require an existing valid access token.
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Missing refresh token");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  return res.status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Session refreshed"));
});

const signup = asyncHandler( async(req, res) => {


    const { email, password } = req.body;


    if(!email || !password){
        throw new ApiError(400, "Both email and password are required")
    }

    const isUserExists = await User.findOne({
        $or: [{email}]
    })

    if(isUserExists){
        throw new ApiError(409, "User with this email already exists");
    }

    const createUser = await User.create({email, password});

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(createUser._id);

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .json(
            new ApiResponse(201, {
                user : {
                    _id: createUser._id,
                    email: createUser.email,
                },
                
            }, "User Registered Successfully")
        )

})

const login = asyncHandler( async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400, "Email and Password is required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User Credentials Not Found");
    }

    const isPaswordValid = await user.isPasswordCorrect(password);

    if(!isPaswordValid){
        throw new ApiError(401, "Password is Incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);





    return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    email: user.email,
                    profileSetup: user.profileSetup,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    color: user.color
                }
            },
            "User Logged in Successfully"
        )
    );



})

const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      }
    }, "User Data Fetched Successfully")
  );
});

const updateProfile = asyncHandler( async(req, res, next) => {
    const userId = req.userId;

    if(!userId){
        throw new ApiError(404, "The user ID was not found");
    }

    const {firstName, lastName, color} = req.body;
    if(!firstName || !lastName){
        throw new ApiError(400, " Three Fields are Required ")
    }

    const userData = await User.findByIdAndUpdate(
        userId,
        {
            firstName,
            lastName,
            color,
            profileSetup: true
        },
        { new: true, runValidators: true }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                _id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
            },
            "Profile Updated Successfully!!"
        )
    )

})

const addProfileImage = asyncHandler( async(req, res, next) => {
    if(!req.file){
        throw new ApiError(400, "File is Required")
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { image: fileName },
        {new: true, runValidators: true}
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                image: updatedUser.image,
            },
            "Image Updated Successfully"
        )
    )
})


const removeProfileImage = asyncHandler( async(req, res, next) => {
    const { userId } = req;
    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(400, "User Not Found");
    }

    if(user.image){
        unlinkSync(user.image)
    }

    user.image = null;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Image Deleted Successfully!!")
    )
})

const logoutUser = asyncHandler( async(req, res) => {
    const {userId} = req;
    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken: null
            }
        },
        {new: true}
    )


    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
})

export {
    signup,
    login,
    getUserInfo,
    refreshAccessToken,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logoutUser
}