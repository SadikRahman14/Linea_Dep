import { Server as SocketIoServer } from "socket.io";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";
import Message from "./src/models/messages.model.js";
import Channel from "./src/models/channel.model.js";

const userRoom = (id) => `user:${id}`;

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN || false,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Parse httpOnly accessToken cookies during the Socket.IO handshake.
  io.engine.use(cookieParser());

  io.use(async (socket, next) => {
    try {
      const token = socket.request.cookies?.accessToken;
      if (!token) return next(new Error("Unauthorized"));
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(payload._id).select("_id");
      if (!user) return next(new Error("Unauthorized"));
      socket.data.userId = String(user._id);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  const sendMessage = async (socket, message) => {
    const senderId = socket.data.userId; // NEVER trust a sender ID from the client.
    if (!message || !mongoose.isValidObjectId(message.recipient)) return;
    const recipientId = String(message.recipient);

    const messageType = message.messageType === "file" ? "file" : "text";
    const content = typeof message.content === "string" ? message.content.trim() : "";
    const fileURL = typeof message.fileURL === "string" ? message.fileURL : "";
    if (messageType === "text" && (!content || content.length > 5000)) return;
    if (messageType === "file" && !fileURL.startsWith("uploads/files/")) return;

    try {
      const recipientExists = await User.exists({ _id: recipientId });
      if (!recipientExists) return;
      const created = await Message.create({
        sender: senderId,
        recipient: recipientId,
        content: messageType === "text" ? content : undefined,
        messageType,
        fileURL: messageType === "file" ? fileURL : undefined,
        timeStamp: new Date(),
      });
      const fullMessage = await Message.findById(created._id)
        .populate("sender", "email firstName lastName image color")
        .populate("recipient", "email firstName lastName image color");
      io.to(userRoom(senderId)).to(userRoom(recipientId)).emit("recieveMessage", fullMessage);
    } catch (error) {
      console.error("Failed to send direct message:", error.message);
    }
  };

  const sendChannelMessage = async (socket, message) => {
    const senderId = socket.data.userId;
    if (!message || !mongoose.isValidObjectId(message.channelId)) return;
    const messageType = message.messageType === "file" ? "file" : "text";
    const content = typeof message.content === "string" ? message.content.trim() : "";
    const fileURL = typeof message.fileURL === "string" ? message.fileURL : "";
    if (messageType === "text" && (!content || content.length > 5000)) return;
    if (messageType === "file" && !fileURL.startsWith("uploads/files/")) return;

    try {
      const channel = await Channel.findById(message.channelId);
      if (!channel) return;
      const memberIds = [String(channel.admin), ...channel.members.map(String)];
      if (!memberIds.includes(senderId)) return; // Not a channel member.

      const created = await Message.create({
        sender: senderId,
        recipient: null,
        content: messageType === "text" ? content : undefined,
        messageType,
        fileURL: messageType === "file" ? fileURL : undefined,
        timeStamp: new Date(),
      });
      await Channel.findByIdAndUpdate(channel._id, {
        $push: { messages: created._id },
        $set: { updatedAt: new Date() },
      });
      const fullMessage = await Message.findById(created._id)
        .populate("sender", "email firstName lastName image color");
      const data = { ...fullMessage.toObject(), channelId: channel._id };
      for (const id of new Set(memberIds)) {
        io.to(userRoom(id)).emit("recieve-channel-message", data);
      }
    } catch (error) {
      console.error("Failed to send channel message:", error.message);
    }
  };

  io.on("connection", (socket) => {
    socket.join(userRoom(socket.data.userId));
    socket.on("sendMessage", (message) => { void sendMessage(socket, message); });
    socket.on("send-channel-message", (message) => { void sendChannelMessage(socket, message); });
  });

  return io;
};

export default setupSocket;
