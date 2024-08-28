"use client";

import {Button} from "@/components/ui/button";
import {SignedIn, SignedOut, SignInButton, SignOutButton} from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

export default function Home() {
    const createFile = useMutation(api.files.createFile);
    const files = useQuery(api.files.getFiles);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignedIn>
            <SignOutButton>
                <Button>Sign Out</Button>
            </SignOutButton>
        </SignedIn>
        {files?.map((file) => (<p key={file._id}>{file.name}</p>))}
        <div className="bg-gray-300">
            <Button className="bg-amber-400" onClick={() => createFile({name: "New File 2"})}>Add File</Button>
        </div>
        <SignedOut>
            <SignInButton mode="modal">
                <Button>
                    Sign In
                </Button>
            </SignInButton>
        </SignedOut>
    </main>
  );
}
