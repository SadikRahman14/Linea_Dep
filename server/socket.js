import { Server as SocketIoServer } from "socket.io"
import Message from "./src/models/messages.model.js";
import Channel from "./src/models/channel.model.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected:: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()){
      if(socketId === socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }
  }

  // Change sendMessage to accept senderId explicitly
const sendMessage = async (message, senderId) => {
  if (!senderId) {
    console.error("Sender ID missing");
    return;
  }

  if (!message.recipient) {
    console.error("Recipient missing in message", message);
    return;
  }

  try {
    // Explicitly build the message object to save
    const messageToCreate = {
      sender: senderId,
      recipient: message.recipient,
      content: message.content || null,
      messageType: message.messageType || "text",
      timeStamp: new Date(),
      fileURL: message.fileURL || null,
    };

    const createdMessage = await Message.create(messageToCreate);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    const senderSocketId = userSocketMap.get(senderId);
    const recipientSocketId = userSocketMap.get(message.recipient);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};


const sendChannelMessage = async (message, senderId) => {
  try {
    const { channelId, content, messageType, fileURL } = message;

    if (!senderId) {
      console.error("Sender ID missing");
      return;
    }

    const createMessage = await Message.create({
      sender: senderId,
      recipient: null,
      content,
      messageType,
      timeStamp: new Date(),
      fileURL
    });

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createMessage._id }
    });

    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  } catch (error) {
    console.error("Error sending channel message:", error);
  }
};



  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected :: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }


    socket.on("sendMessage", (message) => sendMessage(message, userId));
    socket.on("send-channel-message", (message) => sendChannelMessage(message, userId));
    socket.on("disconnect", () => disconnect(socket));
  });
}

export default setupSocket;
