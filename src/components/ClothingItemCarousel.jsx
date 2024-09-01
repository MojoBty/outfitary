'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'

import { useCloset } from '../context/ClosetContext';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import { Button } from '../components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import axios from 'axios';

import { useAuth } from '@clerk/nextjs'
import { useSession, useUser } from '@clerk/nextjs'
import { useSupabase } from "../utils/supabase/client";
import { Loader2 } from 'lucide-react';

const ClothingItemCarousel = (props) => {
  const { session } = useSession()
  const client = useSupabase()

  const [loadingStates, setLoadingStates] = useState({});

  const [carouselNumber, setCarouselNumber] = useState(2)
  const [isArrows, setIsArrows] = useState(true)

  useEffect(() => {
    const getViewportCategory = () => {
      const width = window.innerWidth;
      if (width > 1400) {
        setCarouselNumber(2) 
        setIsArrows(true)
      }
      else {
        setCarouselNumber(1)
        setIsArrows(false)
      }
    }

    const handleResize = () => {
      getViewportCategory()
    }
    getViewportCategory()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
    
  })

  const { userId} = useAuth()
  const clothingItems = props.data

  const { setSelectedTop, setSelectedBottoms, setSelectedShoes, setSelectedHeadwear, selectedIndexes, setSelectedIndex, setOutfitIndex } = useCloset();

  const splideOptions = {
    perPage: 1,  
    pagination: true,
    arrows: isArrows,
    width:'80rem',
    gap: '0rem',
    breakpoints: {
      600: {
        perPage: 1,
      },
      1024: {
        perPage: 1,
      },
      focus: 'center',
      autoWidth: true,
      
    },
  };

  const handleSelect = (title, imageLink, pageIndex, id, cardIndex) => {
    setOutfitIndex(null)
    console.log('test')
    
    if (cardIndex === selectedIndexes[props.type].index) {
      if (props.type === 'tops') {
        setSelectedTop({title: null, image_link: null, id: null})
      }
      if (props.type === 'bottoms') {
        setSelectedBottoms({title: null, image_link: null, id: null})
      }
      if (props.type === 'shoes') {
        setSelectedShoes({title: null, image_link: null, id: null})
      }
      if (props.type === 'headwear') {
        setSelectedHeadwear({title: null, image_link: null, id: null})
      }
      setSelectedIndex(props.type, null, null)
    } 
    else {
      setSelectedIndex(props.type, pageIndex, cardIndex)
      if (props.type === 'tops') {
        setSelectedTop({title: title, image_link: imageLink, id: id})
      }
      if (props.type === 'bottoms') {
        setSelectedBottoms({title: title, image_link: imageLink, id: id})
      }
      if (props.type === 'shoes') {
        setSelectedShoes({title: title, image_link: imageLink, id: id})
      }
      if (props.type === 'headwear') {
        setSelectedHeadwear({title: title, image_link: imageLink, id: id})
      }
    }
  }

  const handleClothesDelete = async(event, id) => {
    event.stopPropagation();
    const response = await client
      .from(props.type)
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      if (response.error) {
        console.error('Error deleting item:', response.error);
      } else {
        props.setClothingItems(prevItems => prevItems.filter(item => item.id !== id))
      }
  }

  const regenerateImage = async(event, cardID) => {
    
    event.stopPropagation();
    setLoadingStates(prevState => ({ ...prevState, [cardID]: true }));
    const clerkToken = await session?.getToken({
      template: 'supabase',
    })

    const { data: itemData, error: selectError} = await client
    .from(props.type)
    .select()
    .eq('id', cardID)

    console.log(itemData)

    try {
      const response = await axios.post('https://outfitaryapi-285786456691.us-west1.run.app/api/update', {
        type: props.type,
        description: itemData[0].description
      },
      {
        headers: {
          'Authorization': `Bearer ${clerkToken}`
        }
      }
    );
      let imageLink = response.data
      const { data: updateData, error: updateError } = await client
      .from(props.type)
      .update({ image_link: imageLink })
      .eq( 'id', cardID )
      if (updateError) {
        console.error(updateError)
      } else {
        console.log('success')
      }

      window.location.href = '/'
    } catch (error) {
      console.error('Error processing data:', error);
    }
    
  }
  

  
  return (
    <div className='flex flex-col w-[100%]'>
      <Splide options={splideOptions}>
        {Array.from({ length: Math.ceil(clothingItems.length / carouselNumber) }).map((_, pageIndex) => (
          <SplideSlide key={pageIndex}>
            <div className={`flex py-8 justify-items-center justify-center gap-24 items-center`}> 
              {clothingItems.slice(pageIndex * carouselNumber, pageIndex * carouselNumber + carouselNumber).map((card, cardIndex) => (
                <div key={cardIndex} className={`bg-white p-6 rounded-lg shadow-md w-[275px] h-[340px] ${selectedIndexes[props.type].page === pageIndex && selectedIndexes[props.type].index === cardIndex ? 'border-2 border-blue-500' : 'border'}`} onClick={() => handleSelect(card.title, card.image_link, pageIndex, card.id, cardIndex)}>
                  <div className='flex justify-between'>
                    
                    {card.title}
                    {card.id == 0 ? (
                     <></>
                    ) : ( <Button variant="outline" size="icon" className='h-6 w-6' onClick={(e) => handleClothesDelete(e, card.id)}>
                    < X className="h-4 w-4" />
                    </Button>)}
                    
                  </div>
                  <Image
                    className='mt-2 rounded-lg' 
                    src={card.image_link}
                    width={300}
                    height={300}
                    alt={card.title}
                  />
                  <Button onClick={(e) => regenerateImage(e, card.id)} className='text-[.7rem] h-[2rem] mt-3'>
                    {loadingStates[card.id] ? (<Loader2 className="mr-2 h-2 w-2 animate-spin" />) : (<></>)} Regenerate
                  </Button>
                </div>
                
              ))}
            </div>
          </SplideSlide>
        )) }
      </Splide>
      <div className='flex items-center justify-center mt-4'>
      <Button asChild>
        <Link href="/create">Add more items</Link>
      </Button>

      </div>
    </div>
  )
}

export default ClothingItemCarousel