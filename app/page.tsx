"use client";

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useOrganization, useUser} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";
import UploadFile from "@/app/upload-file";


export default function Home() {
    const organization = useOrganization();
    const user = useUser();

    // allows personal accounts to manage files without belonging to an organization
    // by having user.id as the organization id
    let orgId : string | undefined = undefined;
    if(organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const files = useQuery(api.files.getFiles, orgId ? {orgId} : "skip");

  return (
    <main className="container mx-auto mt-12">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadFile orgId={orgId} />
        </div>
        {files?.map((file) => (<p key={file._id}>{file.name}</p>))}
        <Toaster />
    </main>
);
}
