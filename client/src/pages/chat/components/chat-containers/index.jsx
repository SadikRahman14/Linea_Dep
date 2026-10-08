import React from 'react'

import MessageBar from './components/messaage-bar/index.jsx'
import ChatHeader from './components/chat-header/index.jsx'
import MessageContainer from './components/message-container/index.jsx'

function ChatContainer() {
  return (
    <div className='fixed top-0 h-[100vh] w-[100vw] bg-[#021109] flex flex-col md:static md:flex-1'>
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
        
    </div>
  )
}

export default ChatContainer;