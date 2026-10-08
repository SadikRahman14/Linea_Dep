import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store';
import {IoArrowBack} from 'react-icons/io5'
import { colors, getColor } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE, HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const {userInfo, setUserInfo} = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
  }, [userInfo.profileSetup, userInfo.firstName, userInfo.lastName, userInfo.color]);

  useEffect(() => {
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    } else {
      setImage(null); 
    }
  }, [userInfo.image]);


  const validateProfile = () => {
    if(!firstName){
      toast.error("First Name is Required");
      return false;
    }
    if(!lastName){
      toast.error("Last Name is Required");
      return false;
    }
    return true;
  }


  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const response = await apiClient.post(UPDATE_PROFILE, 
          {firstName, lastName, color: selectedColor},
          {withCredentials: true}
        );
        console.log("Full Response:", response);

        const user = response.data.data;

        if(response.status === 200 && user){
          console.log("Updating userInfo:", user);
          setUserInfo(user);
          toast.success("Profile Updated Successfully");
          navigate("/profile");

        }
      } catch (error) {
        
      }
    }
  }


  const handleArrow = () => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }
    else{
      toast.error("Please Complete Profile Setup")
    }
  }


  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async(event) => {
    const file = event.target.files[0];
    console.log({ file });

    if(file){
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE, formData,{
        withCredentials : true
      });

      if(response.status === 200 && response.data.image){
        toast.success("Image Uploaded Successfully"); 
        setUserInfo(prev => ({ ...prev, image: response.data.image }));
      }

    }
  };

  const handleDeleteImage = async() => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true
      });
      if(response.status === 200){
        setUserInfo({...userInfo, image: null});
        toast.success("Image Deleted Successfully!!");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleArrow}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer"/> 
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48  rounded-full overflow-hidden">
              {userInfo.image ? (
                <AvatarImage
                  src={`${HOST}/${userInfo.image}`}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                /> 
              ) : 
                (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full
                    ${getColor(selectedColor)}`}>
                    {
                      firstName ? firstName.split("").shift()
                      : userInfo.email.split("").shift()
                    }
                  </div>
                )
              }
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer"/>
                ) : (
                  <FaPlus className='"text-white text-3xl cursor-pointer' />
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              className='hidden'
              onChange={handleImageChange}
              name='profile-image'
              accept='.png, .jpg, .jpeg, .svg, .webp'
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input 
                placeholder="Email"
                type='email'
                disabled
                value={userInfo.email}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
              
            </div>
            <div className="w-full">
              <Input 
                placeholder="First Name"
                type='text'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full">
              <Input 
                placeholder="Last Name"
                type='text'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${
                    selectedColor === index ? "outline outline-white/50 outline-1" : ""
                  }
                `}
                key={index}
                onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Button 
            className='h-16 w-full bg-sky-700 hover:bg-sky-950 transition-all duration-300'
            onClick = {saveChanges}
          > Save Changes </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile