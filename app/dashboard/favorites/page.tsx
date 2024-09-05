"use client"

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useOrganization, useUser} from "@clerk/nextjs";
import {FileCard} from "@/app/dashboard/file-card";
import React from "react";
import {Loader2} from "lucide-react";
import UploadFile from "@/app/dashboard/upload-file";
import {Toaster} from "@/components/ui/toaster";
import {Placeholder} from "@/app/dashboard/page";

const Favorites = () => {
    const organization = useOrganization();
    let orgId : string | undefined = undefined;
    const user = useUser();
    if(organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }
    const myFavoriteFiles = useQuery(api.files.getFiles, orgId ? {orgId, favorites: true} : "skip");
    const isLoading = myFavoriteFiles === undefined;

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
                        {/*<SearchBar query={query} setQuery={setQuery}/>*/}
                        <UploadFile orgId={orgId}/>
                    </div>

                    {myFavoriteFiles.length === 0 && orgId && <Placeholder orgId={orgId}/>}

                    <div className="grid grid-cols-3 gap-4">
                        {myFavoriteFiles?.map((file) => {
                            return <FileCard key={file._id} file={file}/>;
                        })}
                    </div>
                </>
            )}
            <Toaster/>
        </div>
    )
}

export default Favorites;
