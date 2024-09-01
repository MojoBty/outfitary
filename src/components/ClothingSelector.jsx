"use client"
import React from 'react'
import { useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import ClothingItemCarousel from './ClothingItemCarousel'
import { useSession, useUser } from '@clerk/nextjs';
import { useSupabase } from '../utils/supabase/client';

import { useCloset } from "../context/ClosetContext";

const ClothingSelector = () => {
  const { setSelectedTop, setSelectedBottoms, setSelectedShoes, setSelectedHeadwear, selectedTop, selectedBottoms, selectedShoes, selectedHeadwear, setSelectedIndex } = useCloset();
  const { session } = useSession();
  const { user } = useUser()

  
  const client = useSupabase()

  const [tops, setTops] = useState([])
  const [bottoms, setBottoms] = useState([])
  const [shoes, setShoes] = useState([])
  const [headwear, setHeadwear] = useState([])

  const loadItems = () => {
    async function loadTops() {
      const { data, error } = await client.from('tops').select().or(`user_id.eq.text,user_id.eq.${user.id}`)
      
      if (error) {
        console.error('Error loading tops:', error);
      } else if (JSON.stringify(selectedTop) === '{}') {
        
        setTops(data);
        setSelectedTop({title: data[0].title, image_link: data[0].image_link, id: data[0].id})
        
      }
    
    }
  
    async function loadBottoms() {
      const { data, error } = await client.from('bottoms').select().or(`user_id.eq.text,user_id.eq.${user.id}`)
      
      if (error) {
        console.error('Error loading bottoms:', error);
      } else if (JSON.stringify(selectedBottoms) === '{}') {
  
        setBottoms(data);
        setSelectedBottoms({title: data[0].title, image_link: data[0].image_link, id: data[0].id})
      }
      
    }
  
    async function loadShoes() {
      const { data, error } = await client.from('shoes').select().or(`user_id.eq.text,user_id.eq.${user.id}`)
      if (error) {
        console.error('Error loading shoes:', error);
      } else if (JSON.stringify(selectedShoes) === '{}') {
        setShoes(data);
        setSelectedShoes({title: data[0].title, image_link: data[0].image_link, id: data[0].id})
      }
      
    }
  
    async function loadHeadwear() {
      const { data, error } = await client.from('headwear').select().or(`user_id.eq.text,user_id.eq.${user.id}`)
      if (error) {
        console.error('Error loading headwear:', error);
      } else if (JSON.stringify(selectedHeadwear) === '{}'){
        setHeadwear(data);
        setSelectedHeadwear({title: data[0].title, image_link: data[0].image_link, id: data[0].id})
      }
      
    }

    loadTops()
    loadBottoms() 
    loadShoes()
    loadHeadwear()
  }
  
  
  useEffect(() => {
    
    if (!session || !user) {
      console.log('Session or user not available:', session, user);
      return;
    }
    loadItems()

  }, [session, user])

  return (
    <div className='flex flex-col w-[100%] lg:w-auto min-w-[60rem]'>

      <Tabs defaultValue="tops" className="h-[100%] flex flex-col">
        <div className='flex lg:justify-normal justify-center'>
        <TabsList className='w-[22rem]'>
          <TabsTrigger value="tops" >Tops</TabsTrigger>
          <TabsTrigger value="bottoms" >Bottoms</TabsTrigger>
          <TabsTrigger value="shoes" >Shoes</TabsTrigger>
          <TabsTrigger value="headwear" >Headwear</TabsTrigger>
        </TabsList>
        </div>
       
        <TabsContent className="flex items-center" value="tops">
          <ClothingItemCarousel type="tops" setClothingItems={setTops}  data={tops} reloadItems={loadItems}/>
        </TabsContent>
        <TabsContent className="flex -mt-[0.5px] items-center" value="bottoms">
          <ClothingItemCarousel type="bottoms" setClothingItems={setBottoms}  data={bottoms} reloadItems={loadItems}/>
        </TabsContent>
        <TabsContent className="flex -mt-[0.0px] items-center" value="shoes">
          <ClothingItemCarousel type="shoes" setClothingItems={setShoes}  data={shoes} reloadItems={loadItems}/>
        </TabsContent>
        <TabsContent className="flex -mt-[0.0px] items-center" value="headwear">
          <ClothingItemCarousel type="headwear" setClothingItems={setHeadwear}  data={headwear} reloadItems={loadItems}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClothingSelector