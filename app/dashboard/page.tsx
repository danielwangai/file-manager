"use client"

import {Loader2} from "lucide-react";
import {SearchBar} from "@/app/dashboard/search-bar";
import UploadFile from "@/app/dashboard/upload-file";
import {FileCard} from "@/app/dashboard/file-card";
import {Toaster} from "@/components/ui/toaster";
import React, {useState} from "react";
import {useOrganization, useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Image from "next/image";

export function Placeholder({orgId}: {orgId: string}) {
    return (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image
                alt="an image of a picture and directory icon"
                width="300"
                height="300"
                src="/no-files.svg"
            />
            <div className="text-2xl">You have no files, upload one now</div>
            <UploadFile orgId={orgId} />
        </div>
    );
}

const FilesPage = () => {
    const organization = useOrganization();
    const user = useUser();
    const [query, setQuery] = useState("");
    //
    // // allows personal accounts to manage files without belonging to an organization
    // // by having user.id as the organization id
    let orgId : string | undefined = undefined;
    if(organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    // user.user.

    const files = useQuery(api.files.getFiles, orgId ? {orgId, query, favorites: false} : "skip");

    const isLoading = files === undefined;
    return (
        <div>
            {isLoading && (
                <div className="flex flex-col gap-8 w-full items-center mt-24">
                    <Loader2 className="h-32 w-32 animate-spin text-gray-500"/>
                    <div className="text-2xl">Loading your files...</div>
                </div>
            )}

            {!isLoading && (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Your files</h1>
                        <SearchBar query={query} setQuery={setQuery}/>
                        <UploadFile orgId={orgId}/>
                    </div>

                    {files.length === 0 && orgId && <Placeholder orgId={orgId}/>}

                    <div className="grid grid-cols-3 gap-4">
                        {files?.map((file) => {
                            return <FileCard key={file._id} file={file}/>;
                        })}
                    </div>
                </>
            )}
            <Toaster/>
        </div>
    )
}

export default FilesPage;
