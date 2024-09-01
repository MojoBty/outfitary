'use client'
import { useSession, useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react'
import { useSupabase } from '../utils/supabase/client';
import { Button } from './ui/button';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import { useCloset } from '../context/ClosetContext';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X } from 'lucide-react';

import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"

const formSchema = z.object({
  title: z.string().min(1).max(40, {
    message: "Outfit title must be less than 40 characters"
  }),
})

const ClosetPresets = () => {

  const {selectedTop, setSelectedTop, selectedBottoms, setSelectedBottoms, selectedShoes, setSelectedShoes, selectedHeadwear, setSelectedHeadwear, outfitIndexes, setOutfitIndex, setSelectedIndexes} = useCloset()

  const { session } = useSession()
  const client = useSupabase()
  const {user } = useUser()

  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadOutfits() {
    const { data, error } = await client
    .from('outfits')
    .select()
    .eq('user_id', user.id)
    
    if (error) {
      console.error('Error loading outfits:', error);
    } else {
      
      setOutfits(data);
      
    }
  }

  useEffect(() => {
    
    if (!session || !user) {
      console.log('Session or user not available:', session, user);
      return;
    }

    loadOutfits()
    
  }, [session, user, client])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { reset } = form

  const onSubmit = async(values) => {
    setLoading(true)
    console.log(values.title)
    console.log(selectedTop.id)
    const { data, error } = await client
    .from('outfits')
    .insert({title: values.title, top_id: selectedTop.id, bottoms_id: selectedBottoms.id, shoes_id: selectedShoes.id, headwear_id: selectedHeadwear.id})
    if (error) {
      console.error(error)
    }
    loadOutfits()
    setLoading(false)
  }

  const splideOptions = {
    perPage: 1,
    pagination: true,
    arrows: true,
    width: '60rem',
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

  const setCurrentOutfit = async(pageIndex, cardIndex, card) => {

    setOutfitIndex(pageIndex, cardIndex)

    let headwear = {title: null, image_link: null, id: null};
    let top = {title: null, image_link: null, id: null};
    let bottoms = {title: null, image_link: null, id: null};
    let shoes = {title: null, image_link: null, id: null};

    
    if (card.headwear_id) {
      const { data: headwearData, error: headwearDataError } = await client
      .from('headwear')
      .select()
      .eq('id', card.headwear_id)
      headwear = {title: headwearData[0].title, image_link: headwearData[0].image_link, id: headwearData[0].id}
    }

    if (card.top_id) {
      const { data: topData, error: topDataError } = await client
      .from('tops')
      .select()
      .eq('id', card.top_id)
      top = {title: topData[0].title, image_link: topData[0].image_link, id: topData[0].id}
    }

    if (card.bottoms_id) {
      const { data: bottomsData, error: bottomsDataError } = await client
      .from('bottoms')
      .select()
      .eq('id', card.bottoms_id)
      bottoms = {title: bottomsData[0].title, image_link: bottomsData[0].image_link, id: bottomsData[0].id}
    }

   if (card.shoes_id) {
      const { data: shoesData, error: shoesDataError } = await client
      .from('shoes')
      .select()
      .eq('id', card.shoes_id)
      shoes = {title: shoesData[0].title, image_link: shoesData[0].image_link, id: shoesData[0].id}

    }
  
    setSelectedHeadwear(headwear)
    setSelectedTop(top)
    setSelectedBottoms(bottoms)
    setSelectedShoes(shoes)
    setSelectedIndexes({
      tops: {page: null, index: null},
      bottoms: {page: null, index: null},
      shoes: {page: null, index: null},
      headwear: {page: null, index: null}})
    reset()
  }


  const handleOutfitDelete = async(event, id) => {
    event.stopPropagation();
    const response = await client
      .from('outfits')
      .delete()
      .eq('id', id)
      if (response.error) {
        console.error('Error deleting item:', response.error);
      } else {
        setOutfits(prevItems => prevItems.filter(item => item.id !== id))
      }
  }

  return (

    <div className='flex flex-col'>
      
      <h1 className='flex lg:justify-normal justify-center font-semibold text-[2rem] mt-[1.3rem]'>
        Outfit Presets
      </h1>
      {outfits.length === 0 ? (
        <div className='font-medium text-[1.15rem]'>
          You currently have no outfits saved.
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center '>
          <Splide options={splideOptions}>
            {Array.from({ length: Math.ceil(outfits.length / 3) }).map((_, pageIndex) => (
              <SplideSlide className='flex py-8 justify-items-center justify-center items-center'  key={pageIndex}>
                <div className={outfits.length > 3 ? `flex gap-x-12 items-center`: 'flex gap-x-12 items-center px-[6.5rem]'}>
                  {outfits.slice(pageIndex * 3, pageIndex * 3 + 3).map((card, cardIndex) => (
                    <div key={cardIndex} className={`flex text-[.9rem] items-center justify-between font-medium bg-gray-100 p-6 rounded-lg shadow-md w-[200px] ${outfitIndexes.page === pageIndex && outfitIndexes.index === cardIndex ? 'border-2 border-blue-500' : 'border'}`} onClick={() => setCurrentOutfit(pageIndex, cardIndex, card)}> 
                      {card.title}
                      <Button variant="outline" size="icon" className='ml-2 h-[1.3rem] w-[1.3rem]' onClick={(e) => handleOutfitDelete(e, card.id)}>
                        < X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
      )}
      <div className='flex lg:justify-normal justify-center pt-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input className='w-[20rem]' placeholder="Enter the title of your outfit" {...field} />
                  </FormControl>
                  <FormDescription>Saves current selected clothes as an outfit preset.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<></>)} Save new outfit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ClosetPresets