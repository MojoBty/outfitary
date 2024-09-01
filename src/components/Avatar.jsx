'use client'
import React from 'react'
import { useCloset } from '../context/ClosetContext';
import Image from 'next/image';

const Avatar = () => {

  const { selectedTop, selectedBottoms, selectedShoes, selectedHeadwear } = useCloset();

  return (
    <div className='flex flex-col min-w-[25rem]'>
      <div className='flex lg:justify-normal justify-center font-semibold text-[2rem]'>
        <h1>Outfit</h1>
      </div>
      <div className='flex flex-col items-center justify-center '>
        <div className='flex items-center border justify-center bg-white mt-[0.7rem] rounded-lg shadow-md w-[190px] h-[190px]'>
          {selectedHeadwear.id === null ? (<></>) : (
            <Image className='rounded-lg'
            src={selectedHeadwear.image_link}
            width={180}
            height={180}
            alt={selectedHeadwear.title}
            />
          )}
          
        </div>
        <div className='flex items-center border justify-center bg-white mt-[0.7rem] rounded-lg shadow-md w-[190px] h-[190px]'>
          {selectedTop.id === null ? (<></>) : (
              <Image className='rounded-lg'
              src={selectedTop.image_link}
              width={180}
              height={180}
              alt={selectedTop.title}
              />
            )}
        </div>
        
        <div className='flex items-center border justify-center bg-white mt-[0.7rem] rounded-lg shadow-md w-[190px] h-[190px]'>
          {selectedBottoms.id === null ? (<></>) : (
              <Image className='rounded-lg'
              src={selectedBottoms.image_link}
              width={180}
              height={180}
              alt={selectedBottoms.title}
              />
            )}
          
        </div>
        <div className='flex items-center border justify-center bg-white mt-[0.7rem] rounded-lg shadow-md w-[190px] h-[190px]'>
          {selectedShoes.id === null ? (<></>) : (
              <Image className='rounded-lg'
              src={selectedShoes.image_link}
              width={180}
              height={180}
              alt={selectedShoes.title}
              />
            )}
          
        </div>
      </div>
    </div>
  )
}

export default Avatar