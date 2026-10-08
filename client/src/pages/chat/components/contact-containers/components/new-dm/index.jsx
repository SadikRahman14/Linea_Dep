import React, { useState } from 'react'
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoMdPersonAdd } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { animationDefaultOptions } from '@/lib/utils';
import Lottie from 'react-lottie';
import { apiClient } from '@/lib/api-client';
import { SEARCH_ROUTES } from '@/utils/constants';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { HOST } from '@/utils/constants';
import { useAppStore } from '@/store';
import { getColor } from '@/lib/utils';

function NewDM() {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const { setSelectedChatType, setSelectedChatData } = useAppStore();


  

  const searchContacts = async (searchTerm) => {
    try {
        if(searchTerm.length > 0){
            const response = await apiClient.post(
                SEARCH_ROUTES,
                { searchTerm },
                { withCredentials: true}
            );
            
            console.log(response.data.data.contacts)

            if(response.status === 200 && response.data.data.contacts){
                setSearchedContacts(response.data.data.contacts)
            }
        }
        else{
            setSearchedContacts([])
        }
    } catch (error) {
        console.log(error)
    }
  };


  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
    console.log(contact)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IoMdPersonAdd
              className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search Contacts..."
            className='rounded-lg p-6 bg-[#2c2e3b] border-none'
            onChange={(e) => searchContacts(e.target.value)}
          />
            <ScrollArea className='h-[250px]'>
                <div className="flex flex-col gap-5">
                    {searchedContacts.map((contact) => (
                        <div 
                            key={contact._id} 
                            className='flex gap-3 items-center cursor-pointer'
                            onClick={ () => selectNewContact(contact)}
                            >
                            <div className='w-12 h-12 relative'> 
                                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                    {contact.image ? (
                                    <AvatarImage
                                        src={`${HOST}/${contact.image}`}
                                        alt="Profile"
                                        className="object-cover w-full h-full bg-black"
                                    /> 
                                    ) : 
                                    (
                                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full
                                        ${getColor(contact.color)}`}>
                                        {
                                            contact.firstName ? contact.firstName.split("").shift()
                                            : contact.email.split("").shift()
                                        }
                                        </div>
                                    )
                                    }
                                </Avatar>
                            </div>
                            <div className="flex flex-col font-medium">
                                <span>
                                    {contact.firstName && contact.lastName
                                    ? `${contact.firstName} ${contact.lastName}`
                                    : ""}
                                </span>
                                <span className="text-xs text-opacity-70">
                                    {contact.email || ""}
                                </span>
                            </div>

                            
                        </div>
                    ))}
                </div>

            </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className='flex-1 md:bg-[#181920] md:flex md:flex-col justify-center items-center duration-300 transition-all mt-1'>
              <Lottie
                isClickToPauseDisabled={true}
                height={100}    
                width={100}
                options={animationDefaultOptions}
              />
              <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                <h3 className='oswald-bold'>
                  Why are You Alone <span className='text-purple-500'>?</span> 
                  
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewDM;
