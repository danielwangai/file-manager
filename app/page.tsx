"use client";

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useOrganization, useUser} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";
import UploadFile from "@/app/upload-file";
import {FileCard} from "@/app/file-card";


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
        <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadFile orgId={orgId} />
        </div>
        <div className="grid grid-cols-4 gap-2">
            {files?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>
        <Toaster />
    </main>
);
}
