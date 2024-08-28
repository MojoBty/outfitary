'use client'
import AvatarSelectionPage from "@/components/AvatarSelectionPage";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"


export default function Home() {
  const { session } = useSession();
  return (
      <main className="flex min-h-screen justify-center p-10">
        {session === null ? (
          <div className="flex flex-col justify-center items-center font-semibold text-[1.8rem]">
            Please sign in to use this application.
            <div className="mt-8">
              <Link href='/sign-in' className={buttonVariants({ variant: "outline" })}>Sign In</Link>
            </div>
          </div>
          
        ): (
          <AvatarSelectionPage />
        )}
      </main>
  );
}
