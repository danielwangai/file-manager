"use client";

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useOrganization, useUser} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";
import UploadFile from "@/app/upload-file";
import {FileCard} from "@/app/file-card";
import Image from "next/image";


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
          {files && files.length === 0 && (
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                  <Image
                      width={300}
                      height={300}
                      src="/no-files.svg"
                      alt="no files"
                  />
                  <div className="text-2xl text-gray-400">You have no files. Upload one now.</div>
                  <UploadFile orgId={orgId}/>
              </div>
          )}
          {files && files.length > 0 && (
              <>
                  <div className="flex flex-row justify-between items-center mb-4">
                      <h1 className="text-4xl font-bold">Your Files</h1>
                      <UploadFile orgId={orgId}/>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                      {files?.map((file) => <FileCard key={file._id} file={file}/>)}
                  </div>
              </>
          )}
          <Toaster/>
      </main>
  );
}
