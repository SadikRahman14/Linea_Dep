import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST, LOG_OUT } from '@/utils/constants'
import React from 'react'
import { TooltipProvider, Tooltip,TooltipContent,TooltipTrigger } from "@/components/ui/tooltip"
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'
import { RiShutDownLine } from "react-icons/ri";
import { apiClient } from '@/lib/api-client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ProfileComponent() {
    const userInfo = useAppStore(state => state.userInfo);
    const navigate = useNavigate();
    const {setUserInfo} = useAppStore();

    const logout = async () => {
        try {
            const response = await apiClient.post(
                LOG_OUT,
                {},
                { withCredentials : true }
            )

            if(response.status == 200){
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10  w-full bg-[#022a08]'> 
        <div className="flex gap-3 items-center justify-center">
            <div className='w-12 h-12 relative'> 
                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
              {userInfo.image ? (
                <AvatarImage
                  src={`${HOST}/${userInfo.image}`}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                /> 
              ) : 
                (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full
                    ${getColor(userInfo.color)}`}>
                    {
                      userInfo.firstName ? userInfo.firstName.split("").shift()
                      : userInfo.email.split("").shift()
                    }
                  </div>
                )
              }
            </Avatar>
            </div>
            <div className='oswald-custom '>
                {userInfo.lastName ? 
                    `${userInfo.lastName}` : ""
                }
            </div>
        </div>
        <div className="flex gap-5">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger> 
                        <CiEdit className='text-purple-500 text-xl font-medium'
                        onClick={() => navigate("/profile")}/> 
                    </TooltipTrigger>
                    <TooltipContent className='bg-[#1b1c1e] border-none text-white'>
                        <p>Edit Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <AlertDialog>
                <TooltipProvider>
                    <Tooltip>
                    <AlertDialogTrigger asChild>
                        <TooltipTrigger>
                        <RiShutDownLine className='text-red-500 text-xl font-medium cursor-pointer' />
                        </TooltipTrigger>
                    </AlertDialogTrigger>

                    <TooltipContent className='bg-[#1b1c1e] border-none text-white'>
                        <p>Log Out</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <AlertDialogContent className='bg-black'>
                    <AlertDialogHeader>
                    <AlertDialogTitle> <RiShutDownLine className='text-red-500 text-3xl font-medium cursor-pointer'/> </AlertDialogTitle>
                    <AlertDialogDescription className='font-bold'>
                        Are you sure you want to log out?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-red-700' onClick={logout}>
                            LogOut
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> 
        </div>
    </div>
  )
}

export default ProfileComponent