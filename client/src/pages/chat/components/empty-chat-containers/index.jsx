import React from 'react'
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils.js';
import LineaLogo from "@/assets/Lineapp.png"

function EmptyChatContainer() {
  return (
    <div className='flex-1 bg-[#051d0f] first-letter:md:bg-[#020a41] md:flex md:flex-col justify-center items-center duration-300 transition-all'>
        <Lottie 
            isClickToPauseDisabled={true}
            height={400}
            width={500}
            options={animationDefaultOptions}
        />
        <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
          <img src={LineaLogo} alt="" height={200} width={200} />
          <p className='oswald-bold text-lg opacity-70 max-w-xl'>
            Connect With Your Friends, Slide into DMs, Create a Channel!
        </p>
        <p className='oswald-bold text-2xl opacity-70 max-w-xl'>
            Now is the time!
          </p>
        </div>
        </div>

  )
}

export default EmptyChatContainer