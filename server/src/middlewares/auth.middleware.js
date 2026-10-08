import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const bearer = req.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = req.cookies?.accessToken || bearer;
  if (!token) throw new ApiError(401, "Missing access token");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(
      401,
      error.name === "TokenExpiredError" ? "jwt expired" : "Invalid access token"
    );
  }

  const user = await User.findById(decoded._id).select("-password -refreshToken");
  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;
  req.userId = String(user._id);
  next();
});
