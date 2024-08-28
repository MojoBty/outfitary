'use client'
import { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

// Create Supabase context
const SupabaseContext = createContext(null);

// Supabase provider component
export const ClerkSupabaseProvider = ({ children }) => {
  const { session } = useSession();

  // Create a Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await session?.getToken({ template: 'supabase' });
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${clerkToken}`);
        
        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use Supabase context
export const useSupabase = () => {
  return useContext(SupabaseContext);
};
