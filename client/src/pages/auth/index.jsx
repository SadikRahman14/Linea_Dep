import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import Background from '../../assets/login-vector.png'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constants'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'


function Auth() {

    const { setUserInfo } = useAppStore();
    const navigate = useNavigate()
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
    const validateSignup = () => {
        if(!signupEmail.length){
            toast.error("Email is Required");
            return false;
        }
        if(!signupPassword.length){
            toast.error("Password is Required")
            return false;
        }
        if(signupPassword !== confirmPassword){
            toast.error("Passwords Must be Same")
            return false;
        }
        return true;
    }

    const validateLogin = () => {
        if(!loginEmail.length){
            toast.error("Email is Required");
            return false;
        }
        if(!loginPassword.length){
            toast.error("Password is Required")
            return false;
        }
        return true;
    }




    const handleLogin  = async () => {
        
        if(!validateLogin()) return; 

        try {
            const response = await apiClient.post(LOGIN_ROUTES, {
                email : loginEmail,
                password : loginPassword
            },
            {
                withCredentials: true
            }
            );

            const { user } = response.data.data;

            console.log("Login Response:", response.data);
            toast.success("Logged in Successfully");

            if (user && user._id) {
                setUserInfo(response.data.data.user);
                navigate(user.profileSetup ? "/chat" : "/profile");
            } else {
                toast.error("Invalid user data received");
                console.error("Missing user data:", user);
            }

        } catch (error) {
            toast.error("Login Failed, Try Again");
            console.log(error)
        }
    };


    const handleSignup = async () => {

        if(!validateSignup()) return; 

        try {
            const response = await apiClient.post(SIGNUP_ROUTES, {
                email: signupEmail, 
                password: signupPassword
            })
            console.log({ response });
            toast.success("Signed Up Successfully");

            if(response.status === 201){
                setUserInfo(response.data.data.user);
                navigate("/profile")
            }
        } catch (error) {
            toast.error("SignUp Failed, Try Again");
            console.log(error)
        }
        
    }

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
            <div className="flex flex-col gap-10 items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                    <div className='flex items-center justify-center'>
                        <h1 className='text-5xl font-bold border-b-2 md:text-6xl'> W e l c o m e </h1>
                    </div>
                    <p className="font-medium text-center">
                        Conect.Share.Chat
                    </p>
                </div>
                <div className="flex items-center justify-center w-full">
                    <Tabs className='w-3/4' defaultValue='login'>
                        <TabsList className="flex bg-transparent rounded-none w-full">
                            <TabsTrigger value="login"
                            className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]: font-semibold
                             data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">
                                Login
                            </TabsTrigger>
                            <TabsTrigger value = "signup"
                            className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]: font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">
                                Signup
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login"
                        className="flex flex-col gap-5 mt-10">
                            <Input
                                placeholder = "Email"
                                type="email"
                                className="rounded-full p-6"
                                value={loginEmail}
                                onChange = {(e) => setLoginEmail(e.target.value)}
                            />
                            <Input
                                placeholder = "Password"
                                type="password"
                                className="rounded-full p-6"
                                value={loginPassword}
                                onChange = {(e) => setLoginPassword(e.target.value)}
                            />
                            <Button 
                                className="rounded-full p-6"
                                onClick={handleLogin}
                                > L O G I N 
                            </Button>
                        </TabsContent>
                        <TabsContent value="signup"
                        className="flex flex-col gap-5">
                            <Input
                                placeholder = "Email"
                                type="email"
                                className="rounded-full p-6"
                                value={signupEmail}
                                onChange = {(e) => setSignupEmail(e.target.value)}
                            />
                            <Input
                                placeholder = "Password"
                                type="password"
                                className="rounded-full p-6"
                                value={signupPassword}
                                onChange = {(e) => setSignupPassword(e.target.value)}
                            />
                            <Input
                                placeholder = "Confirm Password"
                                type="password"
                                className="rounded-full p-6"
                                value={confirmPassword}
                                onChange = {(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button 
                                className="rounded-full p-6"
                                onClick={handleSignup}
                                > S I G N U P 
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className="hidden xl:flex justify-center items-center">
                <img src={Background} alt="Login Background" className='h-[500px]'/>
            </div>
        </div>
    </div>
  )
}

export default Auth