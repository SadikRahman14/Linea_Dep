import { useAppStore } from '@/store';
import React, { useEffect, useReducer, useRef, useState } from 'react'
import moment from 'moment';
import { apiClient } from '@/lib/api-client';
import { GET_ALL_MESSAGES, HOST } from '@/utils/constants';
import { MdOutlineFolderZip } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { Avatar, AvatarImage,AvatarFallback } from '@radix-ui/react-avatar';
import { getColor } from '@/lib/utils';
import { GET_CHANNEL_MESSAGES } from '@/utils/constants';

function MessageContainer() {

  const scrollRef = useRef();
  const { 
    selectedChatType, 
    selectedChatData, 
    userInfo, 
    selectedChatMessages, 
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);



  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES, 
          { id: selectedChatData._id},
          { withCredentials: true }
        );

        if(response.data.data.messages){
          setSelectedChatMessages(response.data.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, {
          withCredentials: true
        });

        if (response.data.data.messages) {
          setSelectedChatMessages(response.data.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if(selectedChatData._id){
      if (selectedChatType === "contact") getMessages();
      if(selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData._id, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  },[selectedChatMessages])

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className='text-center text-gray-500 my-2 text-xs'>
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          { selectedChatType === "channel" && renderChannelMessages(message) }
        </div>
      );
    });
  };

  const checkIfImage = (filePath) => {
    return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(filePath);
  };
  
  const downloadFile = async (url) => { 
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => { 
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      }
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)
    setIsDownloading(false);
    setFileDownloadProgress(0);
  }

const renderDMMessages = (message) => {
    const senderId = message.sender?._id || message.sender?.id || message.sender;
    const currentUserId = userInfo?._id || userInfo?.id;

    const isSender = String(currentUserId) === String(senderId);

    return (
      <div className={`mt-5 ${isSender ? "text-right" : "text-left"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#6d0202] text-white/90 border-black/50"
                : "bg-gray-800 text-white/80 border-[#ffffff]/20"
            } border inline-block p-3 rounded-xl my-1 max-w-full sm:max-w-[50%] break-words ml-2`}
            >
              {message.content}
            </div>
          )}
          {message.messageType === "file" && (
            <div
              className={`${
                isSender
                  ? "bg-black text-white/90 border-black/50"
                  : "bg-gray-800 text-white/80 border-[#ffffff]/20"
              } border inline-block p-3 rounded-xl my-1 max-w-full sm:max-w-[50%] break-words ml-2`}
            >
              {checkIfImage(message.fileURL) ? (
                <div
                  className='cursor-pointer'
                  onClick={() => {
                    setShowImage(true);
                    setImageURL(message.fileURL)
                  }}
                >
                  <img
                    src={`${HOST}/${message.fileURL}`}
                    className="max-w-full h-auto rounded"
                    alt="uploaded"
                  />
                </div>
              ) : (
                <div className='flex flex-wrap items-center justify-center gap-3'>
                  <span className='text-white/80 text-2xl bg-black rounded-full p-2'>
                    <MdOutlineFolderZip />
                  </span>
                  <span className='truncate max-w-[60%] text-sm sm:text-base'>
                    {message.fileURL.split("/").pop()}
                  </span>
                  <span
                    className='bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                    onClick={() => downloadFile(message.fileURL)}
                    title="Download file"
                  >
                    <FaCloudDownloadAlt />
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={`text-xs text-gray-600 ${isSender ? "text-right" : "text-left"} ml-2`}>
            {moment(message.timeStamp).format("LT")}
          </div>
        </div>
    );
  };

  const renderChannelMessages = (message) => { 
    const isSender = userInfo?._id === message.sender._id;
    return (
      <div className={`${isSender ? "text-right" : "text-left"} mb-9`}>

        
        {/* Message content */}
        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#6d0202] text-white/90 border-black/50"
                : "bg-gray-800 text-white/80 border-[#ffffff]/20"
            } border inline-block p-3 rounded-xl my-1 max-w-full sm:max-w-[50%] break-words ml-10`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              isSender
                ? "bg-black text-white/90 border-black/50"
                : "bg-gray-800 text-white/80 border-[#ffffff]/20"
            } border inline-block p-2 rounded-xl my-1 max-w-full sm:max-w-[50%] break-words ml-10`}
          >
            {checkIfImage(message.fileURL) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileURL);
                }}
              >
                <img
                  src={`${HOST}/${message.fileURL}`}
                  className="max-w-full h-auto rounded"
                  alt="uploaded"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-white/80 text-2xl bg-black rounded-full p-2">
                  <MdOutlineFolderZip />
                </span>
                <span className="truncate max-w-[60%] text-sm sm:text-base">
                  {message.fileURL.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileURL)}
                  title="Download file"
                >
                  <FaCloudDownloadAlt />
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sender info and timestamp - same for both message types */}
        {!isSender ? (
          <div className="flex items-center gap-3 mt-1 max-w-full sm:max-w-[50%] ml-10">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.charAt(0)
                  : message.sender.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60 truncate max-w-[6rem]">
              {message.sender.lastName}
            </span>
            <span className="text-xs text-white/60 whitespace-nowrap">
              {moment(message.timeStamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1 max-w-full sm:max-w-[50%] ml-auto whitespace-nowrap">
            {moment(message.timeStamp).format("LT")}
          </div>
        )}

      </div>
    );
  };





  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
  <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex flex-col items-center justify-center backdrop-blur-lg px-4 md:px-0">
    <div className="max-w-[90vw] md:max-w-[80vw] max-h-[80vh]">
      <img
        src={`${HOST}/${imageURL}`} alt=""
        className='h-full w-full object-contain rounded-md'
      />
    </div>

    <div className="flex gap-3 md:gap-5 fixed top-4 right-4 md:top-5 md:right-5 bg-black/30 rounded-full p-1 md:p-3">
      <button
        className='bg-black/20 p-2 md:p-3 text-xl md:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
        onClick={() => downloadFile(imageURL)}
        aria-label="Download"
      >
        <FaCloudDownloadAlt />
      </button>

      <div className="w-[1px] bg-black/60"></div> {/* Divider */}

      <button
        className='bg-black/20 p-2 md:p-3 text-xl md:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
        onClick={() => { 
          setImageURL(null);
          setShowImage(false);
        }}
        aria-label="Close"
      >
        <IoMdCloseCircle />
      </button>
    </div>
  </div>
  )}

    </div>
  )
  }

export default MessageContainer