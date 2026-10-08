import React, { useEffect, useState } from 'react'
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
import { CREATE_CHANNEL, GET_ALL_CONTACTS, SEARCH_ROUTES } from '@/utils/constants';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { HOST } from '@/utils/constants';
import { useAppStore } from '@/store';
import { getColor } from '@/lib/utils';
import { MdGroupAdd } from "react-icons/md";
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multiple-select';

function CreateChannel() {
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]); 
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async() => { 
            const response = await apiClient.get(GET_ALL_CONTACTS,
                { withCredentials: true }
            );
            setAllContacts(response.data.data.contacts);
        }

        getData();
     },[])
     
    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL,
                    {
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value)
                    },
                    { withCredentials: true }
                )

                if (response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(response.data.data.channel);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

  

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MdGroupAdd
              className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
            <p> Create a New Channel </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
          <DialogHeader>
            <DialogTitle> Fill up the details for a new channel</DialogTitle>
          </DialogHeader>

             <div>
                <Input
                placeholder="Channel Name"
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
                value={ channelName } 
                onChange={(e) => setChannelName(e.target.value)}
                />
                  </div>
                  
                
                <div className='mb-auto'>
                    <MultipleSelector
                        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white z-50 "
                        defaultOptions={allContacts}
                        placeholder="Search Contacts"
                        value={selectedContacts}
                        onChange={setSelectedContacts}
                        emptyIndicator={ 
                            <p className='text-center text-lg leading-10 text-gray-600'>
                                No Result Found
                            </p>
                        }
                    />
                  </div>
                  <div>
                      <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                          onClick={createChannel}
                      >
                        Create Channel
                      </Button>       
                </div>
            
          
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateChannel;
