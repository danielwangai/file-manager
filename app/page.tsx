"use client";

import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Button} from "@/components/ui/button";
import {useOrganization, useUser} from "@clerk/nextjs";

export default function Home() {
    const createFile = useMutation(api.files.createFile);
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
    <main className="flex">
        {files?.map((file) => (<p key={file._id}>{file.name}</p>))}
        <div>
            <Button className="bg-amber-400" onClick={() => {
                if(!organization) return;
                createFile({
                    name: "New File 2",
                    orgId: orgId,
                })
            }}
            >
                Add File
            </Button>
        </div>
    </main>
  );
}
