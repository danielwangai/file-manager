"use client";

import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Button} from "@/components/ui/button";
import {useOrganization, useUser} from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {uploadFileSchema} from "@/lib/validation";


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

    // 1. Define your form.
    const form = useForm<z.infer<typeof uploadFileSchema>>({
        resolver: zodResolver(uploadFileSchema),
        defaultValues: {
            name: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file");

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof uploadFileSchema>) {
        console.log(values)
    }
  return (
    <main className="container mx-auto mt-12">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-950" onClick={() => {

                        }}
                        >
                            Upload File
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Upload File</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>File Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="shadcn" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Select file for upload</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        {...fileRef}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                    </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
        {files?.map((file) => (<p key={file._id}>{file.name}</p>))}
    </main>
);
}
