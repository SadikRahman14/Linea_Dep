import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-containers/index.jsx';
import ContactContainer from './components/contact-containers/index.jsx';
import EmptyChatContainer from './components/empty-chat-containers/index.jsx';

function Chat() {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please Setup Profile to Continue!");
      navigate("/profile");
    }
  }, [userInfo, navigate])
  
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {isUploading && (
        <div className="fixed h-[100vh] w-[100vw] top-0 z-10 left-0 bg-black/80 items-center justify-center flex">
          <h5 className="animate-pulse text-5xl"> Uploading Files </h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="fixed h-[100vh] w-[100vw] top-0 z-10 left-0 bg-black/80 items-center justify-center flex">
          <h5 className="animate-pulse text-5xl"> Downloading Files </h5>
          {fileDownloadProgress}%
        </div>
      ) } 
      <ContactContainer/>
      {selectedChatType === undefined ? (
        <EmptyChatContainer/>
      ) : (
        <ChatContainer/>
      )}
      
    </div>
  )
}

export default Chat