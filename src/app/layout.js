import { Montserrat } from "next/font/google";
import "./globals.css";
import ClothingProvider from "../context/ClosetContext"

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ClerkSupabaseProvider } from "../utils/supabase/client";


const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: 'Virtual Closet',
  description: 'Manage your virtual wardrobe with ease.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
        <link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" rel="stylesheet"></link>
        </head>
        <ClerkSupabaseProvider>
          <ClothingProvider>
            <body className={montserrat.className}>{children}</body>
          </ClothingProvider>
        </ClerkSupabaseProvider>
      </html>
    </ClerkProvider>
  );
}
