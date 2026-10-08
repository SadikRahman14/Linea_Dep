import React, { useEffect } from 'react'
import ProfileComponent from './components/profile-info';
import NewDM from './components/new-dm/index.jsx';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS, GET_USER_CHANNELS } from '@/utils/constants';
import ContactList from '@/components/contact-list';
import { useAppStore } from '@/store';
import CreateChannel from './components/create-channel';
import { MdGroupAdd } from "react-icons/md";
import LineaLogo from "@/assets/Lineapp.png"


function ContactContainer() {

  const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore();


  useEffect(() => {
    const getContacts = async() => {
      const response = await apiClient.get(GET_DM_CONTACTS,
        {withCredentials: true}
      );
      if(response.data.data.contacts){
        setDirectMessagesContacts(response.data.data.contacts);
      }
    };
    getContacts();

    const getChannels = async () => { 
      const response = await apiClient.get(GET_USER_CHANNELS,
        {withCredentials: true}
      );
      if(response.data.data.channels){
        setChannels(response.data.data.channels);
      }
    }
    getChannels();
  },[setChannels, setDirectMessagesContacts])

  return (
    <div className='relative  md:w-[35vw] lg:w-[30vw] xl:w[20vw] bg-[#193228] border-r-2 border-[#eff0f6] w-full'>
        <div className='pt-3'>
            <Logo/>
        </div>
        <div className='my-5 mb-'>
            <div className="flex items-center justify-between pr-10">
                <Title text="Direct Message"/>
                <NewDM/>
            </div>
            <div
              className="overflow-y-auto max-h-[38vh]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'    
              }}
            >
              <ContactList contacts={directMessagesContacts} />
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
        </div>
        <div className='my-5'>
            <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel/>
        </div>
        <div
              className="overflow-y-auto max-h-[38vh]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'          
              }}
            >
          <ContactList contacts={channels} isChannel={ true } />
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
        </div>
        <ProfileComponent/>
    </div>
  )
}





const Logo = () => {
  return (
    <div className="ml-5 mb-5 flex p-5 justify-start items-center gap-2">
      <img src={LineaLogo} alt="LOGO" height={150} width={200} />
    </div>
  );
};



const Title = ({ text }) => {
    return (
        <h6 className='uppercase tracking-widest to-neutral-400 pl-10 font-bold text-opacity-90 text-sm'>
            {text}
        </h6>
    );
}
export default ContactContainer;