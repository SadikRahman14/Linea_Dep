import { useAppStore } from '@/store'
import React, { useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { HOST } from '@/utils/constants'
import { getColor } from '@/lib/utils'
import { FaUserGroup } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import ChannelMembers from '../message-container/components/ChannelMembers.jsx'

function ChatHeader() {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore()
    const [showMembers, setShowMembers] = useState(false);
    const { userInfo } = useAppStore();
    const isAdmin = selectedChatType === "channel" && userInfo?._id === selectedChatData?.adminId;

  return (
    <div className='h-[10vh] border-b-2 border-[#25203b] flex items-center justify-between px-20 '>
        <div className="flex gap-5 items-center w-full justify-between">
            <div className="flex items-center justify-center gap-5">
                  <div className='w-12 h-12 relative selectedChatType mr-0' > 
                      {selectedChatType === "contact"
                          ? <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                        {selectedChatData.image ? (
                            <AvatarImage
                                src={`${HOST}/${selectedChatData.image}`}
                                alt="Profile"
                                className="rounded-full object-cover w-full h-full bg-black"
                                
                            /> 
                            ) : 
                            (
                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full
                                ${getColor(selectedChatData.color)}`}>
                                {
                                    selectedChatData.firstName ? selectedChatData.firstName.split("").shift()
                                    : selectedChatData.email.split("").shift()
                                }
                                </div>
                            )
                            }
                          </Avatar> :
                          <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
                          #    
                    </div> }
                    
                    
                  </div>
                  
                  
                  <div className='font-bold oswald-medium ml-0'>
                      { selectedChatType === "channel" && selectedChatData.name}
                    {selectedChatType === "contact" && 
                        `${selectedChatData.firstName} ${selectedChatData.lastName}`
                    }
                </div>
            </div>
            
              <div className="flex items-center justify-center gap-5">
                  {selectedChatType === "channel" && (
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                            onClick={() => setShowMembers(true)}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                            <FaUserGroup className="text-xl text-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className='bg-black text-white p-2 rounded'>See Channel Members</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
)}

                <button className='to-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300
                transition-all'
                onClick={closeChat}>
                    <RiCloseFill className='text-3xl'/>
                </button>
            </div>

          </div>   
        {showMembers && (
            <ChannelMembers
                channelId={selectedChatData._id}
                isAdmin={isAdmin}
                open={showMembers}
                onClose={() => setShowMembers(false)}
                />
        )}  
    </div>
  )
}

export default ChatHeader