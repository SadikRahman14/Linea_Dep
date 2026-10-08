import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { AUTH_ROUTES, HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const userId = useAppStore((state) => state.userInfo?._id);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) {
      setSocket(null);
      return;
    }

    // No userId query parameter: server authenticates httpOnly cookies.
    const connection = io(HOST, { withCredentials: true });
    setSocket(connection);

    const onDirectMessage = (message) => {
      const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } = useAppStore.getState();
      if (selectedChatType === "contact" && selectedChatData?._id && (
        selectedChatData._id === message.sender?._id ||
        selectedChatData._id === message.recipient?._id
      )) addMessage(message);
      addContactsInDMContacts(message);
    };

    const onChannelMessage = (message) => {
      const { selectedChatData, selectedChatType, addMessage, addChannelInchannelList } = useAppStore.getState();
      if (selectedChatType === "channel" && selectedChatData?._id === String(message.channelId)) {
        addMessage(message);
      }
      addChannelInchannelList(message);
    };

    const onConnectError = async (error) => {
      if (error.message !== "Unauthorized") return;
      try {
        // A sleeping Render server may reconnect after the access token expires.
        await apiClient.post(`${AUTH_ROUTES}/refresh-token`);
        if (!connection.connected) connection.connect();
      } catch {
        // Refresh token has expired; the next page load will request login.
      }
    };

    connection.on("recieveMessage", onDirectMessage);
    connection.on("recieve-channel-message", onChannelMessage);
    connection.on("connect_error", onConnectError);
    return () => connection.disconnect();
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
