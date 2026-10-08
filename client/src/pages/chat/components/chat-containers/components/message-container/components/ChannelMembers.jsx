

import React, { useEffect, useState } from 'react'
import { IoIosPersonAdd } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { apiClient } from '@/lib/api-client';
import { GET_CHANNEL_MEMBERS, HOST } from '@/utils/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getColor } from '@/lib/utils';
import moment from 'moment';
import AddMembersDialog from './AddMembers.jsx';

function ChannelMembers({ channelId, open, onClose, isAdmin, allContacts, refreshMembers }) {
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const openAddMembers = () => {
    console.log("Add Members icon clicked");
    setShowAddMembersDialog(true);
    console.log("Dialog open state after click:", true);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      getChannelMembers();
      setLoading(false);
    }
   },[open])

  const getChannelMembers = async () => { 
    try {
      setLoading(true);
      const response = await apiClient.get(`${GET_CHANNEL_MEMBERS}/${channelId}`, {
        withCredentials: true,
      })

      setMembers(response.data.data.channelMembers || []);

    } catch (error) {
      setLoading(false);
      console.log({error})
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-black">
          <DialogHeader>
            <div className='flex justify-center items-center gap-2 py-2 '>
              <DialogTitle className="text-white">Channel Members</DialogTitle>
            </div>
            
            <div className="flex justify-center items-center gap-2 py-2 border-b border-gray-700">
              <DialogClose className="text-gray-400 hover:text-gray-600 cursor-pointer text-3xl">
                <IoMdCloseCircle className='inline-block text-red-600'/>
              </DialogClose>
              {/* <span className="text-white ml-2 text-3xl" onClick={openAddMembers}>
                <IoIosPersonAdd className="cursor-pointer inline-block  hover:text-gray-600" />
              </span> */}
            </div>
            
          </DialogHeader>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
              {members.length === 0 && (
                <p className="text-center text-gray-400">No members found.</p>
              )}

              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-2 rounded-md bg-gray-800"
                >
                  <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                    {member.image ? (
                      <AvatarImage
                        src={`${HOST}/${member.image}`}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback
                        className={`uppercase h-8 w-8 flex items-center justify-center rounded-full text-white ${getColor(member.color)}`}
                      >
                        {member.firstName ? member.firstName.charAt(0) : member.email.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className='justify-between flex-1'>
                    <p className="text-white font-semibold">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Joined {moment(member.joinedAt || member.createdAt).format('LL')}
                    </p>
                  </div>
                  <div>
                    <IoPersonRemoveSharp className='text-xl cursor-pointer text-red-900 hover:text-red-600' />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {isAdmin && (
        <AddMembersDialog
          open={true}
          onOpenChange={setShowAddMembersDialog}
          channelId={channelId}
          allContacts={allContacts}
          refreshMembers={getChannelMembers}
        />
      )}
    </div>
  )
}

export default ChannelMembers