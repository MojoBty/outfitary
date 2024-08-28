"use client"

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"

import { useSession } from '@clerk/nextjs'

import axios from 'axios';
import { Loader2 } from "lucide-react"

import { useSupabase } from "../../utils/supabase/client";


import { Button } from "../../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Input } from "../../components/ui/input"

const formSchema = z.object({
  type: z.string(),
  title: z.string().max(50),
  description: z.string().max(200),
})

export default function Create() {
  const { session } = useSession()
  const [loading, setLoading] = useState(false)
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
    },
  })

  const client = useSupabase()

  const onSubmit = async(values) => {
    
    const clerkToken = await session?.getToken({
      template: 'supabase',
    })

    try {
      const response = await axios.post('https://outfitaryapi-285786456691.us-west1.run.app/api/process', {
        type: values.type,
        description: values.description
      },
      {
        headers: {
          'Authorization': `Bearer ${clerkToken}`
        }
      }
    );
      let imageLink = response.data
      const { data, error } = await client
      .from(values.type)
      .insert({ title: values.title, image_link: imageLink, description: values.description})
      if (error) {
        console.error(error)
      } else {
        console.log('success')
      }
      window.location.href = '/'
    } catch (error) {
      console.error('Error processing data:', error);
    }
    
  }

  return (
    <div className='flex flex-col'>
      <div>
        <h1 className="text-[2.2rem] font-medium my-10 mx-24">
          Add a clothing item to your closet
        </h1>
        <hr />
      </div>
      <div className="flex justify-center items-center pt-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clothing Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a clothing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tops">Tops</SelectItem>
                      <SelectItem value="bottoms">Bottoms</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="headwear">Headwear</SelectItem>
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Be as vague or specific as you would like</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" onClick={() => setLoading(true)}>
              {loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<></>)} Submit
            </Button>
            <FormDescription>Note: Generation may take up to 30 seconds.</FormDescription>
          </form>
        </Form>
      </div>
    </div>
  )
}