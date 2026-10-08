import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { HOST } from '@/utils/constants'

function ContactList({ contacts, isChannel = false}) {

  const{
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages
  } = useAppStore();

  const handleClick = (contact) => {
    if(isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if(selectedChatData && selectedChatData._id !== contact.id){
      setSelectedChatMessages([]);
    }
  }
  return (
    <div className="mt-10">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 mr-2 ml-2 transition-all duration-300 cursor-pointer rounded-2xl
            ${ selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#412265] hover:bg-[#5a2c8e]" 
              : "hover:bg-[#3708c311]"
            }`}
            onClick={() => handleClick(contact)}
        >
          <div className='flex gap-5 items-center justify-start text-neutral-300'>
            {!isChannel && (
              <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                    {contact.image ? (
                    <AvatarImage
                        src={`${HOST}/${contact.image}`}
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full bg-black"
                        
                    /> 
                    ) : 
                    (
                        <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full
                        ${getColor(contact.color)}`}>
                        {
                            contact.firstName ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()
                        }
                        </div>
                    )
                    }
                </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span> {`${contact.firstName} ${contact.lastName}`} </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContactList